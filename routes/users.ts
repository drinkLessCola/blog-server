import express from 'express'
import { getUserList } from '../controller/user'
const router = express.Router()

/* GET users listing. */
router.get('/', getUserList)

export default router

