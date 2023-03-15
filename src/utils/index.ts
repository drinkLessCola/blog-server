export function isUndefined (val: any): boolean {
  return typeof val === 'undefined'
}
export function checkMissingParams (...params: any[]): boolean {
  // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
  const res = params.reduce((sum, param) => sum + !isUndefined(param), 0)
  return res !== params.length
}
