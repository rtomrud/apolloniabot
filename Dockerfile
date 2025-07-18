FROM node:22-alpine AS build
RUN apk add --no-cache g++ make python3
COPY . ./

FROM build AS build_node_modules
RUN NODE_ENV=production npm ci

FROM build AS build_dist
RUN npm ci && npm run build

FROM node:22-alpine
RUN apk add --no-cache ffmpeg libtool python3 && \
    wget -O /usr/local/bin/yt-dlp https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp && \
    chmod a+rx /usr/local/bin/yt-dlp
WORKDIR /usr/src/app
COPY package*.json ./
COPY --from=build_node_modules ./node_modules ./node_modules
COPY --from=build_dist ./dist ./dist
ENV NODE_ENV=production
CMD ["node", "dist/index.js"]
