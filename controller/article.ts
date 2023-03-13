import type { ExpressMiddlewareWithRequest, ExpressMiddleware } from '../type/express'
import ArticleModel from '../models/article'
import type { IArticleModel, IArticleAttributes } from '../models/article'
import { getArticleContent } from '../src/articles'

export const addArticle = async (
  title: string,
  path: string,
  parentId: string | null,
  parentPath: string,
  isMenu: boolean,
  lastModified: Date
// eslint-disable-next-line max-params
): Promise<string> => {
  const { count: SiblingNum } = await ArticleModel.findAndCountAll({
    where: { parentId: parentId }
  })

  const articleId = (parentId ?? '') + `000${SiblingNum + 1}`.slice(-4)

  const article: IArticleAttributes = {
    articleId,
    title,
    path,
    parentId,
    parentPath,
    isMenu,
    lastModified
  }

  await ArticleModel.create(article)
  return articleId
}

export const getArticlesByParentId = async (parentId: string | null): Promise<IArticleModel[]> => {
  const menuItems = await ArticleModel.findAll({
    where: {
      parentId
    }
  })
  return menuItems
}

interface IMenuItem {
  id: string
  label: string
  path: string
  isMenu: boolean
  children: IMenuItem[]
}

export const getMenuByParentId = async (parentId: string | null): Promise<IMenuItem[]> => {
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

export const getMenu: ExpressMiddleware = async (req, res) => {
  try {
    const menu = await getMenuByParentId(null)
    res.send({
      code: 200,
      msg: 'success',
      data: menu
    })
  } catch (err) {
    res.send({
      code: 500,
      msg: '获取文章目录失败！'
    })
  }

}

export const getArticleSlug: ExpressMiddleware = async (req, res) => {
  console.log('getArticleSlug')
  try {
    const slugs = await ArticleModel.findAll({
      attributes: ['title', 'parentPath']
    })

    const data = slugs.map(({ title, parentPath }) => (
      {
        // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
        slug: parentPath
          ? `${parentPath}/${title}`.split('/')
          : [title]
      }
    ))

    res.send({
      code: 200,
      msg: 'success',
      data
    })
  } catch (err) {
    res.send({
      code: 500,
      msg: '获取 Slug 失败！'
    })
  }

}

export const getArticleByPath: ExpressMiddlewareWithRequest<{ slug?: string }> = async (req, res) => {
  try {
    console.log('slug', req.params[0])
    const slug = req.params[0] ?? ''

    console.log('articleInfo', slug)
    const articleInfo = await ArticleModel.findOne({
      where: {
        path: slug
      },
      attributes: ['articleId', 'title', 'isMenu', 'lastModified']
    })
    console.log(articleInfo, slug)

    if (!articleInfo) throw new Error()

    const { articleId, title, isMenu, lastModified } = articleInfo
    console.log('articleInfo', articleId, title, isMenu, lastModified)
    res.send({
      code: 200,
      msg: 'success',
      data: {
        articleId,
        title,
        detail: isMenu
          ? await getArticlesByParentId(articleId)
          : getArticleContent(slug),
        lastModified,
        isMenu
      }
    })
  } catch (err) {
    console.log(err)
    res.send({
      code: 500,
      msg: '获取文章详情失败！'
    })
  }
}

