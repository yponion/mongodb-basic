const express = require('express');
const app = express();
const {userRouter, blogRouter} = require('./routes')
const mongoose = require('mongoose');
const {generateFakeData} = require('./faker2')

//https://github.com/hoffnung8493/mongodb_tutorial


const port = 3000

const server = async () => {
    try {
        const {MONGO_URI} = process.env
        if (!MONGO_URI) throw new Error("MONGO_URI is required!!!")

        await mongoose.connect(MONGO_URI);
        // mongoose.set('debug', true) // 디버그 찍어 볼 수 있음
        console.log('MongoDB Connected')
        app.use(express.json())
        // generateFakeData(100, 10, 30) // 페이크 데이터 만들기

        app.use('/user', userRouter)
        app.use('/blog', blogRouter)
        // app.use('/blog/:blogId/comment', commentRouter) // blogRoute에 설정함.

        app.listen(port, async () => {
            console.log(`server listening on port ${port}`)
            // for (let i = 0; i < 20; i++) {
            //     console.log(i)
            //     await generateFakeData(10, 1, 10) // app.listen 이후에 이루어 져야함
            // }

            // await generateFakeData(100000, 5, 20)

            // console.time("insert time: ")
            // await generateFakeData(10, 2, 10)
            // console.timeEnd("insert time: ")


        })
    } catch (err) {
        console.log(err);
    }
}

server()