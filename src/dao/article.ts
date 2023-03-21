import sequelize, { Op, Sequelize } from 'sequelize'
import type { IArticleAttributes, IArticleCreationAttributes, IArticleModel } from '../models/article'
import ArticleModel from '../models/article'
import Tag from '../models/tag'

/**
 * 添加一条文章记录
 * @returns 新增文章记录的 articleId
 */
export const createArticle = async ({
  ino,
  title,
  path,
  parentId,
  parentPath,
  isMenu,
  createdAt,
  lastModified
}: Omit<IArticleCreationAttributes, 'articleId'>): Promise<string> => {
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

  const article: IArticleCreationAttributes = {
    articleId,
    title,
    path,
    parentId,
    parentPath,
    isMenu,
    createdAt,
    lastModified,
    ino
  }

  await ArticleModel.create(article)
  return articleId
}

/**
 * 根据 path 查询文章
 * @param path
 * @returns
 */
export const getArticleByPath = async (path: string): Promise<IArticleModel | null> => {
  const res = await ArticleModel.findOne({
    where: {
      path
    },
    attributes: ['articleId', 'title', 'isMenu', 'lastModified']
  })
  return res
}

/**
 * 根据 ino 查询文章
 * @param ino
 * @returns
 */
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

interface IArticleListInDate {
  // date: number
  date: string
  articles: IArticleModel[]
}

export const getArticleInTimeOrder = async (): Promise<IArticleListInDate[]> => {
  const articleCreatedDate = await ArticleModel.findAll({
    where: {
      isMenu: false
    },
    attributes: [
      [Sequelize.fn('date_format', Sequelize.col('createdAt'), '%Y-%m-%d'), 'createDate']
    ],
    order: [['createdAt', 'DESC']],
    group: ['createDate']
    // group: [sequelize.fn('DATE', sequelize.col('createdAt')), 'Date']
  }) as Array<IArticleModel & { dataValues: { createDate: string } }>

  const list = await Promise.all(articleCreatedDate.map(async (createdDate) => {
    const date = createdDate.dataValues.createDate
    const articles = await ArticleModel.findAll({
      where: {
        [Op.and]: [
          sequelize.where(sequelize.fn('date_format', Sequelize.col('createdAt'), '%Y-%m-%d'), date),
          { isMenu: false }
        ]
      },
      attributes: ['articleId', 'title', 'description', 'path'],
      include: Tag
    })

    return {
      date,
      articles
    }
  }))

  return list
}

export const getArticleList = async (): Promise<IArticleModel[]> => {
  const list = await ArticleModel.findAll()
  return list
}

/**
 * 更新文章的修改时间
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

export const updateArticleCreatedAt = async ({
  path,
  createdAt
}: Pick<IArticleAttributes, 'path' | 'createdAt'>): Promise<void> => {
  await ArticleModel.update({
    createdAt
  }, {
    where: { path }
  })
}

/**
 * 删除指定 path 的文章记录
 * @param path
 */
export const removeArticle = async (path: IArticleAttributes['path']): Promise<void> => {
  await ArticleModel.destroy({
    where: { path }
  })
}

/**
 * 清空文章数据表
 */
export const truncateArticle = async (): Promise<void> => {
  await ArticleModel.destroy({
    truncate: true
  })
}
