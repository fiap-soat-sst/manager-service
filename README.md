# Manager Service

<img alt="Node Version" src="https://img.shields.io/badge/Node_Version-20.18-green"> [![Setup and build](https://github.com/fiap-soat-sst/manager-service/actions/workflows/setup-build-pipeline.yml/badge.svg)](https://github.com/fiap-soat-sst/manager-service/actions/workflows/setup-build-pipeline.yml) ![coverage](https://img.shields.io/endpoint?url=https://gist.githubusercontent.com/evilfeeh/b08eb2c7df611955dd487f17d2a4c340/raw/coverage-manager-service.json)

This application is part of the Hackathon project from FIAP.
This is a microsservice backend Developed with TypeScript, Docker, DDD and clean architecture

## ABOUT

We're introducing a Software that aims to manager the compression process. This project gets a video and send to the process to get the images. The process video send a SNS request for the compress to create the .zip file, after that it send a notification for the final user.

For more details about this project and the whole systen, access: https://github.com/fiap-soat-sst and look for the files with the prefix: vip-

## HOW TO SETUP:

You will need set up your AWS vars following the .env-sample

Clone the project repository:

```bash
git clone https://github.com/fiap-soat-sst/vip-compress-file.git
```

Access the project directory:

```bash
cd vip-compress-file
```

Run the application with Docker Compose:

```bash
docker compose up
```
