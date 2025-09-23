const postModel=require('../../models/post')
const handleUpdatePost=async(req,res,next)=>{
    try{    
        const userId=res.locals.id;
        const {postId}=req.params
        const {content,feeling}=req.body;
        const response=await postModel.findOneAndUpdate({_id:postId,userId:userId},{content:content,feeling:feeling});
        if(response){
            return res.status(200).send({msg:'Post updated successfully'});
        }
    }catch(err){
        next(err)
    }
}
module.exports=handleUpdatePost