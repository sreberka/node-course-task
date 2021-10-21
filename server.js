const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();
const bodyParser = require('body-parser');
const { initDb } = require('./db/db');
const userRouter = require('./routes/userRoutes');

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

app.use('/api/users', userRouter);

const listener = app.listen(process.env.PORT || 3000, () => {
  initDb();
  console.log('Your app is listening on port ' + listener.address().port)
})
