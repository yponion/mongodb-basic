const express = require('express');
const app = express();
const mongoose = require('mongoose');
const {User} = require('./models/User')

const users = [];

const MONGO_URI = 'mongodb+srv://admin:SCYi7seef40LxasP@atlascluster.bg4tnps.mongodb.net/d?retryWrites=true&w=majority'

const server = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('MongoDB Connected')
        app.use(express.json())

        app.get('/user', function (req, res) {
            return res.send({users: users})
        })

        app.post('/user', function (req, res) {
            users.push({name: req.body.name, age: req.body.age})
            return res.send({success: true})
        })

        app.listen(3000, function () {
            console.log('server listening on port 3000')
        })
    } catch (err) {
        console.log(err);
    }
}

server()