import sequelize, { type InferAttributes, type InferCreationAttributes, type Model } from 'sequelize'
import db from '../database'

export interface IArticleAttributes {
  articleId: string
  title: string
  path: string
  parentId: string | null
  parentPath: string
  isMenu: boolean
  lastModified: Date
}

export interface IArticleModel extends Model<
InferAttributes<IArticleModel>,
InferCreationAttributes<IArticleModel>
> {

  /** @description 结点 Id */
  articleId: string

  /** @description 文章标题 */
  title: string

  /** @description 文章路径 */
  path: string

  /** @description 父结点 Id */
  parentId: string | null

  /** @description 父结点路径 */
  parentPath: string

  isMenu: boolean
  lastModified: Date
}

const Article = db.define<IArticleModel>(
  'article',
  {
    articleId: {
      type: sequelize.STRING(64),
      primaryKey: true
    },
    title: {
      type: sequelize.STRING(128),
      allowNull: false
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
    lastModified: {
      type: sequelize.TIME,
      allowNull: false
    }
  },
  { tableName: 'Articles' }
)

export default Article
