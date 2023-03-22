/* eslint-disable @typescript-eslint/no-misused-promises */
import { basename, extname, resolve, sep, normalize } from 'node:path'
import { readFileSync, readdirSync, statSync } from 'node:fs'
import type { Stats } from 'node:fs'
import type { IArticle } from '../type/article'
import {
  createArticle,
  getArticleByPath,
  removeArticle,
  updateArticle
} from '../dao/article'
import chokidar from 'chokidar'
import { ARTICLE_PATH } from '../constant/path'

const OLD_ARTICLE_PATH = 'E:\\js\\java-script-learning-notes'
// export const path = resolve(__dirname, '../')
// /home/workspace/nextcloud/data/zirina
// export const path = normalize('/home/files/java-script-learning-notes')
// console.log(path)
// export const srcPath = resolve(path, '../article')
// export const distPath = resolve(srcPath, 'dist')


const handlePath = (_path: string): { path: string, parentPath: string, filename: string } => {
  _path = normalize(_path.replace(`${ARTICLE_PATH}${sep}`, ''))

  const link = _path.split(sep)
  const path = link.join('/')
  const parentPath = link.slice(0, -1).join('/')
  const filename = basename(path)
  return {
    path,
    parentPath,
    filename
  }
}


const watcher = chokidar.watch(ARTICLE_PATH, {
  ignored: /(^|[/\\])\../, // ignore dotfiles
  ignoreInitial: true,
  persistent: true,
  cwd: ARTICLE_PATH,
  atomic: true,
  awaitWriteFinish: true
})

// Something to use when events are received.
const log = console.log.bind(console)
const handleAdd = async (_path: string, stats: Stats): Promise<void> => {
  const { path, parentPath } = handlePath(_path)
  const parent = await getArticleByPath(parentPath)
  const isMenu = stats.isDirectory()

  // getParentId
  await createArticle({
    title: basename(path, '.md'),
    path,
    parentId: parent ? parent.articleId : null,
    parentPath,
    isMenu,
    createdAt: stats.ctime,
    lastModified: stats.mtime,
    ino: stats.ino
  })
}
const handleChange = async (_path: string, stats: Stats): Promise<void> => {
  const { ino } = stats

  await updateArticle({
    ino,
    lastModified: stats.mtime
  })
}

const handleRemove = async (_path: string): Promise<void> => {
  const { path } = handlePath(_path)

  console.log('remove', path)
  await removeArticle(path)
}
// Add event listeners.
watcher
  .on('add', async (path, stats) => {
    log(`File ${path} has been added`)
    if (!stats) return
    await handleAdd(path, stats)
  })
  .on('change', async (path, stats) => {
    log(`File ${path} has been changed`)
    if (!stats) return
    await handleChange(path, stats)
  })
  .on('unlink', async path => {
    log(`File ${path} has been removed`)
    await handleRemove(path)
  })
  .on('addDir', async (path, stats) => {
    log(`Directory ${path} has been added`)
    if (!stats) return
    await handleAdd(path, stats)
  })
  .on('unlinkDir', async path => {
    log(`Directory ${path} has been removed`)
    await handleRemove(path)
  })
  .on('error', error => {
    log(`Watcher error: ${error.toString()}`)
  })
  .on('ready', () => {
    log('Initial scan complete. Ready for changes')
  })

// watch.createMonitor(ARTICLE_PATH, function (monitor) {
//   monitor.on('created', async (_path, stat) => {
//     console.log('created', _path)
//     const { path, parentPath } = handlePath(_path)
//     const parent = await getArticleByPath(parentPath)
//     const isMenu = stat.isDirectory()

//     // getParentId
//     const articleId = await createArticle({
//       title: basename(path, '.md'),
//       path,
//       parentId: parent ? parent.articleId : null,
//       parentPath,
//       isMenu,
//       lastModified: stat.mtime,
//       ino: stat.ino
//     })

//     if (isMenu) {
//       const articleNodes = getArticlesTree(_path)
//       await buildArticlesRecord(articleNodes, articleId, path)
//     }
//   })

//   monitor.on('changed', async (_path, stat, prevStat) => {
//     console.log('changed', _path)
//     const { ino } = stat

//     await updateArticle({
//       ino,
//       lastModified: stat.mtime
//     })
//   })

//   monitor.on('removed', async (_path, stat) => {
//     const { path } = handlePath(_path)
//     const article = await getArticleByPath(path)
//     if (!article) return

//     const { articleId } = article
//     console.log('remove', _path)
//     await removeArticle(articleId)
//   })
// })


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

    const name = basename(dirItem.name)
    const fileStats = statSync(normalize(`${dir}/${name}`))
    const children = isDirectory
      ? getArticlesTree(resolve(dir, dirItem.name), deep + 1)
      : null

    const article: IArticle = {
      name,
      link: normalize(`${dir}/${name}`)
        .split(sep)
        .slice(-deep),
      children,
      createdAt: fileStats.ctime,
      lastModified: fileStats.mtime,
      ino: fileStats.ino
    }

    articles.push(article)
  }
  return articles
}

export function getArticleCreatedAt (path: string): Date {
  const fileStats = statSync(normalize(`${OLD_ARTICLE_PATH}/${path}`))
  console.log(normalize(`${OLD_ARTICLE_PATH}/${path}`))
  return fileStats.birthtime
}

async function buildArticlesRecord (
  articleNodes: IArticle[],
  parentId: string,
  parentPath: string
): Promise<void> {
  for (const articleNode of articleNodes) {
    const { name, children, createdAt, lastModified, ino } = articleNode
    const path = `${parentPath}/${name}`
    const articleId = await createArticle({
      title: basename(name, '.md'),
      path,
      parentId,
      parentPath,
      isMenu: Boolean(children),
      createdAt,
      lastModified,
      ino
    })

    if (children != null)
      await buildArticlesRecord(children, articleId, path)
  }
}

export async function buildArticlesRootRecord (articleRoots: IArticle[]): Promise<void> {
  for (const articleRoot of articleRoots) {
    const { name, link, children, createdAt, lastModified, ino } = articleRoot
    const path = link.join('/')
    const articleId = await createArticle({
      title: basename(name, '.md'),
      path,
      parentId: null,
      parentPath: '',
      isMenu: Boolean(children),
      createdAt,
      lastModified,
      ino
    })

    if (children != null)
      await buildArticlesRecord(children, articleId, path)
  }
}

export const getArticleContent = (path: string): string => {
  // 没有指定编码，readFileSync 返回的结果为 Buffer，指定后为 string
  const content = readFileSync(resolve(ARTICLE_PATH, path), 'utf-8')
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

