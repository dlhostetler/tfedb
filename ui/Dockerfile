# first stage - building
FROM node:lts-buster-slim as builder
ARG API_BASE_URL=https://api.tfedb.com
COPY . /build
WORKDIR /build
RUN yarn install
RUN rm .env
RUN echo "REACT_APP_API_BASE_URL=$API_BASE_URL" >> .env
RUN yarn build

# second stage - packaging
FROM nginx
COPY nginx/tfedb-ui.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /build/build /usr/share/nginx/html