const errorHandling = (error, req, res, next) => {
    if (error.isJoi) {
        return res.status(400).send({ msg: error.message });
    }
    if (error.statusCode) {
        return res.status(error.statusCode).send({ msg: error.message });
    }
    if (error.Name === "Error" || error instanceof Error) {
        return res.status(500).send({msg:'server error'});
    }
}
module.exports = errorHandling