export interface IArticle {
  name: string
  link: string[]
  children?: MenuItem[] | null
  createdAt: Date
  lastModified: Date
  ino: number
}

export interface IArticleProps {
  title: string
  link: string
  children: string[] | null
}


interface IMenuItem {
  id: string
  label: string
  path: string
  isMenu: boolean
  children: IMenuItem[]
}
