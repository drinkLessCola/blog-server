const STATUS = {
  SUCCESS: {
    code: 200,
    msg: 'ok'
  },
  ERROR: {
    code: 500,
    msg: '服务端出错'
  },
  MISSING_PARAMETER: {
    code: 403,
    msg: '缺少参数'
  }
}

export default STATUS
