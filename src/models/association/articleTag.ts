import { DataTypes } from 'sequelize'
import db from '../../database'
import TagModel from '../tag'
import ArticleModel from '../article'


const ArticleTag = db.define('articleTag', {
  tagId: {
    type: DataTypes.INTEGER,
    references: {
      model: TagModel,
      key: 'tagId'
    }
  },
  articleId: {
    type: DataTypes.BIGINT,
    references: {
      model: ArticleModel,
      key: 'ino'
    }
  }
},
{
  tableName: 'ArticleTag'
})
ArticleModel.belongsToMany(TagModel, { through: ArticleTag })
TagModel.belongsToMany(ArticleModel, { through: ArticleTag })

void db.sync()
export default ArticleTag
