const express = require('express')
const router = require('./router/router')
const mongoose = require('mongoose')
const cors = require('cors')
var bodyParser = require('body-parser')
const {
    mongoUrl
} = require('./config/keys')






const app = express();

app.use(cors())
app.use(bodyParser.urlencoded({
    extended: false
}))
app.use(bodyParser.json())


app.use('/', router)


const PORT = process.env.PORT || 4000;


app.listen(PORT, () => {
    mongoose.connect(mongoUrl, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }, () => {
        console.log('database connected...')
    });
    console.log(`Server is running on port ${PORT}`)
})