import type { IArticleAttributes, IArticleModel } from '../models/article'
import ArticleModel from '../models/article'

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
