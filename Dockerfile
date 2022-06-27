FROM node:16-alpine as builder
RUN apk add --no-cache g++ make python3
WORKDIR /usr/src/app
COPY package*.json ./
ARG NODE_ENV=production
RUN npm ci

FROM node:16-alpine
RUN apk add --no-cache ffmpeg libtool yt-dlp
WORKDIR /usr/src/app
COPY . .
COPY --from=builder /usr/src/app .
ENV NODE_ENV=production
CMD ["node", "src/index.js"]
