const {Router} = require('express');
const userRouter = Router();
const {User} = require('../models')
const mongoose = require('mongoose');

userRouter.post('/', async (req, res) => {
    try {
        let {username, name} = req.body;
        if (!username) return res.status(400).send({err: "username is required"});
        if (!name || !name.first || !name.last) return res.status(400).send({err: "Both first and last name is required"});

        const user = new User(req.body);
        await user.save();
        return res.send({user})
    } catch (err) {
        console.log(err);
        return res.status(500).send({err: err.message})
    }
})

userRouter.get('/', async (req, res) => {
    try {
        const users = await User.find({});
        return res.send({users: users})
    } catch (err) {
        console.log(err);
        return res.status(500).send({err: err.message})
    }
})

userRouter.get('/:userId', async (req, res) => {
    try {
        const {userId} = req.params;
        if (!mongoose.isValidObjectId(userId)) return res.status(400).send({err: "invalid userId"})
        const user = await User.findOne({_id: userId})
        return res.send({user});
    } catch (err) {
        console.log(err);
        return res.status(500).send({err: err.message})
    }
})

userRouter.put('/:userId', async (req, res) => {
    try {
        const {userId} = req.params;
        if (!mongoose.isValidObjectId(userId)) return res.status(400).send({err: "invalid userId"})
        const {age, name} = req.body;
        if (!age && !name) return res.status(400).send({err: "age or name is required"});
        if (age && typeof age !== 'number') return res.status(400).send({err: "age must be a number"})
        if (name && typeof name.first !== 'string' && typeof name.last !== 'string') return res.status(400).send({err: "first and last name are strings"})

        // let updateBody = {} // 이렇게 안하고 직접 넣으면 null값이 들어가는 문제 발생
        // if (age) updateBody.age = age;
        // if (name) updateBody.name = name;
        // const user = await User.findByIdAndUpdate(userId, updateBody, {new: true}); // {new: true}를 해줘야 업데이트 된 것을 반환

        //위 코드와 같지만 이건 DB와 두번 통신함. 받아와서 수정해서 저장
        let user = await User.findById(userId);
        if (age) user.age = age;
        if (name) user.name = name;
        await user.save();

        return res.send({user});
    } catch (err) {
        console.log(err);
        return res.status(500).send({err: err.message})
    }
})

userRouter.delete('/:userId', async (req, res) => {
    try {
        const {userId} = req.params;
        if (!mongoose.isValidObjectId(userId)) return res.status(400).send({err: "invalid userId"})
        // const user = await User.deleteOne({_id: userId}) // 그냥 삭제
        const user = await User.findOneAndDelete({_id: userId}) // 삭제하는 거 반환하고 삭제
        return res.send(user);
    } catch (err) {
        console.log(err);
        return res.status(500).send({err: err.message})
    }
})

module.exports = {
    userRouter
}