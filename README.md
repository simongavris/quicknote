# QuickNote

A simple text editor web app accessible via a browser. Designed to use Nginx and Docker.

## Features
* Simple text editor interface
* Saves text to local browser storage
* Support for individual notes via unique paths (e.g., /example)
* Hosted behind a Traefik 2 reverse proxy

## Prerequisites
* Docker
* Docker Compose
* (Optional) Traefik 2 for reverse proxy setup

## Quick Start

1. Clone this repository:
```bash
git clone https://github.com/yourusername/quicknote.git
```

2. Navigate to the project directory:
```bash
cd quicknote
```

3. Build and Run using Docker:
```bash
docker-compose up --build -d
```
This will build the Docker image and run it as a container, making the app accessible at the domain you've configured in your docker-compose.yml file.

### For Local Development
To run the app locally for development, you can use the docker-compose.local.yml configuration:

```bash
docker-compose -f docker-compose.yml -f docker-compose.local.yml up --build
```

This will run the container mapped to http://localhost:8080 for local development.

## Production Redeploy (keep client notes)
Client notes are stored in browser localStorage, so redeploying the server does not delete them.

1. Pull the latest code:
```bash
git pull
```

2. Rebuild and recreate the container:
```bash
docker compose build --no-cache
docker compose up -d --force-recreate
```

3. If a client still sees an old UI, refresh the Service Worker without clearing site data (do not clear storage):
* Hard refresh the page (Shift+Reload), or
* In DevTools → Application → Service Workers, click "Update" and then reload.

This updates cached assets while preserving localStorage notes.

## How to Use
* Access the app via your browser at the configured domain.
* Start typing to use the text editor.
* Reload the page and find your notes again.
* Share between clients with fancy encodig.