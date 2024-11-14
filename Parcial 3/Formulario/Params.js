const express = require('express')
const path = require('path');
const app = express();


app.use(express.json());
app.use(express.text());
app.use(express.urlencoded({extended:true}))



app.post('/formulario', (req, res) => {
    console.log(req.body)

    res.send(`Feliz cumpleaños ${req.body.Nombre}, felicidades por tus ${req.body.Edad} primaveras`)

})




app.listen(8082, () => {
    console.log(`Hola soy una peticion en npm: ${8082}`)
})

    