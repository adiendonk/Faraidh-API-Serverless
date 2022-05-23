const SolveModel = require('../Models/solvingModel');
const {translateNama,namaTranslation} = require('../helpers/translation');

class Controller {
    static getTranslation(bahasa) {
        return(namaTranslation[bahasa]);
    }

    static getFormat() {
        return({ ahli_waris: new SolveModel(), total_harta: 0, bahasa: 'id' });
    }

    static solving( body,bahasa ) {
        const result = SolveModel.solving(body,bahasa);
        const translated = translateNama(bahasa,result);
        return({ penerima_waris: translated ,bahasa: bahasa==='id'?'Bahasa Indonesia':'English'});
    }
}

module.exports = Controller;