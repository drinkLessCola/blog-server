import log4js from 'log4js'
log4js.addLayout('json', (config) => function (logEvent) {
  const { context: { uid = '', trace: traceId = '', path = '', cost = '' } } = logEvent
  return JSON.stringify({
    env: process.env.NODE_ENV ?? '',
    uid,
    traceId,
    path,
    cost,
    ...logEvent
  }, null, 0) + config.seperator
})

log4js.configure({
  appenders: {
    global: {
      type: 'dateFile',
      filename: 'logs/global',
      pattern: '.yyyy-MM-dd.log',
      alwaysIncludePattern: true,
      layout: {
        type: 'json',
        seperator: ''
      }
    }
  },
  categories: {
    default: {
      appenders: ['global'],
      level: 'debug'
    }
  }
})

const getLogger = log4js.getLogger
export default getLogger
// export default logger
