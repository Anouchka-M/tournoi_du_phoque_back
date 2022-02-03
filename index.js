const connection = require('./src/helper/db.js')
const cors = require('cors')
const express = require('express')
const morgan = require('morgan')
const bodyParser = require('body-parser')
require('dotenv').config()

const livres = require('./src/routes/livres.js')
const huitieme_de_finale = require('./src/routes/huitieme_de_finale.js')
const quart_de_finale = require('./src/routes/quart_de_finale.js')
const demi_finale = require('./src/routes/demi_finale.js')
const finale = require('./src/routes/finale.js')

const app = express()

app.use(morgan('dev'))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(cors())

app.use('/livres', livres)
app.use('/huitieme_de_finale', huitieme_de_finale)
app.use('/quart_de_finale', quart_de_finale)
app.use('/demi_finale', demi_finale)
app.use('/finale', finale)

const port = process.env.PORT ?? 4242

connection.connect((err) => {
  if (err) {
    console.error('error connecting: ' + err.stack)
  } else {
    console.log('connected as id ' + connection.threadId)
  }
})

let server = app.listen(4242, () => {
  console.log('listening on port', server.address().port)
})
