const express = require('express')
const path = require('path');
const multer = require('multer');
const app = express();

const folder = path.join(__dirname + '/archivos/')
const upload = multer({dest:folder})

app.use(express.json());
app.use(express.text());
app.use(upload.single('archivo'))


app.post('/formulario', (req, res) => {
    // console.log(`Se recibio el archivo: ${req.file.originalname}`)
    console.log(req.body)
    // console.log('Se recibio el formulario: ' + JSON.stringify(req.body))
    res.json(req.body)
    // res.send(`Hola ${req.body.nombre}`)
})




app.listen(8082, () => {
    console.log(`Hola soy una peticion en npm: ${8082}`)
})

    