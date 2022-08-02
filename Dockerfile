FROM node:16-alpine as builder
RUN apk add --no-cache g++ make python3
WORKDIR /usr/src/app
COPY . ./
RUN npm ci

FROM node:16-alpine
RUN apk add --no-cache ffmpeg libtool yt-dlp
WORKDIR /usr/src/app
COPY package*.json ./
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/dist ./dist
ENV NODE_ENV=production
CMD ["node", "dist/index.js"]
