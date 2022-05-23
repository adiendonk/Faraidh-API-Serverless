const Controller = require('./controllers/solvingController');

exports.handler = async (event) => {
    // TODO implement
    var response;console.log('asd')
    if (event.body !== null && event.body !== undefined) {
        response = {
            statusCode: 200,
            body: JSON.stringify(Controller.solving(JSON.parse(event.body))),
        };
    }else{
        response = {
            statusCode: 200,
            body: JSON.stringify(Controller.getFormat()),
        };
    }
    
    return response;
};
