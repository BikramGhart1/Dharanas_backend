const express = require('express');
const app = express();
const cors = require('cors');
const loginRouter = require('./routes/loginRouter');

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/signup', loginRouter);

const PORT=process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Listening to the port ${PORT}`);
})