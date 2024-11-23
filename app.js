//require('dotenv').config();
const http = require('http');
const express = require('express');
const bodyParser = require('body-parser');
const extensionRouter = require('./routes/extension.js');
const fetchreqRouter = require('./routes/fetchreq.js');
const sendRouter = require('./routes/send.js');
const updateRouter=require('./routes/update.js');
const register_userRouter=require('./routes/register_user.js');
const login_userRouter=require('./routes/login_user.js');
const recieve_requestRouter=require('./routes/recieve_request.js');
const paymentlink_Router=require('./routes/paymentlink.js');
const subscribed_Router=require('./routes/subscribed.js');








const app = express();

app.use(bodyParser.json());

app.locals.requests = new Map();
app.locals.fullfilled = new Map();

app.use('/', extensionRouter);

app.use('/', fetchreqRouter);

app.use('/', sendRouter);

app.use('/', updateRouter);

app.use('/',register_userRouter);

app.use('/',login_userRouter);

app.use('/',recieve_requestRouter);

app.use('/',paymentlink_Router);
app.use('/',subscribed_Router);





const server = http.createServer(app);

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on https://localhost:${PORT}`);
});

