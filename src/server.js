const express = require('express');
const app = express();
const {userRouter, blogRouter} = require('./routes')
const mongoose = require('mongoose');
const {generateFakeData} = require('./faker')

//https://github.com/hoffnung8493/mongodb_tutorial

const MONGO_URI = 'mongodb+srv://admin:SCYi7seef40LxasP@atlascluster.bg4tnps.mongodb.net/BlogService?retryWrites=true&w=majority'

const port = 3000

const server = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        mongoose.set('debug', true) // 디버그 찍어 볼 수 있음
        console.log('MongoDB Connected')
        app.use(express.json())
        // generateFakeData(100, 10, 30) // 페이크 데이터 만들기

        app.use('/user', userRouter)
        app.use('/blog', blogRouter)
        // app.use('/blog/:blogId/comment', commentRouter) // blogRoute에 설정함.

        app.listen(port, () => console.log(`server listening on port ${port}`))
    } catch (err) {
        console.log(err);
    }
}

server()