import type { InferAttributes, InferCreationAttributes, Model } from 'sequelize'
import sequelize from 'sequelize'
import db from '../database'
export interface ITagAttributes {
  tagId: number
  tag: string
}

export interface ITagModel extends Model<
InferAttributes<ITagModel>,
InferCreationAttributes<ITagModel>
> {
  tagId: number
  tag: string
}

const Tag = db.define<ITagModel>(
  'tag',
  {
    tagId: {
      type: sequelize.INTEGER,
      primaryKey: true
    },
    tag: {
      type: sequelize.STRING(64),
      allowNull: false
    }
  },
  { tableName: 'Tags' }
)

export default Tag
