const os = require('os');
const express = require('express');
const app = express();
const redis = require('redis');

const redisClient = redis.createClient({
  host: 'redis',
  port: 6379
});

app.get('/', function (req, res) {
  redisClient.get('numVisits', function (err, numVisits) {
    let count = parseInt(numVisits) + 1;
    if (isNaN(count)) count = 1;
    redisClient.set('numVisits', count);

    const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <title>Server Activity</title>
      <style>
        body {
          margin: 0;
          height: 100vh;
          background: linear-gradient(135deg, #1e3c72, #2a5298, #1e3c72);
          background-size: 400% 400%;
          animation: gradientBG 10s ease infinite;
          display: flex;
          justify-content: center;
          align-items: center;
          font-family: 'Segoe UI', sans-serif;
          color: #fff;
        }

        @keyframes gradientBG {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        .card {
          background: rgba(255, 255, 255, 0.1);
          padding: 50px 70px;
          border-radius: 20px;
          box-shadow: 0 0 30px rgba(255, 255, 255, 0.2);
          text-align: center;
          backdrop-filter: blur(10px);
        }

        .title {
          font-size: 26px;
          margin-bottom: 15px;
          font-weight: 600;
          color: #ffea00;
        }

        .count {
          font-size: 34px;
          font-weight: bold;
          color: #00ffcc;
        }
      </style>
    </head>
    <body>
      <div class="card">
        <div class="title">🚀 Live Server Activity Monitor</div>
        <div class="count">${os.hostname()}: Number of visits is: ${count}</div>
      </div>
    </body>
    </html>
    `;
    res.send(html);
  });
});

app.listen(5000, '0.0.0.0', function () {
  console.log('Web application is listening on port 5000');
});

