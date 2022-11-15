FROM node:latest
ENV DEPENDENCIES=/backend-dependencies

# Install dependencies first, as they change less often than code (good for docker layer caching)
WORKDIR ${DEPENDENCIES}
COPY package.json .
RUN npm install
# copy all of our backend app files to docker client's current directory & build the application
WORKDIR /backend
COPY . .
RUN mv ${DEPENDENCIES}/node_modules .