
const calculateNumberOfPages = (countOfDocs, limit) => {
    return Math.ceil(countOfDocs / limit) 
    //for example if we have in DB 10 posts and limit is 3 then there are 4 pages 3 3 3 and the last one has one post 
}
module.exports = calculateNumberOfPages
