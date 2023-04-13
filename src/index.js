const http = require('http')

const host = process.env.HOST || '0.0.0.0'
const port = process.env.PORT || 8080
const contentPath = process.env.CONTENT_PATH || '../conf/'
const routesFileName = process.env.ROUTES_FILE_NAME || 'config.json'

const routes = require(`${contentPath}${routesFileName}`)

const requestListener = function (req, res) {
  res.setHeader('Content-Type', 'application/json')
  // CORS headers
  if (process.env.CORS || process.env.CORS_ORIGIN) {
    res.setHeader('Access-Control-Allow-Headers','content-type')
    res.setHeader('Access-Control-Allow-Credentials','true')
    res.setHeader('Access-Control-Allow-Origin',process.env.CORS_ORIGIN || "*")
    res.setHeader('Access-Control-Allow-Methods','GET, POST, OPTIONS, PUT, PATCH, DELETE')
    if(req.method === 'OPTIONS') {
      res.statusCode = 204
      return res.end()
    }
  }

  // router lol
  const match = routes.find(({route, method}) => {
    const methodMatch = method ? req.method.toLowerCase() == method.toLowerCase() : true
    const routeMatch = req.url.includes(route)

    return routeMatch && methodMatch
  })

  if (!match) {
    res.statusCode = 404
    return res.end("not found")
  }

  // This will literally eval anything, living on the edge
  // if you run this on a real server they can probably `rm rf` you
  match.log ? console.log(eval('`'+match.log+'`')) : console.log(`${req.method} - ${req.url}`)


  if (match.payload) {
    res.end(JSON.stringify(match.payload))
  } else if (match.payloadPath) {
    try {
      const payload = require(`${contentPath}${match.payloadPath}`)
      if (typeof payload === 'function') {
        res.end(JSON.stringify(payload(req, res)))
      } else {
        res.end(JSON.stringify(payload))
      }
    } catch (e) {
      res.statusCode = 404
      res.end("content not found")
    }
  }

}

const server = http.createServer(requestListener)
server.listen(port, host, () => {
  console.log(`Server is running on http://${host}:${port}`)
})
