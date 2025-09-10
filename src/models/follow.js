const mongoose=require('mongoose');
const { Types: { ObjectId } } = mongoose;
const followSchema=new mongoose.Schema({
    userId:{type:ObjectId,ref:'user',required:true},
    followerId:{type:ObjectId,ref:'user',required:true},
    createdAt:{type:Date,required:true}
})
const followModel=mongoose.model('follow',followSchema,'follows');
module.exports=followModel