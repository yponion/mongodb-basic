const {Router} = require('express');
const commentRouter = Router({mergeParams: true}); // {mergeParams:true} server.js에서 쓴 blogId를 불러 올수 있게 됨
const {Comment, User, Blog} = require('../models');
const {isValidObjectId} = require('mongoose')


commentRouter.post('/', async (req, res) => {
    try {
        const {blogId} = req.params;
        if (!isValidObjectId(blogId)) return res.status(400).send({err: "blogId is invalid"})
        const {content, userId} = req.body
        if (!isValidObjectId(userId)) return res.status(400).send({err: "userId is invalid"})
        if (!content) return res.status(400).send({err: "content is required"})
        if (typeof content !== 'string') return res.status(400).send({err: "content must be a string"})

        // const user = await User.findById(userId)
        // const blog = await Blog.findById(blogId)
        const [user, blog] = await Promise.all([ // 블로그와 유저를 병렬으로 가져옴(속도 개선)
            User.findById(userId),
            Blog.findById(blogId)
        ])
        if (!user) return res.status(400).send({err: "user dose not exist"})
        if (!blog) return res.status(400).send({err: "blog dose not exist"})
        if (!blog.islive) return res.status(400).send({err: "blog is not available"})
        const comment = new Comment({content, user, userFullName: `${user.name.first} ${user.name.last}`, blog})
        await Promise.all([ //blog도 아래에서 쓰고 싶으면 let[comment, blog]=await Promise.all([ 다음처럼 디스럭처링 하면 되는데 사용 안하니까 안함
            comment.save(),
            Blog.updateOne({_id: blogId}, {$push: {comments: comment}})
        ]);
        return res.send({comment})
    } catch (err) {
        console.log(err)
        return res.status(500).send({err: err.message})
    }
})

commentRouter.get('/', async (req, res) => {
    try {
        const {blogId} = req.params;
        if (!isValidObjectId(blogId)) return res.status(400).send({err: "blogId is invalid"})

        const comments = await Comment.find({blog: blogId});
        return res.send({comments});
    } catch (err) {
        console.log(err)
        return res.status(500).send({err: err.message})
    }
})

commentRouter.patch("/:commentId", async (req, res) => {
    const {commentId} = req.params
    const {content} = req.body
    if (typeof content !== 'string') return res.status(400).send({err: "content is required"})
    const [comment] = await Promise.all([//Blog에 Comment를 내장했기 때문에 Comment 수정 시 Blog의 Comment도 update해줌
        Comment.findOneAndUpdate({_id: commentId}, {content}, {new: true}),
        Blog.updateOne({'comments._id': commentId}, {"comments.$.content": content})// Blog안에 comments배열 안에 _id를 가지고 있는 객체를 불러옴
    ])


    return res.send({comment})
})

commentRouter.delete("/:commentId", async (req, res) => {
    const {commentId} = req.params
    const comment = await Comment.findOneAndDelete({_id: commentId})

    //블로그에서 코멘트를 제외시키는
    await Blog.updateOne({"comments._id": commentId}, {$pull: {comments: {_id: commentId}}})

    return res.send({comment})
})

module.exports = {commentRouter}