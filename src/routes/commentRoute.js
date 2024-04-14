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
        if (!user) return res.status(400).send({err: "user does not exist"})
        if (!blog) return res.status(400).send({err: "blog does not exist"})
        if (!blog.islive) return res.status(400).send({err: "blog is not available"})
        const comment = new Comment({
            content,
            user,
            userFullName: `${user.name.first} ${user.name.last}`,
            blog: blogId,
        })
        // await Promise.all([ //blog도 아래에서 쓰고 싶으면 let[comment, blog]=await Promise.all([ 다음처럼 디스럭처링 하면 되는데 사용 안하니까 안함
        //     comment.save(),
        //     Blog.updateOne({_id: blogId}, {$push: {comments: comment}})
        // ]);
        blog.commentsCount++
        blog.comments.push(comment)
        if (blog.commentsCount > 3) blog.comments.shift()

        await Promise.all([
            comment.save(),
            blog.save(),
            // Blog.updateOne({_id: blogId}, {$inc: {commentsCount: 1}}),
        ])
        return res.send({comment})
    } catch (err) {
        console.log(err)
        return res.status(500).send({err: err.message})
    }
})

commentRouter.get('/', async (req, res) => {
    try {
        let {page = 0} = req.query;
        page = parseInt(page);
        const {blogId} = req.params;
        if (!isValidObjectId(blogId)) return res.status(400).send({err: "blogId is invalid"})
        console.log({page})
        const comments = await Comment.find({blog: blogId}).sort({createdAt: -1}).skip(page * 3).limit(3)
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