const express = require("express")
const app = express()

app.use('/', express.static('frontend'))

//definire endpoint GET la adresa /hello
app.get('/hello', (request, response) => {
    response.status(200).json({hello:"Miruna;)"})
})


app.listen(8080, () => console.log("Service has started"));