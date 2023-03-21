import { env } from 'process'

export const ARTICLE_PATH = env.NODE_ENV === 'dev'
  ? 'E:\\nextCloud\\java-script-learning-notes'
  : '/home/files/java-script-learning-notes'

export const DATABASE_HOST = env.NODE_ENV === 'dev'
  ? 'localhost'
  : '43.138.254.32'

export const DATABASE_PORT = env.NODE_ENV === 'dev' ? 3306 : 3307

