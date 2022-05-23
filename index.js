const Controller = require('./controllers/solvingController');

exports.handler = async (event) => {
    // TODO implement
    var response;
    if (event && event.queryStringParameters && event.queryStringParameters.bahasa){
        response = {
            statusCode: 200,
            body: JSON.stringify(Controller.getTranslation(event.queryStringParameters.bahasa)),
        };
    }else if (event.body !== null && event.body !== undefined) {
        response = {
            statusCode: 200,
            body: JSON.stringify(Controller.solving(JSON.parse(event.body),JSON.parse(event.body).bahasa)),
        };
    }else{
        response = {
            statusCode: 200,
            body: JSON.stringify(Controller.getFormat()),
        };
    }
    
    return response;
};
