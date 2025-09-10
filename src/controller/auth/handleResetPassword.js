const userModel = require('../../models/user');
const bcrybt = require('bcryptjs')
const handleResetPassword = async (req, res, next) => {
    try {
        const userId = res.locals.id;
        const newPassword = req.body.newPassword;
        const hashPassword = await bcrybt.hashSync(newPassword, 10);
        const response=await userModel.findByIdAndUpdate(userId,{password:hashPassword});
        if(response){
            return res.status(200).send({msg:"password reset"});
        }
    } catch (err) {
        next(err)
    }

}
module.exports=handleResetPassword