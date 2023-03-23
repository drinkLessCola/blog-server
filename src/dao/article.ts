/* eslint-disable curly */
import { Sequelize, col, fn } from 'sequelize'
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
  articles: IArticleAttributes[]
}

export const getArticleInTimeOrder = async (pageIdx: number = 0, pageSize: number = 10): Promise<IArticleListInDate[]> => {
  const list = (await ArticleModel.findAll({
    where: {
      isMenu: false
    },
    attributes: [
      'articleId', 'title', 'description', 'path',
      [Sequelize.fn('date_format', Sequelize.col('createdAt'), '%Y-%m-%d'), 'createDate']
      // [Sequelize.fn('count', Sequelize.col('articleId')), 'count']
    ],
    include: Tag,
    // group: ['createDate'],
    order: [['createDate', 'DESC']]
    // group: [sequelize.fn('DATE', sequelize.col('createdAt')), 'Date']
  }) as Array<IArticleModel & { dataValues: { createDate: string } }>).map(item => item.dataValues)


  const section = list.slice((pageIdx - 1) * pageSize, pageIdx * pageSize)
  const len = section.length
  const articles: IArticleListInDate[] = []

  if (!len) return articles

  let startIdx = 0
  for (let i = 1; i < len; i++) {
    if (section[i].createDate === section[i - 1].createDate) continue
    else {
      const articleInSameDate = section.slice(startIdx, i)
      articles.push({
        date: section[startIdx].createDate,
        articles: articleInSameDate
      })
      startIdx = i
    }
  }
  articles.push({
    date: section[startIdx].createDate,
    articles: section.slice(startIdx)
  })
  // const startIdx = (pageIdx - 1) * pageSize
  // let total = 0
  // articleGroupInDate.some(({ count }) => {
  //   // 0 5 5
  //   // 5 2 5
  // })
  // const list = await Promise.all(date.map(async createdDate => {
  //   const date = createdDate.dataValues.createDate
  //   const articles = await ArticleModel.findAll({
  //     where: {
  //       [Op.and]: [
  //         sequelize.where(sequelize.fn('date_format', Sequelize.col('createdAt'), '%Y-%m-%d'), date),
  //         { isMenu: false }
  //       ]
  //     },
  //     attributes: ['articleId', 'title', 'description', 'path'],
  //     include: Tag
  //   })

  //   return {
  //     date,
  //     articles
  //   }
  // }))

  return articles
}

interface IArticleMonthData {
  month: string
  count: number
}

export const getArticleMonthDataByYear = async (year: number): Promise<IArticleMonthData[]> => {
  const monthData = (await ArticleModel.findAll({
    attributes: [
      [fn('date_format', col('createdAt'), '%c'), 'month'],
      [fn('count', '*'), 'count']
    ],
    where: Sequelize.where(fn('year', col('createdAt')), year),
    group: ['month'],
    order: [['month', 'ASC']]
  })).map(item => item.dataValues) as unknown as IArticleMonthData[]

  return monthData
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
