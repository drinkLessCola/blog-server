import type { ExpressMiddlewareWithRequest, ExpressMiddleware } from '../type/express'
import ArticleModel from '../models/article'
import type { IArticleModel, IArticleAttributes } from '../models/article'
import { getArticleContent } from '../src/articles'
// import { Op } from 'sequelize'

/**
 * 添加一条文件记录
 * @returns 新增文件记录的 articleId
 */
export const addArticle = async ({
  ino,
  title,
  path,
  parentId,
  parentPath,
  isMenu,
  lastModified
}: Omit<IArticleAttributes, 'articleId'>): Promise<string> => {
  const isInoExist = await ArticleModel.findOne({
    where: { ino }
  })
  if (isInoExist) {
    console.log('ino exist', ino)
    return isInoExist.articleId
  }

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
    lastModified,
    ino
  }

  await ArticleModel.create(article)
  return articleId
}

export const findArticleByPath = async (path: string): Promise<IArticleModel | null> => {
  const res = await ArticleModel.findOne({
    where: {
      path
    },
    attributes: ['articleId', 'title', 'isMenu', 'lastModified']
  })
  return res
}

/**
 * 文件内容更新，更新记录的最后修改时间
 */
export const updateArticle = async ({
  ino,
  lastModified
}: Pick<IArticleAttributes, 'ino' | 'lastModified'>): Promise<void> => {
  await ArticleModel.update({
    lastModified
  }, {
    where: { ino }
  })
}

/**
 * 删除指定 path 的文件记录
 * @param path
 */
export const removeArticle = async (path: IArticleAttributes['path']): Promise<void> => {
  await ArticleModel.destroy({
    where: { path }
  })
}

export const getArticleByIno = async (ino: number): Promise<IArticleModel | null> => {
  const article = await ArticleModel.findOne({
    where: { ino }
  })
  return article
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
    const articleInfo = await findArticleByPath(slug)
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


export const truncateArticle = async (): Promise<void> => {
  await ArticleModel.destroy({
    truncate: true
  })
}
