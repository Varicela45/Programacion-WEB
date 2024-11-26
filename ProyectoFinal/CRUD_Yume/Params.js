const express = require('express');
const path = require('path');
const cors = require('cors');
const multer = require('multer');
const fs = require('fs');
const { jsPDF } = require("jspdf");
const { check, validationResult } = require('express-validator')
const mysql = require('mysql2/promise');
const Swal = require('sweetalert2')
const dotenv = require('dotenv');

require('dotenv').config({ path: path.join(__dirname, '.env') });




dotenv.config();

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
});


const app = express();
app.use('/public', express.static(path.join(__dirname, 'archivos')));

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
      cb(null, path.join(__dirname, '/imagenes/')); 
  },
  filename: function (req, file, cb) {
      cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
  }
});


const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
      const ext = path.extname(file.originalname).toLowerCase();
      if (ext !== '.png') {
          return cb(new Error('Solo se permiten archivos PNG.'));
      }
      cb(null, true);
  }
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());


app.post(
    '/formulario',
    [
        check('nombre', 'El nombre es obligatorio').notEmpty(),
        check('edad', 'La edad es obligatoria y debe ser un número').isNumeric(),
        check('correo', 'El correo es obligatorio y debe ser válido').isEmail(),
        check('pais', 'El país es obligatorio').notEmpty(),
        check('imagen', 'Debe seleccionar una imagen').notEmpty(),
    ],
    async (req, res) => {
        const result = validationResult(req);

        if (!result.isEmpty()) {
            return res.status(400).json({ errors: result.array() });
        }

        const { nombre, edad, correo, pais, imagen } = req.body;

        try {
            const query = `
                INSERT INTO Usuarios (Nombre, Correo, Edad, Imagen, Pais)
                VALUES (?, ?, ?, ?, ?)
            `;
            const values = [nombre, correo, edad, imagen, pais, 'hey'];
            const [dbResult] = await pool.query(query, values);

            const nuevoUsuario = {
                ID: dbResult.insertId, 
                nombre,
                edad,
                correo,
                pais,
                imagen,
            };

            console.log(dbResult.insertId)

            res.status(200).json(nuevoUsuario); 
        } catch (error) {
            console.error('Error al insertar en la base de datos:', error);
            res.status(500).json({
                errors: [{ msg: 'Error al crear el usuario.' }],
            });
        }
    }
);




app.get('/formulario', async (req, res) => {
    const { ID } = req.query;

    if (!ID) {
        return res.status(400).json({ errors: [{ msg: 'El parámetro ID es requerido' }] });
    }

    try {
        const [rows] = await pool.query('SELECT ID, Nombre, Edad, Pais, Correo, Imagen FROM Usuarios WHERE ID = ?', [ID]);

        if (rows.length === 0) {
            return res.status(404).json({ errors: [{ msg: 'Usuario no encontrado' }] });
        }

        const usuario = rows[0];

        res.status(200).json({
            id: usuario.ID,
            nombre: usuario.Nombre,
            edad: usuario.Edad,
            pais: usuario.Pais,
            correo: usuario.Correo,
            imagen: usuario.Imagen || null, 
        });
    } catch (error) {
        console.error('Error al consultar la base de datos:', error);
        res.status(500).json({ errors: [{ msg: 'Error interno del servidor' }] });
    }
});

app.delete('/formulario', async (req, res) => {
    const { ID } = req.body; 

    if (!ID) {
        return res.status(400).json({
            errors: [{ msg: 'El ID es obligatorio.' }],
        });
    }

    try {
        const query = 'DELETE FROM Usuarios WHERE ID = ?';
        const values = [ID];
        const [result] = await pool.query(query, values);

        // Verificar si se eliminó el usuario
        if (result.affectedRows > 0) {
            return res.status(200).json({
                message: `Usuario con ID ${ID} eliminado correctamente.`,
            });
        } else {
            return res.status(404).json({
                errors: [{ msg: `No se encontró un usuario con el ID ${ID}.` }],
            });
        }
    } catch (error) {
        console.error('Error al eliminar el usuario:', error);
        return res.status(500).json({
            errors: [{ msg: 'Hubo un problema al intentar eliminar el usuario.' }],
        });
    }
});




app.put('/formulario', upload.single('imagen'), [
    check('edad', 'La edad debe ser numerica').isNumeric(),
    check('edad', 'Casilla vacia').notEmpty(),
    check('nombre', 'Casilla vacia').notEmpty(),
    check('pais', 'Casilla vacia').notEmpty(),
    check('correo', 'Casilla vacia').notEmpty(),
    check('correo', 'El correo no es correcto').isEmail(),
    check('imagen', 'Debe seleccionar una imagen').notEmpty(),

], async (req, res) => {
    const result = validationResult(req);
    if (result.isEmpty()) {
        const { ID, nombre, edad, pais, correo, imagen } = req.body;

        const query = `UPDATE Usuarios SET Nombre = ?, Correo = ?, Edad = ?, Imagen = ?, Pais = ? WHERE ID = ?`;
        const values = [nombre, correo, edad, imagen, pais, ID];
        await pool.query(query, values);

        const [userResult] = await pool.query(`SELECT * FROM Usuarios WHERE ID = ?`, [ID]);

        const usuario = userResult[0];

        res.status(200).json({
            id: usuario.ID,
            nombre: usuario.Nombre,
            edad: usuario.Edad,
            pais: usuario.Pais,
            correo: usuario.Correo,
            imagen: usuario.Imagen || null, 
        });
    } else {
        res.status(400).json({ errors: result.array() });
        if (req.file) {
            fs.unlinkSync(req.file.path); 
        }
    }
});


(async () => {
    try {
        const connection = await pool.getConnection();
        console.log("Conexión exitosa a la base de datos.");
        connection.release();
    } catch (error) {
        console.error("Error al conectar a la base de datos:", error);
    }
})();

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:3000`);
});

console.log('Credenciales MySQL:', {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
});


    