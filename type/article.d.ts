export interface IArticle {
  name: string
  link: string[]
  children?: MenuItem[] | null
  lastModified: Date
  ino: number
}

export interface IArticleProps {
  title: string
  link: string
  children: string[] | null
}
