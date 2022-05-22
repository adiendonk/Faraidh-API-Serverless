const express = require('express');
require('dotenv').config();
const cors = require('cors');
const app = express(), port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static('public'));
app.use(express.urlencoded({ extended: false }));
app.use(require('./router'));

const serverlessExpress = require('aws-serverless-express');
const server = serverlessExpress.createServer(app);
exports.main = (event, context) => serverlessExpress.proxy(server, event, context)

//app.listen(port, () => console.log(`Running in port ${port}...`));