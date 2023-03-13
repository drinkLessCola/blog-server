import bodyParser from 'body-parser'
import express from 'express'
import { createUser } from '../controller/user'
const router = express.Router()

/* GET home page. */
router.get('/', function (req, res, next) {
  res.send('!!!')
})

router.post('/register', bodyParser.json(), createUser)

export default router
