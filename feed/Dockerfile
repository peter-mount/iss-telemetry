# Build a Docker container to run the feed

#======================================================================
# base - The base image containing the nodejs runtime
#
# Used by npm & final images
FROM docker.ceres.area51.dev/area51/ubuntu:node-20.04 AS base

#======================================================================
# npm - contains all the required modules for both building & the final image
FROM base AS npm

WORKDIR /work

# package.json is needed by npm
ADD feed/package.json /work/

# These files rarely change
ADD feed/.babelrc /work/
ADD feed/.npmignore /work/

# Set our local npm repo for performance reasons
RUN echo registry=https://nexus.ceres.area51.dev/repository/npm-group/ >~/.npmrc

# Install all required modules for the build
RUN npm install

# Install just the production modules into /dist
RUN mkdir /dist &&\
    cd /dist &&\
    cp /work/package.json . &&\
    npm install --only=production

#======================================================================
# build - performs the actual build placing the final artifacts under /dist
FROM npm AS build

ADD feed/src/ /work/src/

RUN npm run build &&\
    cp -rp build /dist

#======================================================================
# Now build the final image with just nodejs and the build artifacts
FROM base AS final
WORKDIR /work
COPY --from=build /dist/ /work/
CMD ["node","./build/index.js"]
