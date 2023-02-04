FROM debian:bullseye as builder-ts

ARG NODE_VERSION=18.13.0

RUN apt-get update; apt install -y curl
RUN curl https://get.volta.sh | bash
ENV VOLTA_HOME /root/.volta
ENV PATH /root/.volta/bin:$PATH
RUN volta install node@${NODE_VERSION}

RUN mkdir /app
WORKDIR /app
COPY . .

# NODE_ENV development required
ENV NODE_ENV development
# Installs
RUN npm install --prefix apollo-express
RUN npm install --prefix vite-ts

ENV NODE_ENV production
# Builds
RUN npm run build --prefix apollo-express
RUN npm run build --prefix vite-ts

# Copy frontend to backend
RUN cp -R ./vite-ts/dist ./apollo-express/front

####################################################################################################################

FROM debian:bullseye as prod-cleanup
ARG NODE_VERSION=18.13.0

RUN apt-get update; apt install -y curl
RUN curl https://get.volta.sh | bash
ENV VOLTA_HOME /root/.volta
ENV PATH /root/.volta/bin:$PATH
RUN volta install node@${NODE_VERSION}

RUN mkdir /app
WORKDIR /app
ENV NODE_ENV production
COPY --from=builder-ts /app/apollo-express/build  /app/build
COPY --from=builder-ts /app/apollo-express/front /app/front
COPY --from=builder-ts /app/apollo-express/src/*.graphql /app/src/
COPY --from=builder-ts /app/apollo-express/package*.json /app
RUN npm install

####################################################################################################################

FROM debian:bullseye

LABEL fly_launch_runtime="nodejs"
ENV NODE_ENV production

COPY --from=prod-cleanup /root/.volta /root/.volta
COPY --from=prod-cleanup /app /app

WORKDIR /app
ENV PATH /root/.volta/bin:$PATH

ENV NODE_ENV production

CMD [ "npm", "run", "start" ]
