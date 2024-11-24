const express = require('express');
const path = require('path');
const cors = require('cors');
const multer = require('multer');
const fs = require('fs');
const { jsPDF } = require("jspdf");
const { check, validationResult } = require('express-validator')
const mysql = require('mysql2/promise');
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

app.post('/formulario', upload.single('imagen'), [check('precio', 'La edad debe ser numerica').isNumeric(),
                                                  check('precio', 'Casilla vacia').notEmpty(),
                                                  check('nombre', 'Casilla vacia').notEmpty(),
                                                  check('marca', 'Casilla vacia').notEmpty(),
                                                  check('correo', 'Casilla vacia').notEmpty(),
                                                  check('correo', 'El correo no es correcto').isEmail(),
                                                  
], async (req, res) => {

    const result = validationResult(req);

    if (result.isEmpty()){
        const { nombre, precio, marca, correo } = req.body; 
        const imagenPath = req.file ? req.file.path : null; 

        // Guarda los datos en la base de datos
        const query = `
            INSERT INTO Usuarios (Nombre, Correo, Precio, Imagen, Marca)
            VALUES (?, ?, ?, ?, ?)
        `;
        const values = [nombre, correo, precio, imagenPath, marca];

        const [result] = await pool.query(query, values);
        console.log('Usuario insertado con ID:', result.insertId);


        const doc = new jsPDF();

        const Ancho = doc.internal.pageSize.getWidth();
        const x = Ancho / 2;

        doc.setFont('helvetica', 'normal');

        doc.setFontSize(16);
        doc.text('Si tu fueras una galleta', 10, 10);

        doc.setFontSize(12);
        doc.text(`Nombre: ${nombre}`, 140, 30);
        doc.text(`Precio: ${precio} pesos`, 140, 40);
        doc.text(`Marca: ${marca}`, 140, 50);
        doc.text(`Correo: ${correo}`, 140, 60);

        if (imagenPath) {
            const imgData = fs.readFileSync(imagenPath, 'base64');
            const imgBase64 = `data:image/png;base64,${imgData}`;

            doc.addImage(imgBase64, 'PNG', 10, 10, 60, 60);
        }

        const pdfFileName = `PDF-${Date.now()}.pdf`; 
        const pdfPath = path.join(__dirname, "/archivos/", pdfFileName);

        doc.save(pdfPath); 

        res.json({ message: "PDF generado correctamente", pdfPath });
    }

    else{
        res.status(400).json({ errors: result.array() });
        fs.unlinkSync(req.file.path);
        console.log('Valio queso.');
    }
    
});

app.get('/formulario', async (req, res) => {
    
    const { ID } = req.query; 
   
    if (!ID) {
        return res.status(400).json({ errors: [{ msg: 'El parámetro ID es requerido' }] });
    }

    try {
        const [rows] = await pool.query('SELECT ID, Nombre, Correo, Precio, Imagen, Marca FROM usuarios WHERE id = ?', [ID]);

        if (rows.length === 0) {
            return res.status(404).json({ errors: [{ msg: 'Usuario no encontrado' }] });
        }

        res.status(200).json(rows[0]);
    } catch (error) {
        console.error('Error al consultar la base de datos:', error);
        res.status(500).json({ errors: [{ msg: 'Error interno del servidor' }] });
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

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en ${PORT}`);
});

console.log('Credenciales MySQL:', {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
});


    