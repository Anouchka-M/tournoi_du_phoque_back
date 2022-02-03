const express = require('express')
const connection = require('../helper/db.js')
const Router = express.Router()

Router.get('/', (req, res) => {
  res.send("i am on GET '/' ")
})

Router.get('/read', (req, res) => {
  let sql = 'SELECT * FROM demi_finale'

  connection.query(sql, (err, result) => {
    if (err) {
      console.error(err)
      res.status(500).send('Error retrieving demi_finale from database')
    } else {
      res.json(result)
    }
  })
})

Router.get('/livres', (req, res) => {
  let sql =
    'SELECT id_premier_livre FROM tournoi_du_phoque.demi_finale WHERE votes_premier_livre > votes_second_livre UNION ALL SELECT id_second_livre FROM tournoi_du_phoque.demi_finale AS id_gagnant WHERE votes_second_livre > votes_premier_livre ORDER BY id_premier_livre'

  connection.query(sql, (err, result) => {
    if (err) throw err
    let sql =
      'SELECT id_premier_livre FROM tournoi_du_phoque.demi_finale UNION ALL SELECT id_second_livre FROM tournoi_du_phoque.demi_finale AS id_concurrent ORDER BY id_premier_livre'

    connection.query(sql, (err, result2) => {
      if (err) throw err
      let concurrents = []
      let gagnants = []
      let idTriés = []
      let idTriésTrio = []

      result2.map((id) => concurrents.push(id.id_premier_livre))
      result.map((id) => gagnants.push(id.id_premier_livre))

      let index_gagnants = 0
      for (let index_ID = 0; index_ID < concurrents.length; index_ID += 2) {
        idTriés.push(
          concurrents[index_ID],
          concurrents[index_ID + 1],
          gagnants[index_gagnants]
        )
        index_gagnants++
      }

      //----> ton code pour le filtre //[[1,2,2],[3,4,4]]

      for (let i = 0; i < idTriés.length; i += 3) {
        idTriésTrio.push([idTriés[i], idTriés[i + 1], idTriés[i + 2]])
      }

      //----> request pour allez chercher les info bouquins
      let tableauResult = []
      for (let i = 0; i < idTriésTrio.length; i++) {
        let sql =
          'SELECT * FROM tournoi_du_phoque.livres AS livres WHERE id IN (?) UNION ALL SELECT * FROM tournoi_du_phoque.livres AS livres WHERE id IN (?) UNION ALL SELECT * FROM tournoi_du_phoque.livres AS livres WHERE id IN (?);'
        let values = idTriésTrio[i]
        connection.query(sql, values, (err, result3) => {
          if (err) {
            console.error(err)
            res
              .status(500)
              .send('Error retrieving livres demi finale from database')
          } else {
            console.log(result3)
            tableauResult.push(result3)
            if (tableauResult.length === 2) {
              console.log(tableauResult)
              res.json(tableauResult)
            }
          }
        })
      }
    })
  })
})

module.exports = Router
