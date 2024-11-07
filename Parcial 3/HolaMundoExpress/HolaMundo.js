const express = require('express')
const app = express();

app.get('/', (req, res) => {
    res.send('Como cuando')
}
)

app.listen(8082, () => {
    console.log(`Hola soy una peticion en npm 🤯: ${8082}`)
}
)