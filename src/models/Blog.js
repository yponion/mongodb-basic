const {Schema, model, Types} = require('mongoose')

const BlogSchema = new Schema(
    {
        title: {type: String, required: true},
        content: {type: String, required: true},
        islive: {type: Boolean, required: true, default: false}, // true이면 고객들에게 노출, false이면 임시저장
        user: {type: Types.ObjectId, required: true, ref: 'user'} // ref 관계
    },
    {
        timestamp: true
    }
)

//가상의 키(?) 설정 (DB에는 저장되는게 아님)
BlogSchema.virtual("comments", {
    ref:"comment",
    localField:"_id",
    foreignField:"blog"
})
BlogSchema.set("toBoject", {virtuals:true})
BlogSchema.set("toJSON", {virtuals:true})


const Blog = model('blog', BlogSchema);
module.exports = {Blog}
