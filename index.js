const Controller = require('./controllers/solvingController');

exports.handler = async (event) => {
    // TODO implement
    const response = {
        statusCode: 200,
        body: JSON.stringify(Controller.getFormat()),
    };
    return response;
};
