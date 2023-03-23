import { Sequelize } from 'sequelize'
import { DATABASE_NAME, DATABASE_PORT, DATABASE_PASSWORD, DATABASE_USERNAME, DATABASE_HOST } from '../config'
const sequelize = new Sequelize(
  /* database */DATABASE_NAME,
  /* username */DATABASE_USERNAME,
  /* password */DATABASE_PASSWORD,
  {
    host: DATABASE_HOST,
    port: DATABASE_PORT,
    dialect: 'mysql',
    pool: {
      max: 5,
      min: 0,
      idle: 10000
    },
    define: {
      timestamps: false
    },
    timezone: '+08:00',
    dialectOptions: {
      dateStrings: true,
      typeCast: true
    }
  }
)

export default sequelize
