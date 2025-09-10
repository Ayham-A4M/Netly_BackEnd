const skipDocuments = require("./skipDocuments");
const paginationVariable = (page,limit=10) => {
    const skip = skipDocuments(page, limit);
    return {skip,limit}
}
module.exports=paginationVariable;
