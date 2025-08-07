# first stage - building
FROM node:24 AS builder
ARG API_BASE_URL=https://api.tfedb.pi.local

RUN corepack enable

COPY . /project
WORKDIR /project

RUN yarn install
RUN echo "VITE_API_BASE_URL=$API_BASE_URL" > .env
RUN yarn build

# second stage - packaging
FROM nginx
COPY nginx/tfedb-ui.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /project/build /usr/share/nginx/html