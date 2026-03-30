FROM node:18.16.0-alpine AS base-repo
# Install git timezone
RUN apk add --no-cache git openssh

WORKDIR /app

COPY package.json ./

COPY .npmrc ./

RUN yarn install

COPY . .

RUN yarn build

#
# Application
#
FROM node:18.16.0-alpine AS prod

# Install PM2 and timezone
RUN yarn global add pm2 pm2-logrotate \
    && apk add --no-cache tzdata

ENV TZ=Asia/Ho_Chi_Minh

RUN mkdir -p /var/www/api_smart_cms
WORKDIR /var/www/api_smart_cms

# Copy Frontend build
COPY --from=base-repo /app/node_modules/ ./node_modules/
COPY --from=base-repo /app/dist ./dist/
COPY . .
CMD pm2-runtime start pm2.json --env production
EXPOSE 5070