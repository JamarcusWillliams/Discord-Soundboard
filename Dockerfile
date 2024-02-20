# Use Node.js as the base image
FROM node:16

# Sets the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Install FFMPEG for handling audio files
RUN apt-get update && apt-get install -y ffmpeg

# Install libsodium for encryption
RUN apt-get install -y libsodium-dev

# Copy the rest of the code
COPY . .


# Command to run code
CMD ["node", "index.js"]
