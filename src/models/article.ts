import sequelize, { type InferAttributes, type InferCreationAttributes, type Model } from 'sequelize'
import db from '../database'

export interface IArticleAttributes {
  articleId: string
  title: string
  description: string
  path: string
  parentId: string | null
  parentPath: string
  isPrivate: boolean
  isMenu: boolean
  createdAt: Date
  lastModified: Date
  ino: number
}

export type IArticleCreationAttributes =
  Omit<IArticleAttributes, 'isPrivate' | 'description'> &
  Partial<Pick<IArticleAttributes, 'isPrivate' | 'description'>>

export interface IArticleModel extends Model<
InferAttributes<IArticleModel>,
InferCreationAttributes<IArticleModel, { omit: 'isPrivate' | 'description' }>
> {

  /** @description 结点 Id */
  articleId: string

  /** @description 文章标题 */
  title: string

  /** @description 文章描述 */
  description: string

  /** @description 文章路径 */
  path: string

  /** @description 父结点 Id */
  parentId: string | null

  /** @description 父结点路径 */
  parentPath: string

  isMenu: boolean
  isPrivate: boolean
  createdAt: Date
  lastModified: Date
  ino: number
}

const Article = db.define<IArticleModel>(
  'article',
  {
    ino: {
      type: sequelize.BIGINT,
      primaryKey: true
    },
    articleId: {
      type: sequelize.STRING(64),
      allowNull: false
    },
    title: {
      type: sequelize.STRING(128),
      allowNull: false
    },
    description: {
      type: sequelize.STRING(1024)
    },
    path: {
      type: sequelize.STRING(1024),
      allowNull: false
    },
    parentId: sequelize.STRING(64),
    parentPath: {
      type: sequelize.STRING(1024),
      allowNull: false
    },
    isMenu: {
      type: sequelize.BOOLEAN,
      defaultValue: false
    },
    isPrivate: {
      type: sequelize.BOOLEAN,
      defaultValue: false
    },
    createdAt: {
      type: sequelize.DATE,
      allowNull: false
    },
    lastModified: {
      type: sequelize.DATE,
      allowNull: false
    }
  },
  { tableName: 'Articles' }
)
export default Article
