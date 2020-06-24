# Next.js Micro Boilerplate

Minimum Application Stack with which you can develop and deploy next.js application with Docker Compose.

This repogitory is a set of three templates provided with the following docker containers:

* Nginx (Web server enables HTTPS with by using Let's Encrypt)
* Next.js (Serverside Renderable React Frontend) 
* Node.js (Backend Application provides data for Next.js)


![Overview](https://user-images.githubusercontent.com/3450879/85508415-fb5abc80-b62e-11ea-9c40-b38a81141e44.jpg)


All application code is written with TypeScript.

## Local Development

Define and load Environment Variables. We recommend to load these variable with [direnv](https://github.com/direnv/direnv) .

```bash
# Email of the Let's Encrypt account.
export CERT_EMAIL=

# domain of the certificate
export CERT_DOMAINS=

# the webroot of the Let's Encrypt
export CERT_WEB_ROOT=

# the output path of the certificate
export CERT_PATH=

# Docker api host name
export API_DOCKER_HOST_NAME=api

# backend api port
export API_PORT=3333

# backend api port accessible from host
export API_PORT_HOST=3333

# frontend (Next.js) port accessible from host machine.
export FRONT_PORT_HOST=3000

# next.js backend api endpoint requested in Next.js Clientside.
export FRONT_API_ENDPOINT_CLIENT=http://localhost:3333

# next.js backend api endpoint requested in Next.js Serverside.
# It can be same with FRONT_API_ENDPOINT_CLIENT when deploying to production.
export FRONT_API_ENDPOINT_SERVER=http://api:3333
```

```bash
docker-compose -f docker-compose.dev.yml up 
```

```bash
open http://localhost:3000
```

