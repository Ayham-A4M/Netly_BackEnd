const postModel = require('../../models/post');
const handleCreatePost = async (req, res, next) => {
    try {
        const userId = res.locals.id;
        let newPost = {};
        if (req.files && req.files?.length > 0) {
            const images = req.files?.map((e) => (`/public/${e.filename}`))
            newPost.images = images;
        }
        const postInformation = JSON.parse(req.body.postInformation);
        newPost = { ...newPost, ...postInformation, userId: userId };
        console.log(newPost);
        const new_post = new postModel(newPost);
        const response = await new_post.save();
        if (response) {
            return res.status(200).send({msg:"post created"});
        }
    } catch (err) {
        next(err);
    }
}

module.exports = handleCreatePost