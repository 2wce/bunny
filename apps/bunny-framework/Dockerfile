# syntax = docker/dockerfile:1

# Adjust BUN_VERSION as desired
ARG BUN_VERSION=1.0.6

# Adjust NODE_VERSION as desired
ARG NODE_VERSION=18.18.0
ARG NODE_PACKAGE=node-v$NODE_VERSION-linux-x64
ARG NODE_HOME=/opt/$NODE_PACKAGE

ARG PORT=3000

FROM ubuntu AS base

RUN apt-get update && apt-get install -y \
  ca-certificates \
  curl

# We need to install Node for bun to work with Hono & prisma for some reason
ENV NODE_PATH $NODE_HOME/lib/node_modules
ENV PATH $NODE_HOME/bin:$PATH

RUN curl https://nodejs.org/dist/v$NODE_VERSION/$NODE_PACKAGE.tar.gz | tar -xzC /opt/

RUN npm install -g bun@$BUN_VERSION

LABEL fly_launch_runtime="Bun/Prisma"

# Bun/Prisma app lives here
WORKDIR /app

# Set production environment
ENV NODE_ENV="production"


# Throw-away build stage to reduce size of final image
FROM base AS build

# Install packages needed to build node modules
RUN apt-get update -qq && \
    apt-get install -y build-essential openssl pkg-config python-is-python3

# Install node modules
COPY --link bun.lockb package.json ./
RUN bun install

# Generate Prisma Client
COPY --link src/database ./src/database
RUN bunx prisma generate

# Copy application code
COPY --link . .

# Final stage for app image
FROM base

# Install packages needed for deployment
RUN apt-get update -qq && \
    apt-get install --no-install-recommends -y openssl && \
    rm -rf /var/lib/apt/lists /var/cache/apt/archives

# Copy built application
COPY --from=build /app /app

# Start the server by default, this can be overwritten at runtime
EXPOSE $PORT
CMD [ "bun", "src/index.ts" ]
