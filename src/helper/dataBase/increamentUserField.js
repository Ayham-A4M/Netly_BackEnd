const userModel = require('../../models/user');
const increamentUserField = async (userId, field, value) => {
    const response = await userModel.findByIdAndUpdate(userId, { $inc: { [field]: value } });
    return response;
}
module.exports = increamentUserField;