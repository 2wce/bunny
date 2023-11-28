# syntax = docker/dockerfile:1
FROM node:alpine AS base

RUN apk update && apk add --no-cache \
  ca-certificates \
  curl

# Adjust NODE_VERSION as desired
ARG NODE_VERSION=18.18.0
ARG NODE_PACKAGE=node-v$NODE_VERSION-linux-x64
ARG NODE_HOME=/opt/$NODE_PACKAGE

# We need to install Node for bun to work with Hono & prisma for some reason
ENV NODE_PATH $NODE_HOME/lib/node_modules
ENV PATH $NODE_HOME/bin:$PATH

RUN curl https://nodejs.org/dist/v"$NODE_VERSION"/"$NODE_PACKAGE".tar.gz | tar -xzC /opt/

# Adjust BUN_VERSION as desired
ARG BUN_VERSION=1.0.6

RUN npm install -g bun@"$BUN_VERSION"

LABEL fly_launch_runtime="Bun/Prisma"

# Bun/Prisma app lives here
WORKDIR /app

# Set production environment
ENV NODE_ENV="production"


# Throw-away build stage to reduce size of final image
FROM base AS build

# Install packages needed to build node modules
RUN apk add --no-cache build-base openssl pkg-config python3

# Install node modules
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

# Generate Prisma Client
COPY database ./database
RUN bunx prisma generate

# Copy application code
COPY . .

# Final stage for app image
FROM base

# Install packages needed for deployment
RUN apk add --no-cache openssl

# Copy built application
COPY --from=build /app /app

# Start the server by default, this can be overwritten at runtime
ARG PORT=3000
EXPOSE $PORT
CMD [ "bun", "server.ts" ]