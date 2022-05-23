const SolveModel = require('../Models/solvingModel');

class Controller {
    static getFormat() {
        return({ ahli_waris: new SolveModel(), total_harta: 0, bahasa: 'id' });
    }

    static solving( body,bahasa ) {
        const result = SolveModel.solving(body,bahasa);
        return({ penerima_waris: result ,bahasa: bahasa==='id'?'Bahasa Indonesia':'English'});
    }
}

module.exports = Controller;