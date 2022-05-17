const loaderUtils = require('loader-utils')

const filenameReservedRegex = /[<>:"/\\|?*\x00-\x1F]/g
const reControlChars = /[\u0000-\u001f\u0080-\u009f]/g
const reRelativePath = /^\.+/

function getCssModuleLocalIdent(
  loaderContext,
  localIdentName,
  localName,
  options,
) {
  const uiPrefix = ['el-']
  for (let ele of uiPrefix) {
    if (localName.startsWith(ele)) return localName
  }

  if (!options.context) {
    options.context = loaderContext.rootContext
  }
  let identName = `[path]`
  if (!loaderContext.resourcePath.match(/index\.module\.(less)$/))
    identName += `[name]`
  let className = loaderUtils
    .interpolateName(loaderContext, identName, options)
    .replace(filenameReservedRegex, '-')
    .replace(reControlChars, '-')
    .replace(reRelativePath, '-')
    .toLowerCase()
    .replace(/\./g, '-')
    .replace(/-$/, '')
    .replace('-module', '')
    .replace(/^src-/, '')
    .replace(/^components-/, 'comp-')
    .replace(/^views-/, 'v-')

  className += `__${localName}`

  return className
}

module.exports = {
  lintOnSave: false,
  devServer: {
    port: 8090,
    overlay: {
      wranings: false,
    },
  },
  css: {
    requireModuleExtension: true,
    loaderOptions: {
      css: {
        modules: {
          // localIdentName: '[path]__[name]__[local]',
          getLocalIdent: (context, localIdentName, localName, options) => {
            let className = getCssModuleLocalIdent(
              context,
              localIdentName,
              localName,
              options,
            )
            return className
          },
        },
      },
    },
  },
}
