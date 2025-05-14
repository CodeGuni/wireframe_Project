# Use a Node.js base image
FROM mcr.microsoft.com/devcontainers/javascript-node:20

# Set environment variables to avoid prompts during builds
ENV DEBIAN_FRONTEND=noninteractive
ENV NPM_CONFIG_PREFIX=/home/node/.npm-global
ENV PATH=$PATH:/home/node/.npm-global/bin

# Ensure the "node" user exists and has the correct permissions
USER node
RUN mkdir -p /home/node/.npm-global \
    && chown -R node:node /home/node

# Set the working directory inside the container
WORKDIR /workspace

# Copy package.json and package-lock.json to leverage Docker caching
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application
COPY . .

# Expose the ports used by your application
EXPOSE 3000 5173

# Default to bash
CMD ["bash"]
