import dotenv from 'dotenv'
dotenv.config()

export const NODE_ENV = process.env.NODE_ENV ?? 'development'
export const HOST = process.env.HOST ?? 'localhost'
export const PORT = process.env.PORT ?? 3000

export const DATABASE_NAME = process.env.DATABASE_NAME ?? 'blog'
export const DATABASE_HOST = process.env.DATABASE_HOST ?? 'localhost'
export const DATABASE_PORT = Number(process.env.DATABASE_PORT) ?? 3306
export const DATABASE_USERNAME = process.env.DATABASE_USERNAME ?? 'root'
export const DATABASE_PASSWORD = process.env.DATABASE_PASSWORD

export const ARTICLE_PATH = process.env.NODE_ENV === 'development'
  ? 'E:\\nextCloud\\java-script-learning-notes'
  : '/home/files/java-script-learning-notes'

