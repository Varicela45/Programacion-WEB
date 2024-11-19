const express = require('express');
const path = require('path');
const cors = require('cors');
const multer = require('multer');
const fs = require('fs');
const { jsPDF } = require("jspdf");

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
app.use(cors());

app.post('/formulario', upload.single('imagen'), (req, res) => {
    const { nombre, edad } = req.body; // Obtén los datos del formulario
    const imagenPath = req.file ? req.file.path : null; // Ruta de la imagen subida

    const doc = new jsPDF();

    const Ancho = doc.internal.pageSize.getWidth();
    const x = Ancho / 2;

    doc.setFont('helvetica', 'bold')
    doc.text(`Hola ${nombre}, tienes ${edad} años.`, x, 10, { align: 'center' });

    if (imagenPath) {
        // Leer la imagen y convertirla a base64
        const imgData = fs.readFileSync(imagenPath, 'base64');
        const imgBase64 = `data:image/png;base64,${imgData}`;
        doc.addImage(imgBase64, 'PNG', 10, 20, 50, 50, { align: 'center' }); // Agregar imagen al PDF
    }

    const pdfFileName = `PDF-${Date.now()}.pdf`; // Nombre único basado en la marca de tiempo
    const pdfPath = path.join(__dirname, "/archivos/", pdfFileName);

    doc.save(pdfPath); // Guarda el PDF

    res.json({ message: "PDF generado correctamente", pdfPath });
});

app.listen(8082, () => {
    console.log(`Servidor corriendo en http://localhost:8082`);
});


    