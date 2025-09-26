const userModel = require('../../models/user');
const AppError = require('../../utils/AppError');
const { uploadToVercelBlob } = require('../../utils/imageUploadVercelBlob');
const handleUpdateCoverImage = async (req, res, next) => {
    try {
        const userId = res.locals.id;
        if (!req.file) {
            throw new AppError(400, 'no specific image');
        }
        const url = await uploadToVercelBlob(req.file);
        // const url = `/public/${req.file.filename}`;
        const response = await userModel.findByIdAndUpdate(userId, { coverImage: url });
        if (response) {
            return res.status(200).send({ msg: 'cover image updated' });
        }
    } catch (err) {
        next(err);
    }
}
module.exports = handleUpdateCoverImage