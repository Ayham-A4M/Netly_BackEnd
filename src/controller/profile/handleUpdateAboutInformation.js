const userModel = require('../../models/user');
const ObjectId=require('mongoose').Types.ObjectId
const handleUpdateAboutInformation = async (req, res, next) => {
    try {
        console.log(req.body);
        const updateInfomration = req.body;
        const userId = res.locals.id;
        const response = await userModel.findByIdAndUpdate(new ObjectId(userId), updateInfomration);
        if(response){
            return res.status(200).send({msg:'profile updated'});
        }
    } catch (err) {
        next(err);
    }
}
module.exports=handleUpdateAboutInformation;