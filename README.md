# Next.js Micro Boilerplate

Minimum Application Stack with which you can develop and deploy next.js application with Docker Compose.

This repogitory is a set of three templates provided with the following docker containers:

* Nginx (Web server enables HTTPS with by using Let's Encrypt)
* Next.js (Serverside Renderable React Frontend) 
* Node.js (Backend Application provides data for Next.js)


![Overview](https://user-images.githubusercontent.com/3450879/85508415-fb5abc80-b62e-11ea-9c40-b38a81141e44.jpg)


All application code is written with TypeScript.

## Local Development

Define and load Environment Variables. [direnv](https://github.com/direnv/direnv) is highly recommended to load variables.

```bash
# Email of the Let's Encrypt account (production only)
export CERT_EMAIL=

# domain of the certificate (production only)
export CERT_DOMAIN=

# the webroot of the Let's Encrypt (production only)
export CERT_WEB_ROOT=

# the output path of the certificate (production only)
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

![localhost:3000 image](https://user-images.githubusercontent.com/3450879/85510019-c8fe8e80-b631-11ea-8cff-bb27390b14d3.png)

The text "Hello with SSR!" will be shown with ServerSide Rendering.

## Deploy Guide to Amazon Lightsail (Amazon Linux)


* Prerequisite
  * AWS Account
  * Amazon Lightsail instance
  * Your domain and subdomain (If your server instance static IP address were "99.99.99.99", and your domain were "yourdomain.com" and "api.yourdomain.com", DNS need to resolve these domain to "99.99.99.99".)
  
### Set Deploy Key to GitHub repogitory (In case you want to clone private repo)

```bash
cd ~
ssh-keygen -t rsa

# Enter file in which to save the key (/home/ec2-user/.ssh/id_rsa):           
# Enter passphrase (empty for no passphrase): 
# Enter same passphrase again: 
# Your identification has been saved in /home/ec2-user/.ssh/id_rsa.
# Your public key has been saved in /home/ec2-user/.ssh/id_rsa.pub.
```

Enter passphrase and put the generated key (/home/ec2-user/.ssh/id_rsa.pub) to Github Deploy Key in Settings.
For more detail [Github Docs](https://developer.github.com/v3/guides/managing-deploy-keys/)

### Install Docker 

```bash
sudo yum update -y
sudo yum install -y docker
sudo service docker start
sudo usermod -a -G docker ec2-user
```

After running the above command, you need to exit from the instance and log in again.


```bash
sudo -i
# https://docs.docker.com/compose/install/#install-compose-on-linux-systems (Check the link and choose appropriate version of Docker Compose. Here, we install Docker Compose v.1.26.0)

curl -L "https://github.com/docker/compose/releases/download/1.26.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose
exit
docker-compose --version
```

### Install direnv


```bash
sudo yum install golang -y
go version

git clone https://github.com/direnv/direnv
cd direnv
sudo make install
which direnv
```

Open ~/.bashrc .

```bash
vim ~/.bashrc
```

Add the following line to ~/.bashrc .

```bash
eval "$(direnv hook /bin/bash)" 
```

Then reload ~/.bashrc.

```bash
source ~/.bashrc
```


### Install go-acme/lego

Install appropriate varsion of go-acme/lego. We install v.3.7.0 here.

https://github.com/go-acme/lego/releases

```
cd ~
wget https://github.com/go-acme/lego/releases/download/v3.7.0/lego_v3.7.0_linux_amd64.tar.gz
tar -zxvf lego_v3.7.0_linux_amd64.tar.gz
sudo mv lego /usr/local/bin/
sudo chmod 755 /usr/local/bin/lego
sudo chown root:root /usr/local/bin/lego
```

### Install Git

```bash
sudo yum install git -y
```

### Clone repogitory


```bash
git clone git@github.com:AtaruOhto/nextjs-micro-boilerplate.git
```

### Add .envrc to project

```
cd nextjs-micro-boilerplate
cp .envrc.sample .envrc
```

Then set environment variables for production correctly.
Suppose the following:
  * 1: you have the domain "example.com" and set subdomain "api.example.com" in DNS settings.
  * 2: you have the repogitory in "/home/ec2-user/nextjs-micro-boilerplate".

```
# Email of the Let's Encrypt account  (change foobar@example.com to your valid email address)
export CERT_EMAIL=foobar@example.com

# domain of the certificate  (change example.com to your domain name)
export CERT_DOMAIN=example.com

# the webroot of the Let's Encrypt (change if your repository is located in diffrent path)
export CERT_WEB_ROOT=/home/ec2-user/nextjs-micro-boilerplate/web/public

# the output path of the certificate (change if your repository is located in diffrent path)
export CERT_PATH=/home/ec2-user/nextjs-micro-boilerplate/web/cert

export API_DOCKER_HOST_NAME=api
export API_PORT=3333
export API_PORT_HOST=3333
export FRONT_PORT_HOST=3000
export FRONT_API_ENDPOINT_CLIENT=https://api.example.com:3333
export FRONT_API_ENDPOINT_SERVER=https://api.example.com:3333
```

Then load environment variables defined in ".envrc".

```
direnv allow
```

### Run Nginx service in Docker Compose


This stack uses [HTTP-01 challenge](https://letsencrypt.org/docs/challenge-types/#http-01-challenge) to get SSL certificates. So Let's Encrypt authentication bot need to be able to access Nginx via your domain.
Hence starting HTTP server (Nginx) and enables Let's Encrypt to access your domain is necessary. 

Let's run Nginx service in Docker Compose, in order to get Let's Encrypt certificate. next-web is Nginx container service.


```bash
docker-compose -f docker-compose.prod.yml up -d next-web
```

### Get SSL Certificate with Let's Encrypt

Run go-acme/lego to get SSL certificates. Let's Encrypt will try to access your server via your domain and subdomain. In order for Let's Encrypt to access Nginx you need to set up DNS correctly.

```bash
sh lego.run.sh
```

When vertification succeed, the SSL certificates will be located under  "./web/cert/" directory. If your __CERT_DOMAIN (environment variable)__ were "example.com", the names of the certificates are "example.com.crt" and "example.com.key". And these directory will be mount into the Nginx container internally, so Nginx container can read these certificates for making itself behave as HTTPS server.

### Edit Nginx configuration file

```
cp web/conf.d/prod.conf.sample web/conf.d/prod.conf
```

Edit Nginx configuration file. "web/conf.d" directory will be mounted to Nginx container.

```
vim web/conf.d/prod.conf
```

Change "example.com" and "api.example.com" to your domain.
For example, if you have "yourdomain.com" and set up "api.yourdomain.com" in DNS settings, change "example.com" to "yourdomain.com", and "api.example.com" to "api.yourdomain.com".

```
# web/conf.d/prod.conf

server {
  listen       80;

  # Change "example.com" to your domain name
  server_name  example.com;
  return 301 https://$host$request_uri;
}

server {
  listen       80;

  # Change "api.example.com" to your subdomain name, ex "api.yourdomain.com"
  server_name  api.example.com;
  return 301 https://$host$request_uri;
}

server {
  listen       443 ssl http2;

  # Change "example.com" to your domain name, ex "api.yourdomain.com"
  server_name  example.com;

  # Change "example.com" to your domain name in certificate path below.
  ssl_certificate /etc/nginx/cert/certificates/example.com.crt;
  ssl_certificate_key /etc/nginx/cert/certificates/example.com.key;

  location / {
    proxy_pass http://front:3000;
  }
}

server {
  listen       443 ssl http2;

  # Change "api.example.com" to your subdomain name  
  server_name  api.example.com;

  # Change "example.com" to your domain name in certificate path below.
  ssl_certificate /etc/nginx/cert/certificates/example.com.crt;
  ssl_certificate_key /etc/nginx/cert/certificates/example.com.key;

  location / {
    proxy_pass http://api:3333;
  }
}
```

After editing configuration file, stop Nginx container service temporarily.

```bash
docker-compose -f docker-compose.prod.yml stop
```

Then, run Docker Compose stack in server.

```bash
docker-compose -f docker-compose.prod.yml up -d
```


