FROM node:18-alpine as build
RUN apk add --no-cache g++ make python3
COPY . ./

FROM build as build_node_modules
RUN NODE_ENV=production npm ci

FROM build as build_dist
RUN npm ci && npm run build

FROM node:18-alpine
RUN apk add --no-cache ffmpeg libtool yt-dlp
WORKDIR /usr/src/app
COPY package*.json ./
COPY --from=build_node_modules ./node_modules ./node_modules
COPY --from=build_dist ./dist ./dist
ENV NODE_ENV=production
CMD ["node", "dist/index.js"]
