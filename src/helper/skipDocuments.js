const skipDocuments = (page, limit) => {
    return (!page || page == 1) ? 0 : (page-1) * limit;
    // example user send he want page 5 page 5 means from 40 to 50 if(limit == 10) then we need to skip first 40 post so we multiple page-1*limit 
}
module.exports=skipDocuments