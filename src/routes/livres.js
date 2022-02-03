const express = require('express')
const connection = require('../helper/db.js')
const Router = express.Router()

Router.get('/', (req, res) => {
  res.send("i am on GET '/' ")
})

Router.get('/read', (req, res) => {
  let sql = 'SELECT * FROM livres'

  connection.query(sql, (err, result) => {
    if (err) {
      console.error(err)
      res.status(500).send('Error retrieving livres from database')
    } else {
      res.json(result)
    }
  })
})

module.exports = Router
