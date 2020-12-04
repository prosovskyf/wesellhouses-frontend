FROM node:14

# Create app directory
WORKDIR /app
# copy package.json and lock file
COPY package* ./
# install
RUN npm install
# Copy files (components etc.)
COPY . ./
# executable path 
ENV PATH /app/node_modules/.bin:$PATH
# env links to backend services
ENV REACT_APP_API_URL=http://localhost:3005/api/v1
ENV REACT_APP_BACKEND=http://localhost:8080

EXPOSE 3000
EXPOSE 3090

# Run documentation on 3090 and app on 3000
CMD npx concurrently "npm run docs" "npm start"