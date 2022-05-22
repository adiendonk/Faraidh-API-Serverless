const Controller = require('./controllers/solvingController');
console.log(Controller.getFormat())
exports.handler = async (event) => {
    // TODO implement
    const response = {
        statusCode: 200,
        body: Controller.getFormat,
    };
    return response;
};
