const SolveModel = require('../Models/solvingModel');

class Controller {
    static getFormat() {
        return({ ahli_waris: new SolveModel(), total_harta: 0 });
    }

    static solving( body ) {
        const result = SolveModel.solving(body);
        //res.status(200).json({ penerima_waris: result });
        return({ penerima_waris: result });
    }
}

module.exports = Controller;