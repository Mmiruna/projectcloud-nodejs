const express = require("express")
const app = express()

app.use(express.static(__dirname + "/frontend"));

//definire endpoint GET la adresa /hello
app.get('/hello', (request, response) => {
    response.status(200).json({hello: process.env})
})


app.listen(process.env.PORT||8080, () => console.log("Service has started"));