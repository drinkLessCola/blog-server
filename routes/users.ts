import express from 'express'
import bodyParser from 'body-parser'
import UserController, { createUser } from '../controller/user'
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/register', bodyParser.json(), createUser)

export default router

