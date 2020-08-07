const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const dotenv = require("dotenv");

const app = express()
dotenv.config()

app.use(cors())
app.use(bodyParser.json())

const db = require('./database')

//get data from database
db.connect((err) => {
    if(err) {
        console.log(err)
        return 
    }
    console.log(`DB Connected as id : ${db.threadId}` )
})

//home route
app.get('/', (req, res) => {
    res.status(200).send(`<h1>welcome to review api</h1>`)
})

//apply router
const { prokatRouter, userRouter, produkRouter } = require('./routers')
app.use('/api/', prokatRouter)
app.use('/api/', userRouter)
app.use('/api/', produkRouter)

//binding / host di computer local
const PORT = process.env.PORT
app.listen(PORT, () => console.log(`server is running at port ${PORT}`))