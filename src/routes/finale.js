const express = require('express')
const connection = require('../helper/db.js')
const Router = express.Router()

Router.get('/', (req, res) => {
  res.send("i am on GET '/' ")
})

Router.get('/read', (req, res) => {
  let sql = 'SELECT * FROM finale'

  connection.query(sql, (err, result) => {
    if (err) {
      console.error(err)
      res.status(500).send('Error retrieving finale from database')
    } else {
      res.json(result)
    }
  })
})

Router.get('/livres', (req, res) => {
  let sql =
    'SELECT id_premier_livre FROM tournoi_du_phoque.finale WHERE votes_premier_livre > votes_second_livre UNION ALL SELECT id_second_livre FROM tournoi_du_phoque.finale AS id_gagnant WHERE votes_second_livre > votes_premier_livre ORDER BY id_premier_livre'

  connection.query(sql, (err, result) => {
    if (err) throw err
    let sql =
      'SELECT id_premier_livre FROM tournoi_du_phoque.finale UNION ALL SELECT id_second_livre FROM tournoi_du_phoque.finale AS id_concurrent ORDER BY id_premier_livre'

    connection.query(sql, (err, result2) => {
      if (err) throw err
      let idTriés = []

      idTriés.push(
        result2[0].id_premier_livre,
        result2[1].id_premier_livre,
        result[0].id_premier_livre
      )

      //----> request pour allez chercher les info bouquins
      let sql =
        'SELECT * FROM tournoi_du_phoque.livres AS livres WHERE id IN (?) UNION ALL SELECT * FROM tournoi_du_phoque.livres AS livres WHERE id IN (?) UNION ALL SELECT * FROM tournoi_du_phoque.livres AS livres WHERE id IN (?);'
      let values = idTriés
      connection.query(sql, values, (err, result3) => {
        if (err) {
          console.error(err)
          res.status(500).send('Error retrieving livres finale from database')
        } else {
          res.json(result3)
        }
      })
    })
  })
})

module.exports = Router
