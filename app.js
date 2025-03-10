const express = require('express');
const app = express();
const cors = require('cors');
const loginRouter = require('./routes/loginRouter');
const userRouter = require('./routes/userRouter');
const { authenticateToken } = require('./middlewares/authMiddleware');

app.use(cors());

app.use('/uploads', express.static('uploads'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/signup', loginRouter);
app.use('/user', authenticateToken, userRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Listening to the port ${PORT}`);
})