const {Router} = require('express');
const commentRouter = Router({mergeParams:true}); // {mergeParams:true} server.js에서 쓴 blogId를 불러 올수 있게 됨
const {Comment, User, Blog} = require('../models');
const {isValidObjectId} = require('mongoose')


commentRouter.post('/', async (req, res)=>{
    try{
        const{blogId} = req.params;
        if (!isValidObjectId(blogId)) return res.status(400).send({err:"blogId is invalid"})
        const{content, userId} = req.body
        if (!isValidObjectId(userId)) return res.status(400).send({err:"userId is invalid"})
        if (!content) return res.status(400).send({err:"content is required"})
        if (typeof content !=='string') return res.status(400).send({err:"content must be a string"})

        // const user = await User.findById(userId)
        // const blog = await Blog.findById(blogId)
        const [user, blog] = await Promise.all([ // 블로그와 유저를 병렬으로 가져옴(속도 개선)
            User.findById(userId),
            Blog.findById(blogId)
        ])
        if (!user) return res.status(400).send({err:"user dose not exist"})
        if (!blog) return res.status(400).send({err:"blog dose not exist"})
        if (!blog.islive) return res.status(400).send({err:"blog is not available"})
        const comment = new Comment({content, user, blog})
        await comment.save();
        return res.send({comment})
    }catch (err){
        console.log(err)
        return res.status(500).send({err:err.message})
    }
})

commentRouter.get('/', async (req, res) =>{
    try {
        const{blogId} = req.params;
        if (!isValidObjectId(blogId)) return res.status(400).send({err:"blogId is invalid"})

        const comments = await Comment.find({blog:blogId});
        return res.send({comments});
    }catch (err){
        console.log(err)
        return res.status(500).send({err:err.message})
    }
})

module.exports = {commentRouter}