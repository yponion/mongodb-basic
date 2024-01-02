const express = require('express');
const app = express();
const {userRouter} = require('./routes/userRoute')
const mongoose = require('mongoose');


const MONGO_URI = 'mongodb+srv://admin:SCYi7seef40LxasP@atlascluster.bg4tnps.mongodb.net/BlogService?retryWrites=true&w=majority'

const server = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        mongoose.set('debug', true) // 디버그 찍어 볼 수 있음
        console.log('MongoDB Connected')
        app.use(express.json())

        app.use('/user', userRouter)

        app.listen(3000, () => console.log('server listening on port 3000'))
    } catch (err) {
        console.log(err);
    }
}

server()