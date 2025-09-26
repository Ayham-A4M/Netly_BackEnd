const postModel = require('../../models/post');
const { uploadToVercelBlob } = require('../../utils/imageUploadVercelBlob')
const handleCreatePost = async (req, res, next) => {
    try {
        const userId = res.locals.id;
        let newPost = {};
        if (req.files && req.files.length > 0) {
            const uploadPromises = req.files?.map(file => uploadToVercelBlob(file));
            const imageUrls = await Promise.all(uploadPromises);
            newPost.images = imageUrls;
        }
        const postInformation = JSON.parse(req.body.postInformation);
        newPost = { ...newPost, ...postInformation, userId: userId };

        const new_post = new postModel(newPost);
        const response = await new_post.save();
        if (response) {
            return res.status(200).send({ msg: "post created" });
        }
    } catch (err) {
        next(err);
    }
}

module.exports = handleCreatePost