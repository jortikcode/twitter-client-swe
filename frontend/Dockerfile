FROM node:latest
ENV DEPENDENCIES=/frontend-dependencies

# Install dependencies first, as they change less often than code (good for docker layer caching)
WORKDIR ${DEPENDENCIES}
COPY package.json .
RUN npm install && npm install -g serve

# copy all of our frontend app files to docker client's current directory & build the application
WORKDIR /frontend
COPY . .
RUN mv ${DEPENDENCIES}/node_modules . && npm run build