const postModel = require('../models/post');
const increamentPostField = async (postId, postField, value) => {
    const response = await postModel.findByIdAndUpdate(postId, { $inc: { [postField]: value } });
    return response;
}
module.exports = increamentPostField;