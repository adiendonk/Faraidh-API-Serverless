const Controller = require('./controllers/solvingController');
const router = require('./router/solving');

exports.handler = async (event) => {
    // TODO implement
    var response;
    if (event.body !== null && event.body !== undefined) {
        //const body = JSON.parse(event.body);
        const body = event.body;

        response = {
            statusCode: 200,
            body: body,
        };
    }else{
        response = {
            statusCode: 200,
            body: JSON.stringify(Controller.getFormat()),
        };
    }
    
    return response;
};
