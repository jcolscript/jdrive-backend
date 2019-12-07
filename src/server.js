const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors');
const logger = require('./utils/logger');
const { logInOut } = require('./utils/logInOut')

if(process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const app = express();
app.use(cors());

const PORT = process.env.PORT;
const server = require('http').Server(app);
const io =  require('socket.io')(server);

io.on('connection', socket => {
  socket.on('connectRomm', data => {
    // Dados de usuario conectados a sala
    socket.join(data);
  })
})

mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true
});
mongoose.set('useCreateIndex', true);

const db = mongoose.connection;
db.on('error', console.error);
db.once('open', function() {
  logger.info('JDrive conected ...')
});

app.use((req, res, next) => {
  req.io = io;
  return next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(logInOut('log-in-out.log'))
app.use('/files', express.static(path.resolve(__dirname, '..', 'tmp')));

app.use(require('./routes'));

server.listen(PORT, () => {
  logger.info(`JDRIVE API usando a porta ${PORT}`)
});