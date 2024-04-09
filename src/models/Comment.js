const {Schema, model, Types: {ObjectId}} = require('mongoose')

const CommentSchema = new Schema(
    {
        content: {type: String, required: true},
        user: {type: ObjectId, required: true, ref: 'user'}, // 작성자
        userFullName: {type: String, required: true},
        blog: {type: ObjectId, required: true, ref: 'blog'}, // 어떤 블로그에 작성된 것인지
    },
    {timestamp: true}
)

const Comment = model("comment", CommentSchema); // 모델 컬렉션 이름은 끝에 s가 붙어서 생성됨
module.exports = {Comment, CommentSchema}