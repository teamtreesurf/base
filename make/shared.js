
const fs = require('fs')
const pathResolve = require('path')

module.exports = {
  getSimpleTerm,
  isSimpleTerm,
  doesHaveFind,
  isText,
  getText,
  findPath,
  readNest,
}

function isText(nest) {
  if (nest.line.length > 1) {
    return false
  }

  if (nest.line.length === 0) {
    return false
  }

  let line = nest.line[0]
  if (line.like === 'text') {
    return true
  }

  return false
}

function getText(nest, card) {
  if (nest.line.length > 1) {
    return
  }

  let line = nest.line[0]
  if (line.like !== 'text') {
    return
  }

  const str = []
  line.link.forEach(link => {
    switch (link.like) {
      case 'cord':
        str.push(link.cord)
        break
      case 'nest':
        const text = readNest(link, card)
        str.push(text)
        break
      default:
        throw new Error(card.seed.link)
    }
  })

  return str.join('')
}

function getSimpleTerm(nest) {
  if (nest.line.length > 1) {
    return
  }

  let line = nest.line[0]
  if (line.like !== 'term') {
    return
  }

  if (line.link.length !== 1) {
    return
  }

  let link = line.link[0]
  if (link.like === 'cord') {
    return link.cord
  }
}

function isSimpleTerm(nest) {
  if (nest.line.length > 1) {
    return false
  }

  if (nest.line.length === 0) {
    return false
  }

  let line = nest.line[0]
  if (line.like !== 'term') {
    return false
  }

  if (line.link.length !== 1) {
    return false
  }

  let link = line.link[0]
  if (link.like === 'cord') {
    return true
  }

  return false
}

function doesHaveFind(nest) {
  for (let i = 0, n = nest.line.length; i < n; i++) {
    let line = nest.line[i]
    if (line.like !== 'term') {
      continue
    }

    for (let j = 0, m = line.link.length; j < m; j++) {
      let link = line.link[j]
      if (link.like === 'nest' && link.size === 1) {
        return true
      }
    }
  }

  return false
}

function findPath(link, context = process.cwd()) {
  if (link.startsWith('@treesurf')) {
    link = pathResolve.resolve(link.replace(/@treesurf\/(\w+)/, (_, $1) => `../${$1}.link`))
  } else {
    link = pathResolve.join(context, link)
  }

  if (fs.existsSync(`${link}/base.link`)) {
    link = `${link}/base.link`
  } else if (fs.existsSync(`${link}.link`)) {
    link = `${link}.link`
  } else {
    throw new Error(`Path ${link} not found.`)
  }

  return link
}

function readNest(nest, card) {
  let value = card.seed

  nest.line.forEach(line => {
    switch (line.like) {
      case 'term':
        if (line.link.length > 1) {
          throw new Error(card.seed.link)
        } else {
          const link = line.link[0]
          value = value[link.cord]
        }
        break
      default:
        throw new Error(line.like + ' ' + card.seed.link)
    }
  })
  return value
}