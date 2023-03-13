import express from 'express'
import { getArticleByPath, getArticleSlug, getMenu } from '../controller/article'
const router = express.Router()

router.get('/menu', getMenu)
router.get('/slug', getArticleSlug)
router.get('/*', getArticleByPath)
export default router

