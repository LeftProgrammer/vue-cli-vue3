// https://webpack.js.org/guides/dependency-management/#requirecontext
const modulesFiles = require.context('./base', true, /\.js$/)

// you do not need `import app from './modules/app'`
// it will auto require all vuex module from modules file
const apiMap = {}
modulesFiles.keys().forEach((modulePath) => {
  // const moduleName = modulePath.replace(/^\.\/(.*)\.\w+$/, '$1')
  const value = modulesFiles(modulePath)
  Object.assign(apiMap, value)
})
export default apiMap
