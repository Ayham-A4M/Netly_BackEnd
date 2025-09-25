const errorHandling = (error, req, res, next) => {
    console.log('Error middleware triggered');
    console.log(error.message)
    if (error.isJoi) {
        return res.status(400).send({ msg: error.message });
    }
    if (error.statusCode) {
        return res.status(error.statusCode).send({ msg: error.message });
    }
    if (error.name === "Error" || error instanceof Error) {
        return res.status(500).send({ msg: 'server error' });
    }
}
module.exports = errorHandling