const {Router} = require('express');
const blogRouter = Router();
const {Blog, User} = require('../models')
const {isValidObjectId} = require('mongoose')

// const {commentRouter} = require('../routes') // 이건 왜 안되지?
const {commentRouter} = require('./commentRoute')
blogRouter.use('/:blogId/comment', commentRouter) // 이렇게 미들웨어 추가 가능

blogRouter.post('/', async (req, res) => {
    try {
        const {title, content, islive, userId} = req.body;
        if (!title) return res.status(400).send({err: "title is required"}) // title 존재 확인
        if (!content) return res.status(400).send({err: "content is required"}) // content 존재 확인
        if (typeof title !== 'string') return res.status(400).send({err: "title must be a string"}) // title string인지 검증
        if (typeof content !== 'string') return res.status(400).send({err: "content must be a string"}) // content string인지 검증
        if (islive && typeof islive !== 'boolean') return res.status(400).send({err: "islive must be a boolena"}) // islive 있다면 boolean인지 검증
        if (!isValidObjectId(userId)) return res.status(400).send({err: "userId is invalid"}) // userId가 ObjectId인지 검증
        let user = await User.findById(userId); // userId로 불러옴
        if (!user) return res.status(400).send({err: "user dose not exist"}) // 검증

        let blog = new Blog({...req.body, user}) // user:userId 안해도 user에서 _id를 빼서 저장해줌
        // console.log(blog)
        await blog.save(); // 몽구스를 {...req.body, user}를 그대로 저장하는게 아니라 적절하게 가공해서 저장함
        return res.send({blog})

    } catch (err) {
        console.log(err)
        res.status(500).send({err: err.message})
    }
})

blogRouter.get('/', async (req, res) => {
    try {
        let {page} = req.query
        page = parseInt(page)
        const blogs = await Blog.find({}).sort({updatedAt: 1}).skip(page * 3).limit(3)
        // .populate([
        //     {path: "user"},
        //     {path: "comments", populate: {path: "user"}}
        // ]);
        return res.send({blogs});
    } catch (err) {
        console.log(err)
        res.status(500).send({err: err.message})
    }
})

blogRouter.get('/:blogId', async (req, res) => {
    try {
        const {blogId} = req.params;
        if (!isValidObjectId(blogId)) return res.status(400).send("blogId is invalid");
        // const blog = await Blog.findById(blogId);
        const blog = await Blog.findOne({_id: blogId});
        return res.send({blog});
    } catch (err) {
        console.log(err)
        res.status(500).send({err: err.message})
    }
})

blogRouter.put('/:blogId', async (req, res) => {
    try {
        const {blogId} = req.params;
        if (!isValidObjectId(blogId)) return res.status(400).send("blogId is invalid");
        const {title, content} = req.body;
        if (!title) return res.status(400).send({err: "title is required"}) // title 존재 확인
        if (!content) return res.status(400).send({err: "content is required"}) // content 존재 확인
        if (typeof title !== 'string') return res.status(400).send({err: "title must be a string"}) // title string인지 검증
        if (typeof content !== 'string') return res.status(400).send({err: "content must be a string"}) // content string인지 검증

        const blog = await Blog.findOneAndUpdate({_id: blogId}, {title, content}, {new: true})
        return res.send({blog});
    } catch (err) {
        console.log(err)
        res.status(500).send({err: err.message})
    }
})

blogRouter.patch('/:blogId/live', async (req, res) => {
    try {
        const {blogId} = req.params;
        if (!isValidObjectId(blogId)) return res.status(400).send("blogId is invalid");
        const {islive} = req.body;
        if (typeof islive !== 'boolean') return res.status(400).send({err: "boolean islive is required"});
        const blog = await Blog.findByIdAndUpdate(blogId, {islive}, {new: true})
        return res.send({blog});
    } catch (err) {
        console.log(err)
        res.status(500).send({err: err.message})
    }
})

module.exports = {blogRouter}