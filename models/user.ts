import sequelize from 'sequelize'
import type { InferAttributes, InferCreationAttributes, Model } from 'sequelize'
import db from '../database'

export interface IUserAttributes {
  userId: number
  isDelete: boolean
  userName: string
  password: string
  email: string
}
export type IUserCreationAttributes = Pick<IUserAttributes, 'userName' | 'password' | 'email'>

interface IUserModel extends Model<
InferAttributes<IUserModel>,
InferCreationAttributes<IUserModel, { omit: 'userId' | 'isDelete' | 'createdAt' }>
> {
  userId: number
  userName: string
  password: string
  email: string
  isDelete: boolean
  createdAt: Date
}

const User = db.define<IUserModel>('user',
  {
    userId: {
      type: sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    isDelete: {
      type: sequelize.BOOLEAN,
      defaultValue: false
    },
    userName: {
      type: sequelize.STRING(20),
      allowNull: false
    },
    password: {
      type: sequelize.STRING(100),
      allowNull: false
    },
    email: {
      type: sequelize.STRING(100),
      allowNull: false
    },
    createdAt: sequelize.DATE
  },
  { tableName: 'Users' }
)

export default User
