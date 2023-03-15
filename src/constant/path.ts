import { env } from 'process'

const ARTICLE_PATH = env.NODE_ENV === 'dev'
  ? 'E:\\nextCloud\\java-script-learning-notes'
  : '/home/files/java-script-learning-notes'

export default ARTICLE_PATH
