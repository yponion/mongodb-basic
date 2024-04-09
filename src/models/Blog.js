const {Schema, model, Types} = require('mongoose')
const {CommentSchema} = require('./Comment')

const BlogSchema = new Schema(
    {
        title: {type: String, required: true},
        content: {type: String, required: true},
        islive: {type: Boolean, required: true, default: false}, // true이면 고객들에게 노출, false이면 임시저장
        user: {
            _id: {type: Types.ObjectId, required: true, ref: 'user'},
            username: {type: String, required: true},
            name: {
                first: {type: String, require: true},
                last: {type: String, require: true}
            },
        }, // ref 관계
        comments: [CommentSchema],//CommentSchema를 export해서 그대로 사용. 위 user처럼 필요한 것만 사용 가능하고, 이처럼 바로 스키마를 넣어줘도 됨.
    },
    {
        timestamp: true
    }
)

// //가상의 키(?) 설정 (DB에는 저장되는게 아님) -> 가상키 말고 실제로 ㄱㄱ
// BlogSchema.virtual("comments", {
//     ref: "comment",
//     localField: "_id",
//     foreignField: "blog"
// })
// BlogSchema.set("toBoject", {virtuals: true})
// BlogSchema.set("toJSON", {virtuals: true})


const Blog = model('blog', BlogSchema);
module.exports = {Blog}
