const commentModel = require('../models/comment');
const increamentCommentField = async (commentId, field, value) => {
    if(!!!commentId || !!!field || !!!value){
        return;
    }
    const response = await commentModel.findByIdAndUpdate(commentId, { $inc: { [field]: value } });
    return response;
}
module.exports = increamentCommentField;