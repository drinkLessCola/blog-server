import { env } from 'process'

export const ARTICLE_PATH = env.NODE_ENV === 'development'
  ? 'E:\\nextCloud\\java-script-learning-notes'
  : '/home/files/java-script-learning-notes'


