const commentModel = require('../../models/comment');
const paginationVariable = require('../../helper/paginitionVariables');
const calculateNumberOfPages = require('../../helper/calculateNumberOfPages');

const handleGetUserComments = async (req, res, next) => {
    try {
        const userId = res.locals.id;
        const page = parseInt(req.query.page) || 1;
        const { skip, limit } = paginationVariable(page, 15);
        let limitOfPages;
        let totalDocs;
        const comments = await commentModel.find({ userId }).skip(skip).limit(limit);
        if (comments.length > 0) {
            const response = { activity:comments };
            if (page === 1) {
                totalDocs = await commentModel.countDocuments({ userId });
                limitOfPages = calculateNumberOfPages(totalDocs, limit);
                response.limitOfPages = limitOfPages;
            }
            res.status(200).send(response);
        }
    } catch (err) {
        next(err);
    }
};

module.exports = handleGetUserComments;