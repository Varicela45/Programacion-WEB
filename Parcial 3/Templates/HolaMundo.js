const express = require('express')
const path = require('path');
const app = express();

app.set('view engine', 'pug')
app.set('views', path.join(__dirname, 'views'))

// app.use((req, res, next)=>{
//     res.send() //Le contestas al cliente, termina el ciclo
//     next() //Realiza la que sigue
//  })

app.use(express.json());
app.use(express.text());

// app.use((req, res, next)=>{next()},
//          (req, res, next)=>{next()},
//          (req, res, next)=>{next()}
// )

app.get('/Admin', (req, res) => {
    console.log(req.body)

    // res.send('Hola Minatitlan, para el mundo')

    res.render('admin')
})

app.get('/Maestros', (req, res) => {
    console.log(req.query)

    // res.send('Hola Minatitlan, para el mundo')

    res.render('maestros')
})

app.get('/Estudiantes/:Carrera', (req, res) => {
    console.log(req.params)
    // res.send('Hola Minatitlan, para el mundo')

    res.render('estudiante')
})

app.listen(8082, () => {
    console.log(`Hola soy una peticion en npm: ${8082}`)
})