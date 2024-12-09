require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 4000;

mongoose.set('strictQuery', false);
const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected:', conn.connection.host);
    } catch(Error) {
        console.log(Error);
        process.exit(1);
    }
}

app.use(express.json());
// app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public/em/')));
app.use(express.static(path.join(__dirname, 'public/em/blogs/node-server-min-setup.html')));

const useRoute = require('./routes/messageRoutes');
app.use(useRoute);

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Listening on port ${PORT}`);
    });
}).catch((error) => {
    console.log('Cann\'t connect to Mongo Database!');
});
