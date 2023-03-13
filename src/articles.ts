import { basename, extname, resolve, sep, normalize } from 'node:path'
import { readFileSync, readdirSync, statSync } from 'node:fs'
import type { IArticle } from '../type/article'
import watch from 'watch'
import { addArticle } from '../controller/article'
// export const path = resolve(__dirname, '../')
export const path = normalize('E:/nextCloud/java-script-learning-notes')
console.log(path)
export const srcPath = resolve(path, '../article')
export const distPath = resolve(srcPath, 'dist')

const filePath = 'E:\\nextCloud\\java-script-learning-notes'

watch.createMonitor(filePath, function (monitor) {
  monitor.on('created', function (filePath, stat) {
    console.log(filePath)
    console.log('Handle new files')
  })
  monitor.on('removed', function (filePath, stat) {
    console.log(filePath)
    console.log('Handle removed files')
  })
})


/**
 * 获取文章 / 目录的 url 路径
 * @param dir
 * @param deep
 * @returns
 */
export function getArticlesTree (dir: string, deep: number = 1): IArticle[] {
  const articles: IArticle[] = []
  const dirItems = readdirSync(dir, {
    withFileTypes: true,
    encoding: 'utf-8'
  })

  for (const dirItem of dirItems) {
    const isDirectory = dirItem.isDirectory()
    if (!(isDirectory || extname(dirItem.name) === '.md')) continue

    const name = basename(dirItem.name, '.md')
    const fileStats = isDirectory
      ? statSync(normalize(`${dir}/${name}`))
      : statSync(normalize(`${dir}/${name}.md`))
    const children = isDirectory
      ? getArticlesTree(resolve(dir, dirItem.name), deep + 1)
      : null

    const article: IArticle = {
      name,
      link: normalize(`${dir}/${name}`)
        .split(sep)
        .slice(-deep),
      children,
      lastModified: fileStats.mtime
    }

    articles.push(article)
  }
  return articles
}

async function buildArticlesRecord (
  articleNodes: IArticle[],
  parentId: string,
  parentPath: string
): Promise<void> {
  for (const articleNode of articleNodes) {
    const { name, link, children, lastModified } = articleNode
    const path = link.join('/')
    const articleId = await addArticle(name, path, parentId, parentPath, Boolean(children), lastModified)

    if (children != null)
      await buildArticlesRecord(children, articleId, path)
  }
}

export async function buildArticlesRootRecord (articleRoots: IArticle[]): Promise<void> {
  for (const articleRoot of articleRoots) {
    const { name, link, children, lastModified } = articleRoot
    const path = link.join('/')
    const articleId = await addArticle(name, path, null, '', Boolean(children), lastModified)

    if (children != null)
      await buildArticlesRecord(children, articleId, path)
  }
}

export async function initArticlesDB (): Promise<void> {
  const articleRoots = getArticlesTree(filePath)
  await buildArticlesRootRecord(articleRoots)
}

export const getArticleContent = (path: string): string => {
  // 没有指定编码，readFileSync 返回的结果为 Buffer，指定后为 string
  const content = readFileSync(resolve(filePath, `${path}.md`), 'utf-8')
  return content
}
// export function getArticleSlug() {
//   const slugs: Array<string[]> = []
//   const articles = getArticles(srcPath)

//   function getParams(menuItems: Array<IMenuItem>) {
//     menuItems.forEach(menuItem => {
//       slugs.push(menuItem.link)
//       if(menuItem.children) getParams(menuItem.children)
//     })
//   }

//   getParams(articles)
//   return slugs
// }


// export function getArticleProps(slug: string[]): IArticleProps {
//   const path = resolve(srcPath, slug.join('\\'))
//   try {
//     // 是目录
//     const dirents = readdirSync(path, {
//       withFileTypes: true,
//       encoding: 'utf-8',
//     })

//     const children = dirents.map(dirent => dirent.name.replace('.md', ''))

//     return {
//       title: basename(path),
//       children,
//       link: getLinkFromSlug(slug),
//     }
//   } catch(err) {
//     // 是文件
//     return {
//       title: basename(path),
//       children: null,
//       link: getLinkFromSlug(slug),
//     }
//   }
// }

// export function getMenu(): IMenuItem[] {
//   return getArticles(srcPath)
// }

// const files = getFiles(srcPath)

