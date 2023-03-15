import Router from '@koa/router'
import ArticleController from './controller/article'
import UserController from './controller/user'

const router = new Router()

router.get('/', function (ctx, next) {
  ctx.body = '!!!!!!!!!'
})

// article 相关路由
router.get('/article/menu', ArticleController.getMenu)
router.get('/article/slug', ArticleController.getSlug)
router.get('/article/init', ArticleController.init)
router.get('/article/(.*)', ArticleController.getArticle)

// user 相关路由
router.get('/user/', UserController.list)
router.post('/user/register', UserController.create)

export default router
