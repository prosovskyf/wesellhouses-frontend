# WeSellHouses frontend
Project coursework - frontend - We Sell Houses
<br> 
SPA: npm start
<br>
PORT: 3000
<br>
Tests: npm test

# To see backend repository
[We Sell Houses backend](https://github.com/prosovskyf/wesellhouses-backend)

# Documentation (npm run docs)
    Code: port 3090 path: /
<br>
Code: To view code documentation run 'npm run docs' and access docs on localhost:3090 <br>
Documentation includes all components described with methods used inside them
<br>
UserGuide: View userguide.pdf to learn how to work with the application

# Docker
Both frontend and backend are configured to run in docker
<br>
<b>TO RUN:</b> Edit docker file with connection strings pointing to API and filserver 
(this is configured for my backend running in docker or local) - See link to repository above
<br>
Use: docker build -t YOUR_NAME/wesellhouses-frontend .
<br>
Run: docker run  -p 3000:3000 -p 3090:3090 YOUR_NAME/wesellhouses-frontend:latest
<br>
This will run SPA on 3000, docs on 3090

