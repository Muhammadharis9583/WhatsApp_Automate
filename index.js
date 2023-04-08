const express = require('express');
const bodyParser = require('body-parser');
const userRouter = require('./routes/userRoutes')
// const qr = require('qr-image');

// create a new Express app
const app = express();
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());
app.use('/',userRouter)

// start the Express app
app.listen(3004, () => console.log('Server running on port 3004'));
