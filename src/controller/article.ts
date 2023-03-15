import ArticleModel from '../models/article'
import { buildArticlesRootRecord, getArticleContent, getArticlesTree } from '../utils/articles'
import { getArticleByPath, getArticlesByParentId, truncateArticle } from '../dao/article'
import type { Context, Next } from 'koa'
import type { IMenuItem } from '../type/article'
import type { IContext } from '../type/middleware'
import filePath from '../constant/path'
// import { Op } from 'sequelize'

const getMenuByParentId = async (parentId: string | null): Promise<IMenuItem[]> => {
  const nodes = await getArticlesByParentId(parentId)
  const menuItems = []
  for (const node of nodes) {
    const { articleId, title, path, isMenu } = node

    const children = await getMenuByParentId(articleId)
    const menuItem: IMenuItem = {
      id: articleId,
      label: title,
      path,
      children,
      isMenu
    }
    menuItems.push(menuItem)
  }
  return menuItems
}

class ArticleController {

  async getMenu (ctx: IContext, next: Next): Promise<void> {
    try {
      ctx.logger.debug('getMenu')
      const menu = await getMenuByParentId(null)
      ctx.status = 200
      ctx.body = {
        code: 200,
        msg: 'success',
        data: menu
      }
      ctx.logger.debug(`[success] ${JSON.stringify(menu)}`)
    } catch (err) {
      ctx.logger.debug(`[error] ${JSON.stringify(err)}`)

      ctx.status = 404
      ctx.body = {
        code: 404,
        msg: '获取文章目录失败！'
      }
    }
  }

  async getSlug (ctx: IContext, next: Next): Promise<void> {
    try {
      ctx.logger.debug('getArticleSlug')
      const slugs = await ArticleModel.findAll({
        attributes: ['path']
      })

      const data = slugs.map(({ path }) => (
        {
          // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
          slug: path.split('/')
        }
      ))

      ctx.body = {
        code: 200,
        msg: 'success',
        data
      }
      ctx.logger.debug(`[success] ${JSON.stringify(data)}`)
    } catch (err) {
      ctx.logger.debug(`[error] ${JSON.stringify(err)}`)
      ctx.body = {
        code: 500,
        msg: '获取 Slug 失败！'
      }
    }
  }

  async getArticle (ctx: Context, next: Next): Promise<void> {
    try {
      ctx.logger.info(`[getArticleByPath] slug=${ctx.params[0]}`)
      const slug = ctx.params[0] ?? ''

      const articleInfo = await getArticleByPath(slug)
      if (!articleInfo) throw new Error()

      const { articleId, title, isMenu, lastModified } = articleInfo
      console.log('articleInfo', articleId, title, isMenu, lastModified)

      const data = {
        articleId,
        title,
        detail: isMenu
          ? await getArticlesByParentId(articleId)
          : getArticleContent(slug),
        lastModified,
        isMenu
      }

      ctx.status = 200
      ctx.body = {
        code: 200,
        msg: 'success',
        data
      }
      ctx.logger.debug(`[success] ${JSON.stringify(data)}`)
    } catch (err) {
      ctx.logger.debug(`[error] ${JSON.stringify(err)}`)
      ctx.throw(404, '获取文章详情失败！')
    }
  }

  async init (ctx: Context, next: Next): Promise<void> {
    ctx.logger.info('[initArticleDB]')
    const articleRoots = getArticlesTree(filePath)
    await truncateArticle()
    await buildArticlesRootRecord(articleRoots)
  }
}

export default new ArticleController()
