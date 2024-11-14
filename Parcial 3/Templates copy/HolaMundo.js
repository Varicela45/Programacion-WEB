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



app.get('/Admin', (req, res) => {
    console.log(req.body)

    // res.send('Hola Minatitlan, para el mundo')

    res.render('admin')
})




app.listen(8082, () => {
    console.log(`Hola soy una peticion en npm: ${8082}`)
})