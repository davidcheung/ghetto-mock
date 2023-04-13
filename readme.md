# ghetto-mock

## Usage
The intented use is you spin this up a mock service as a container using `docker-compose`, and the entire service is configuration driven mounted as a volume at `/app/conf/` of the container, the entry point is `config.json`


## Mocking a service

```yml
version: '3'

services:
  mock-svc:
    image: davidcheung/ghetto-mock:latest
    volumes:
    # Mount your folder with routes/payloads to the image
    - ./<folder>:/app/conf/
```

## `config.json` defines the router
routes executed are determined `req.url.includes(route)` by top to bottom of the config using `Array.find`
```js
[
  {
    "method": "POST",
    "route": "/ping",
    /* location of payload, loaded via `require`, so it will work with js/json */
    "payloadPath": "post.json"
  },
  {
    "method": "GET",
    "route": "/ping",
    /* location of payload, loaded via `require`, so it will work with js/json */
    "payloadPath": "get"
  },
  {
    "route": "/",
    "payload": { // payload takes precedence over payloadPath
      "success": true
    },
    "log": "${new Date()} - ${req.url}"
  }
]
```
### `./<folder>/get.js`
```js
module.exports = (req) => ({ success: true, data: req.url })
```

### `./<folder>/post.json`
```json
{
  "success": "true",
  "data": "data from Post.json"
}
```

## Development
```yml
# For development
version: '3'

services:
  mock-random-service:
    # container_name:  mock-svc
    ports:
      - 8080:8080
    build:
      context: .
      dockerfile: ./Dockerfile.dev
    volumes:
      - ./src:/app/src/
      - ./example/config:/app/conf/

```
