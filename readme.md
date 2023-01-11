# ghetto-mock
mock ur services in a ghetto way, meant to be used via docker-compose mounting volumes with predefined configs


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

### Define your routes in `./<folder>/routes.json`
```js
[
  {
    "method": "GET",
    "route": "/ping",
    /* location of payload, loaded via `require`, so it will work with js/json */
    "payload": "get"
  },
  {
    "method": "POST",
    "route": "/ping",
    "payload": "get"
  }
]
```
### `./<folder>/get.js`
```js
module.exports = { success: true, data: "data from get.js" }
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
version: '3'

services:
  mock-svc:
    container_name:  mock-svc
    ports:
      - 8080:8080
    build:
      context: .
      dockerfile: ./Dockerfile.dev
    volumes:
      - ./src:/app/src/
      - ./example:/app/conf/
```
