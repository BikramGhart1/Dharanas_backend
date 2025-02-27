const express = require('express');
const app = express();
const cors = require('cors');
const loginRouter = require('./routes/loginRouter');

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/signup', loginRouter);

app.listen(3000, () => {
    console.log("Listening to the port 3000");
})