export function isUndefined (val: any): boolean {
  return typeof val === 'undefined'
}
export function checkMissingParams (...params: any[]): boolean {
  // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
  const res = params.reduce((sum, param) => sum + !isUndefined(param), 0)
  return res !== params.length
}

type ITreeType<T> = Array<T & { children: ITreeType<T> }>
export const listToTree = <T, Id extends keyof T, Pid extends keyof Omit<T, Id>>(
  list: T[],
  idProp: Id,
  parentProp: Pid,
  parentId: T[Id] | null = null
): ITreeType<Omit<T, Pid>> => {
  const tree = list
    .filter((item) => item[parentProp] === parentId)
    .map((item) => {
      const { [parentProp]: pid, ...rest } = item
      return {
        ...rest,
        children: listToTree(
          list,
          idProp,
          parentProp,
          item[idProp]
        )
      }
    })

  return tree
}
