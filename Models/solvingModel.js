const Beneficiary = require('./beneficiaryModel');
const dataIndex = require('../helpers/dataIndex');
const kpk = require('../helpers/kpk');

class Ahli_Waris {
    constructor(ankLk = 0, ccLk = 0, ankPr = 0, ccPr = 0, ayah = 0, kakek = 0, sdrSeibu = 0, sdrKandung = 0, sdrSeayah = 0,
        anLkSdrKandung = 0, anLkSdrSeayah = 0, sdrKandungAyah = 0, sdrSeayahAyah = 0, ankLkSdrKandungAyah = 0, ankLkSdrSeayahAyah = 0,
        sdriKandung = 0, sdriSeayah = 0, ibu = 0, nenek = 0, ibuKakek = 0, suami = 0, istri = 0, mrdekaBudak = 0) {
        this.anak_laki_laki = ankLk,
            this.cucu_laki_laki = ccLk,
            this.anak_perempuan = ankPr,
            this.cucu_perempuan = ccPr,
            this.ayah = ayah,
            this.kakek = kakek,
            this.saudara_saudari_tiri_seibu = sdrSeibu,
            this.saudara_kandung = sdrKandung,
            this.saudara_tiri_seayah = sdrSeayah,
            this.anak_laki_laki_saudara_kandung = anLkSdrKandung,
            this.anak_laki_laki_saudara_tiri_seayah = anLkSdrSeayah,
            this.saudara_kandung_ayah = sdrKandungAyah,
            this.saudara_tiri_seayah_ayah = sdrSeayahAyah,
            this.anak_laki_laki_saudara_kandung_ayah = ankLkSdrKandungAyah,
            this.anak_laki_laki_saudara_tiri_seayah_ayah = ankLkSdrSeayahAyah,
            this.saudari_kandung = sdriKandung,
            this.saudari_seayah = sdriSeayah,
            this.ibu = ibu,
            this.nenek = nenek,
            this.ibu_kakek = ibuKakek,
            this.suami = suami,
            this.istri = istri,
            this.pria_wanita_yang_memerdekakan_budak = mrdekaBudak
    }

    // ======================================= MAIN SOLVING =======================================
    static solving(body,bahasa) {
        const {
            anak_laki_laki,
            cucu_laki_laki,
            anak_perempuan,
            cucu_perempuan,
            ayah,
            kakek,
            saudara_saudari_tiri_seibu,
            saudara_kandung,
            saudara_tiri_seayah,
            anak_laki_laki_saudara_kandung,
            anak_laki_laki_saudara_tiri_seayah,
            saudara_kandung_ayah,
            saudara_tiri_seayah_ayah,
            anak_laki_laki_saudara_kandung_ayah,
            anak_laki_laki_saudara_tiri_seayah_ayah,
            saudari_kandung,
            saudari_seayah,
            ibu,
            nenek,
            ibu_kakek,
            suami,
            istri,
            pria_wanita_yang_memerdekakan_budak
        } = body.ahli_waris;

        //jika punya anak laki-laki
        if (anak_laki_laki > 0) {
            const kandidatAhliWaris = {
                anak_laki_laki, anak_perempuan, ayah, kakek, suami, istri, ibu, nenek, ibu_kakek
            };
            return this.haveSon(kandidatAhliWaris, body.total_harta, bahasa);
        }
        //jika punya cucu laki-laki
        else if (cucu_laki_laki > 0) {
            const kandidatAhliWaris = {
                cucu_laki_laki, anak_perempuan, cucu_perempuan, ayah, kakek, suami, istri, ibu, nenek, ibu_kakek
            };
            return this.haveGrandSon(kandidatAhliWaris, body.total_harta);
        }
        //jika punya anak perempuan atau cucu perempuan
        else if (anak_perempuan > 0 || cucu_perempuan > 0) {
            const kandidatAhliWaris = {
                anak_perempuan, cucu_perempuan, ayah, kakek, suami, istri, ibu, nenek, ibu_kakek, saudara_kandung,
                saudari_kandung, saudara_tiri_seayah, saudari_seayah, anak_laki_laki_saudara_kandung, anak_laki_laki_saudara_tiri_seayah,
                saudara_kandung_ayah, saudara_tiri_seayah_ayah, anak_laki_laki_saudara_kandung_ayah, anak_laki_laki_saudara_tiri_seayah_ayah
            };
            return this.haveDaughterAndGrand(kandidatAhliWaris, body.total_harta);
        }
        //jika punya ayah atau kakek
        else if (ayah > 0 || kakek > 0) {
            const kandidatAhliWaris = {
                ayah, kakek, ibu, nenek, ibu_kakek, suami, istri
            };
            return this.haveFatherAndGrand(kandidatAhliWaris, body.total_harta);
        }
        // jika punya saudara kandung atau saudara seayah
        else if (saudara_kandung > 0 || saudara_tiri_seayah) {
            const kandidatAhliWaris = {
                saudara_saudari_tiri_seibu, saudara_kandung, saudari_kandung, saudara_tiri_seayah, saudari_seayah, suami, istri, ibu, nenek, ibu_kakek
            };
            return this.haveSiblings(kandidatAhliWaris, body.total_harta);
        }
        // Ahli waris lain
        else {    
            const kandidatAhliWaris = {
                anak_laki_laki_saudara_kandung, anak_laki_laki_saudara_tiri_seayah, saudara_kandung_ayah, saudara_tiri_seayah_ayah,
                anak_laki_laki_saudara_kandung_ayah, anak_laki_laki_saudara_tiri_seayah_ayah, saudari_kandung, saudari_seayah,
                suami, istri, ibu, nenek, ibu_kakek, saudara_saudari_tiri_seibu, pria_wanita_yang_memerdekakan_budak
            };
            return this.haveAnother(kandidatAhliWaris, body.total_harta);
        }
    }


    // =======================================
    //        JIKA PUNYA ANAK LAKI-LAKI
    // =======================================
    static haveSon(body, funds, bahasa) {
        const { anak_laki_laki, anak_perempuan, ayah, kakek, suami, istri, ibu, nenek, ibu_kakek } = body;
        let result = [];

        if (ayah > 0) result.push(new Beneficiary('ayah', '1/6', 1));
        else if (kakek > 0) result.push(new Beneficiary('kakek', '1/6', 1));

        if (suami > 0) result.push(new Beneficiary('suami', '1/4', 1));
        else if (istri > 0) result.push(new Beneficiary('istri', '1/8', istri));

        if (ibu > 0) result.push(new Beneficiary('ibu', '1/6', 1));
        else if (nenek > 0) result.push(new Beneficiary('nenek', '1/6', 1));
        else if (ibu_kakek > 0) result.push(new Beneficiary('ibu_kakek', '1/6', 1));

        let aK, sI, iN;
        let penyebut = 0;
        let pembilangSementara = 1;
        let findKPK = [];
        for (let i in result) {
            if (result[i].nama === 'ayah' || result[i].nama === 'kakek') {
                aK = result[i].bagian_hukum_waris.split('/');
                findKPK.push(+aK[1]);
                pembilangSementara *= +aK[1];
            }
            else if (result[i].nama === 'suami' || result[i].nama === 'istri') {
                sI = result[i].bagian_hukum_waris.split('/');
                findKPK.push(+sI[1]);
                pembilangSementara *= +sI[1];
            }
            else if (result[i].nama === 'ibu' || result[i].nama === 'nenek' || result[i].nama === 'ibu_kakek') {
                iN = result[i].bagian_hukum_waris.split('/');
                findKPK.push(+iN[1]);
                pembilangSementara *= +iN[1];
            }
        }

        if (findKPK.length > 0) pembilangSementara = kpk(findKPK, pembilangSementara);

        if (aK) {
            aK[0] = pembilangSementara / +aK[1] * aK[0];
            penyebut = aK[0];
        }
        if (sI) {
            sI[0] = pembilangSementara / +sI[1] * sI[0];
            penyebut += sI[0];
        }
        if (iN) {
            iN[0] = pembilangSementara / +iN[1] * iN[0];
            penyebut += iN[0];
        }

        let pembilang;

        penyebut > pembilangSementara ? pembilang = penyebut : pembilang = pembilangSementara;

        console.log(result);

        if (aK) {
            aK[1] = pembilang;
            result[dataIndex(['ayah', 'kakek'], 'nama', result)].bagian_terhitung = aK.join('/');
            result[dataIndex(['ayah', 'kakek'], 'nama', result)].updateFunds(aK[0] * funds / pembilang);
        }
        if (sI) {
            sI[1] = pembilang;
            result[dataIndex(['suami', 'istri'], 'nama', result)].bagian_terhitung = sI.join('/');
            result[dataIndex(['suami', 'istri'], 'nama', result)].updateFunds(sI[0] * funds / pembilang);
        }
        if (iN) {
            iN[1] = pembilang;
            result[dataIndex(['ibu', 'nenek', 'ibu_kakek'], 'nama', result)].bagian_terhitung = iN.join('/');
            result[dataIndex(['ibu', 'nenek', 'ibu_kakek'], 'nama', result)].updateFunds(iN[0] * funds / pembilang);
        }

        let lastFunds = (pembilang - penyebut) * funds / pembilang;
        let sisaPenyebut = pembilang - penyebut;
        console.log('pembilang >> ', pembilang);
        console.log('sampai disini');

        if (anak_perempuan > 0) {
            result.unshift(new Beneficiary('anak_perempuan', bahasa==='id'?'1/2 bagian anak laki-laki':'1/2 of son\'s share', anak_perempuan));
            result.unshift(new Beneficiary('anak_laki_laki', bahasa==='id'?'2 kali lipat anak perempuan':'2 times of daughter\'s share', anak_laki_laki));
            let pembilangAnak = (anak_laki_laki * 2) + anak_perempuan;
            // pembilang = pembilang * pembilangAnak;
            console.log('pembilang anak >> ', pembilangAnak);
            result[dataIndex(['anak_laki_laki'], 'nama', result)].updateCountPart(`${anak_laki_laki * 2}/${pembilangAnak} ${bahasa==='id'?'dari sisa':'of the remaining'} ${sisaPenyebut}/${pembilang}`);
            result[dataIndex(['anak_laki_laki'], 'nama', result)].updateFunds((anak_laki_laki * 2) * lastFunds / pembilangAnak);
            result[dataIndex(['anak_perempuan'], 'nama', result)].updateCountPart(`${anak_perempuan}/${pembilangAnak} ${bahasa==='id'?'dari sisa':'of the remaining'} ${sisaPenyebut}/${pembilang}`);
            result[dataIndex(['anak_perempuan'], 'nama', result)].updateFunds(anak_perempuan * lastFunds / pembilangAnak);
        }
        else {
            result.unshift(new Beneficiary('anak_laki_laki', bahasa==='id'?'Sisa pembagian seluruh harta':'The remaining of all assets', anak_laki_laki));
            result[dataIndex(['anak_laki_laki'], 'nama', result)].updateCountPart(`${sisaPenyebut}/${pembilang}`);
            result[dataIndex(['anak_laki_laki'], 'nama', result)].updateFunds(lastFunds);
        }

        return result;
    }

    // =======================================
    //        JIKA PUNYA CUCU LAKI-LAKI
    // =======================================
    static haveGrandSon(body, funds, bahasa) {
        const { cucu_laki_laki, anak_perempuan, cucu_perempuan, ayah, kakek, suami, istri, ibu, nenek, ibu_kakek } = body;
        let result = [];

        if (anak_perempuan > 0) {
            if (anak_perempuan > 1) result.push(new Beneficiary('anak_perempuan', '2/3', anak_perempuan));
            else result.push(new Beneficiary('anak_perempuan', '1/2', 1));
        }

        if (ayah > 0) result.push(new Beneficiary('ayah', '1/6', 1));
        else if (kakek > 0) result.push(new Beneficiary('kakek', '1/6', 1));

        if (suami > 0) result.push(new Beneficiary('suami', '1/4', 1));
        else if (istri > 0) result.push(new Beneficiary('istri', '1/8', istri));

        if (ibu > 0) result.push(new Beneficiary('ibu', '1/6', 1));
        else if (nenek > 0) result.push(new Beneficiary('nenek', '1/6', 1));
        else if (ibu_kakek > 0) result.push(new Beneficiary('ibu_kakek', '1/6', 1));

        let aP, aK, sI, iN;
        let penyebut = 0;
        let pembilangSementara = 1;
        let findKPK = [];
        for (let i in result) {
            if (result[i].nama === 'anak_perempuan') {
                aP = result[i].bagian_hukum_waris.split('/');
                findKPK.push(+aP[1]);
                pembilangSementara *= +aP[1]
            }
            if (result[i].nama === 'ayah' || result[i].nama === 'kakek') {
                aK = result[i].bagian_hukum_waris.split('/');
                findKPK.push(+aK[1]);
                pembilangSementara *= +aK[1];
            }
            else if (result[i].nama === 'suami' || result[i].nama === 'istri') {
                sI = result[i].bagian_hukum_waris.split('/');
                findKPK.push(+sI[1]);
                pembilangSementara *= +sI[1];
            }
            else if (result[i].nama === 'ibu' || result[i].nama === 'nenek' || result[i].nama === 'ibu_kakek') {
                iN = result[i].bagian_hukum_waris.split('/');
                findKPK.push(+iN[1]);
                pembilangSementara *= +iN[1];
            }
        }

        if (findKPK.length > 0) pembilangSementara = kpk(findKPK, pembilangSementara);

        if (aP) {
            aP[0] = pembilangSementara / +aP[1] * aP[0];
            penyebut += aP[0];
        }
        if (aK) {
            aK[0] = pembilangSementara / +aK[1] * aK[0];
            penyebut += aK[0];
        }
        if (sI) {
            sI[0] = pembilangSementara / +sI[1] * sI[0];
            penyebut += sI[0];
        }
        if (iN) {
            iN[0] = pembilangSementara / +iN[1] * iN[0];
            penyebut += iN[0];
        }

        let pembilang;

        penyebut > pembilangSementara ? pembilang = penyebut : pembilang = pembilangSementara;

        console.log('penyebut >> ', penyebut);
        console.log('pembilang sementara >> ', pembilangSementara);
        console.log('pembilang >> ', pembilang);

        if (aP) {
            aP[1] = pembilang;
            result[dataIndex(['anak_perempuan'], 'nama', result)].bagian_terhitung = aP.join('/');
            result[dataIndex(['anak_perempuan'], 'nama', result)].updateFunds(aP[0] * funds / pembilang);
        }
        if (aK) {
            aK[1] = pembilang;
            console.log(dataIndex(['ayah', 'kakek'], 'nama', result));
            result[dataIndex(['ayah', 'kakek'], 'nama', result)].bagian_terhitung = aK.join('/');
            result[dataIndex(['ayah', 'kakek'], 'nama', result)].updateFunds(aK[0] * funds / pembilang);
        }
        if (sI) {
            sI[1] = pembilang;
            result[dataIndex(['suami', 'istri'], 'nama', result)].bagian_terhitung = sI.join('/');
            result[dataIndex(['suami', 'istri'], 'nama', result)].updateFunds(sI[0] * funds / pembilang);
        }
        if (iN) {
            iN[1] = pembilang;
            result[dataIndex(['ibu', 'nenek', 'ibu_kakek'], 'nama', result)].bagian_terhitung = iN.join('/');
            result[dataIndex(['ibu', 'nenek', 'ibu_kakek'], 'nama', result)].updateFunds(iN[0] * funds / pembilang);
        }

        let sisaPenyebut = pembilang - penyebut;
        let lastFunds = sisaPenyebut * funds / pembilang;

        if (cucu_perempuan > 0) {
            result.unshift(new Beneficiary('cucu_perempuan', bahasa==='id'?'1/2 bagian cucu laki-laki':'1/2 part of grandson\'s share', cucu_perempuan));
            result.unshift(new Beneficiary('cucu_laki_laki', bahasa==='id'?'2 kali lipat cucu perempuan':'2 times of granddaughter\'s share', cucu_laki_laki));
            let pembilangCucu = (cucu_laki_laki * 2) + cucu_perempuan;
            // pembilang = pembilang * pembilangAnak;
            console.log('pembilang anak >> ', pembilangCucu);
            result[dataIndex(['cucu_laki_laki'], 'nama', result)].updateCountPart(`${cucu_laki_laki * 2}/${pembilangCucu} ${bahasa==='id'?'dari sisa':'of the remaining'} ${sisaPenyebut}/${pembilang}`);
            result[dataIndex(['cucu_laki_laki'], 'nama', result)].updateFunds((cucu_laki_laki * 2) * lastFunds / pembilangCucu);
            result[dataIndex(['cucu_perempuan'], 'nama', result)].updateCountPart(`${cucu_perempuan}/${pembilangCucu} ${bahasa==='id'?'dari sisa':'of the remaining'} ${sisaPenyebut}/${pembilang}`);
            result[dataIndex(['cucu_perempuan'], 'nama', result)].updateFunds(cucu_perempuan * lastFunds / pembilangCucu);
        }
        else {
            result.unshift(new Beneficiary('cucu_laki_laki', bahasa==='id'?'Sisa pembagian seluruh harta':'The remaining of all assets', cucu_laki_laki));
            result[dataIndex(['cucu_laki_laki'], 'nama', result)].updateCountPart(`${sisaPenyebut}/${pembilang}`);
            result[dataIndex(['cucu_laki_laki'], 'nama', result)].updateFunds(lastFunds);
        }

        return result;
    }

    // ===============================================
    //  JIKA PUNYA ANAK PEREMPUAN ATAU CUCU PEREMPUAN
    // ===============================================
    static haveDaughterAndGrand(body, funds, bahasa) {
        const {
            anak_perempuan, cucu_perempuan, ayah, kakek, suami, istri, ibu, nenek, ibu_kakek, saudara_kandung,
            saudari_kandung, saudara_tiri_seayah, saudari_seayah, anak_laki_laki_saudara_kandung, anak_laki_laki_saudara_tiri_seayah,
            saudara_kandung_ayah, saudara_tiri_seayah_ayah, anak_laki_laki_saudara_kandung_ayah, anak_laki_laki_saudara_tiri_seayah_ayah
        } = body;
        let result = [];

        if (anak_perempuan > 0) {
            if (anak_perempuan > 1) result.push(new Beneficiary('anak_perempuan', '2/3', anak_perempuan));
            else {
                result.push(new Beneficiary('anak_perempuan', '1/2', 1));
                if (cucu_perempuan > 0) result.push(new Beneficiary('cucu_perempuan', '1/6', cucu_perempuan));
            }
        }
        else if (cucu_perempuan > 0) {
            if (cucu_perempuan > 1) result.push(new Beneficiary('cucu_perempuan', '2/3', cucu_perempuan));
            else result.push(new Beneficiary('cucu_perempuan', '1/2', 1));
        }

        if (ayah > 0) result.push(new Beneficiary('ayah', '1/6', 1));
        else if (kakek > 0) result.push(new Beneficiary('kakek', '1/6', 1));
        else if (saudara_kandung > 0) {
            if (saudari_kandung > 0) {
                result.push(new Beneficiary('saudara_kandung', bahasa==='id'?'2 kali lipat saudari kandung':'2 times of sister\'s share', saudara_kandung));
                result.push(new Beneficiary('saudari_kandung', bahasa==='id'?'setengah bagian saudara kandung':'A half of brother\'s share', saudari_kandung));
            }
            else result.push(new Beneficiary('saudara_kandung', bahasa==='id'?'sisa pembagian seluruh harta':'The remaining of all assets', saudara_kandung));
        }
        else if (saudari_kandung > 0) {
            result.push(new Beneficiary('saudari_kandung', bahasa==='id'?'sisa pembagian seluruh harta':'The remaining of all assets', saudari_kandung));
        }
        else if (saudara_tiri_seayah > 0) {
            if (saudari_seayah > 0) {
                result.push(new Beneficiary('saudara_tiri_seayah', bahasa==='id'?'2 kali lipat saudari seayah':'2 times of half-sister (by father) share', saudara_tiri_seayah));
                result.push(new Beneficiary('saudari_seayah', bahasa==='id'?'setengah bagian saudara seayah':'A half of half-brother (by father) share', saudari_seayah));
            }
            else result.push(new Beneficiary('saudara_tiri_seayah', bahasa==='id'?'sisa pembagian seluruh harta':'The remaining of all assets', saudara_tiri_seayah));
        }
        else if (saudari_seayah > 0) result.push(new Beneficiary('saudari_seayah', bahasa==='id'?'sisa pembagian seluruh harta':'The remaining of all assets', saudari_seayah));
        else if (anak_laki_laki_saudara_kandung > 0) result.push(new Beneficiary('anak_laki_laki_saudara_kandung', bahasa==='id'?'sisa pembagian seluruh harta':'The remaining of all assets', anak_laki_laki_saudara_kandung));
        else if (anak_laki_laki_saudara_tiri_seayah > 0) result.push(new Beneficiary('anak_laki_laki_saudara_tiri_seayah', bahasa==='id'?'sisa pembagian seluruh harta':'The remaining of all assets', anak_laki_laki_saudara_tiri_seayah));
        else if (saudara_kandung_ayah > 0) result.push(new Beneficiary('saudara_kandung_ayah', bahasa==='id'?'sisa pembagian seluruh harta':'The remaining of all assets', saudara_kandung_ayah));
        else if (saudara_tiri_seayah_ayah > 0) result.push(new Beneficiary('saudara_tiri_seayah_ayah', bahasa==='id'?'sisa pembagian seluruh harta':'The remaining of all assets', saudara_tiri_seayah_ayah));
        else if (anak_laki_laki_saudara_kandung_ayah > 0) result.push(new Beneficiary('anak_laki_laki_saudara_kandung_ayah', bahasa==='id'?'sisa pembagian seluruh harta':'The remaining of all assets', anak_laki_laki_saudara_kandung_ayah));
        else if (anak_laki_laki_saudara_tiri_seayah_ayah > 0) result.push(new Beneficiary('anak_laki_laki_saudara_tiri_seayah_ayah', bahasa==='id'?'sisa pembagian seluruh harta':'The remaining of all assets', anak_laki_laki_saudara_tiri_seayah_ayah));
        else result.push(new Beneficiary('dzawil_arhaam', bahasa==='id'?'sisa pembagian seluruh harta':'The remaining of all assets', 1));

        if (suami > 0) result.push(new Beneficiary('suami', '1/4', 1));
        else if (istri > 0) result.push(new Beneficiary('istri', '1/8', istri));

        if (ibu > 0) result.push(new Beneficiary('ibu', '1/6', 1));
        else if (nenek > 0) result.push(new Beneficiary('nenek', '1/6', 1));
        else if (ibu_kakek > 0) result.push(new Beneficiary('ibu_kakek', '1/6', 1));

        let aP, cP, aK, sI, iN;
        let penyebut = 0;
        let pembilangSementara = 1;
        let findKPK = [];
        for (let i in result) {
            if (result[i].nama === 'anak_perempuan') {
                aP = result[i].bagian_hukum_waris.split('/');
                findKPK.push(+aP[1]);
                pembilangSementara *= +aP[1]
            }
            if (result[i].nama === 'cucu_perempuan') {
                cP = result[i].bagian_hukum_waris.split('/');
                findKPK.push(+cP[1]);
                pembilangSementara *= +cP[1]
            }
            if (result[i].nama === 'ayah' || result[i].nama === 'kakek') {
                aK = result[i].bagian_hukum_waris.split('/');
                findKPK.push(+aK[1]);
                pembilangSementara *= +aK[1];
            }
            else if (result[i].nama === 'suami' || result[i].nama === 'istri') {
                sI = result[i].bagian_hukum_waris.split('/');
                findKPK.push(+sI[1]);
                pembilangSementara *= +sI[1];
            }
            else if (result[i].nama === 'ibu' || result[i].nama === 'nenek' || result[i].nama === 'ibu_kakek') {
                iN = result[i].bagian_hukum_waris.split('/');
                findKPK.push(+iN[1]);
                pembilangSementara *= +iN[1];
            }
        }

        if (findKPK.length > 0) pembilangSementara = kpk(findKPK, pembilangSementara);

        if (aP) {
            aP[0] = pembilangSementara / +aP[1] * aP[0];
            penyebut += aP[0];
        }
        if (cP) {
            cP[0] = pembilangSementara / +cP[1] * cP[0];
            penyebut += cP[0];
        }
        if (aK) {
            aK[0] = pembilangSementara / +aK[1] * aK[0];
            penyebut += aK[0];
        }
        if (sI) {
            sI[0] = pembilangSementara / +sI[1] * sI[0];
            penyebut += sI[0];
        }
        if (iN) {
            iN[0] = pembilangSementara / +iN[1] * iN[0];
            penyebut += iN[0];
        }

        let pembilang;

        penyebut > pembilangSementara ? pembilang = penyebut : pembilang = pembilangSementara;

        console.log('penyebut >> ', penyebut);
        console.log('pembilang sementara >> ', pembilangSementara);
        console.log('pembilang >> ', pembilang);

        if (aP) {
            aP[1] = pembilang;
            result[dataIndex(['anak_perempuan'], 'nama', result)].bagian_terhitung = aP.join('/');
            result[dataIndex(['anak_perempuan'], 'nama', result)].updateFunds(aP[0] * funds / pembilang);
        }
        if (cP) {
            cP[1] = pembilang;
            result[dataIndex(['cucu_perempuan'], 'nama', result)].bagian_terhitung = cP.join('/');
            result[dataIndex(['cucu_perempuan'], 'nama', result)].updateFunds(cP[0] * funds / pembilang);
        }
        if (aK) {
            aK[1] = pembilang;
            console.log(dataIndex(['ayah', 'kakek'], 'nama', result));
            result[dataIndex(['ayah', 'kakek'], 'nama', result)].bagian_terhitung = aK.join('/');
            result[dataIndex(['ayah', 'kakek'], 'nama', result)].updateFunds(aK[0] * funds / pembilang);
        }
        if (sI) {
            sI[1] = pembilang;
            result[dataIndex(['suami', 'istri'], 'nama', result)].bagian_terhitung = sI.join('/');
            result[dataIndex(['suami', 'istri'], 'nama', result)].updateFunds(sI[0] * funds / pembilang);
        }
        if (iN) {
            iN[1] = pembilang;
            result[dataIndex(['ibu', 'nenek', 'ibu_kakek'], 'nama', result)].bagian_terhitung = iN.join('/');
            result[dataIndex(['ibu', 'nenek', 'ibu_kakek'], 'nama', result)].updateFunds(iN[0] * funds / pembilang);
        }

        let sisaPenyebut = pembilang - penyebut;
        let lastFunds = sisaPenyebut * funds / pembilang;

        let index = dataIndex([''], 'bagian_terhitung', result);
        let name = '';
        index !== -1 ? name = result[index].nama : '';
        if (ayah > 0 || kakek > 0) {
            let index = dataIndex(['ayah', 'kakek'], 'nama', result);
            result[index].bagian_terhitung += ` + sisa ${sisaPenyebut}/${pembilang}`;
            result[index].updateFunds(result[index].dana_didapat + lastFunds);
        }
        else if (name === 'saudara_kandung' || name === 'saudari_kandung' || name === 'saudara_tiri_seayah' || name === 'saudari_seayah') {
            if (saudara_kandung > 0) {
                if (saudari_kandung > 0) {
                    let pembilangBaru = (saudara_kandung * 2) + saudari_kandung;
                    result[dataIndex(['saudara_kandung'], 'nama', result)].updateCountPart(`${saudara_kandung * 2}/${pembilangBaru} ${bahasa==='id'?'dari sisa':'of the remaining'} ${sisaPenyebut}/${pembilang}`);
                    result[dataIndex(['saudara_kandung'], 'nama', result)].updateFunds((saudara_kandung * 2) * lastFunds / pembilangBaru);
                    result[dataIndex(['saudari_kandung'], 'nama', result)].updateCountPart(`${saudari_kandung}/${pembilangBaru} ${bahasa==='id'?'dari sisa':'of the remaining'} ${sisaPenyebut}/${pembilang}`);
                    result[dataIndex(['saudari_kandung'], 'nama', result)].updateFunds(saudari_kandung * lastFunds / pembilangBaru);
                }
                else {
                    result[index].updateCountPart(`${sisaPenyebut}/${pembilang}`);
                    result[index].updateFunds(lastFunds);
                }
            }
            else if (saudari_kandung > 0) {
                result[index].updateCountPart(`${sisaPenyebut}/${pembilang}`);
                result[index].updateFunds(lastFunds);
            }
            else if (saudara_tiri_seayah > 0) {
                if (saudari_seayah > 0) {
                    let pembilangBaru = (saudara_tiri_seayah * 2) + saudari_seayah;
                    result[dataIndex(['saudara_tiri_seayah'], 'nama', result)].updateCountPart(`${saudara_tiri_seayah * 2}/${pembilangBaru} ${bahasa==='id'?'dari sisa':'of the remaining'} ${sisaPenyebut}/${pembilang}`);
                    result[dataIndex(['saudara_tiri_seayah'], 'nama', result)].updateFunds((saudara_tiri_seayah * 2) * lastFunds / pembilangBaru);
                    result[dataIndex(['saudari_seayah'], 'nama', result)].updateCountPart(`${saudari_seayah}/${pembilangBaru} ${bahasa==='id'?'dari sisa':'of the remaining'} ${sisaPenyebut}/${pembilang}`);
                    result[dataIndex(['saudari_seayah'], 'nama', result)].updateFunds(saudari_seayah * lastFunds / pembilangBaru);
                }
                else {
                    result[index].updateCountPart(`${sisaPenyebut}/${pembilang}`);
                    result[index].updateFunds(lastFunds);
                }
            }
            else if (saudari_seayah > 0) {
                result[index].updateCountPart(`${sisaPenyebut}/${pembilang}`);
                result[index].updateFunds(lastFunds);
            }
        }
        else {
            result[index].updateCountPart(`${sisaPenyebut}/${pembilang}`);
            result[index].updateFunds(lastFunds);
        }

        return result;
    }

    // =======================================
    //       JIKA PUNYA AYAH ATAU KAKEK
    // =======================================
    static haveFatherAndGrand(body, funds, bahasa) {
        const {
            ayah, kakek, ibu, nenek, ibu_kakek, suami, istri
        } = body;
        let result = [];
        if (suami > 0 || istri > 0) {
            if (suami > 0) result.push(new Beneficiary('suami', '1/2', 1));
            else if (istri > 0) result.push(new Beneficiary('istri', '1/4', istri));
            result.push(new Beneficiary('ibu', bahasa==='id'?'1/3 dari sisa pembagian seluruh harta':'1/3 of the remaining of all assets', 1));
        }
        else if (ibu > 0) result.push(new Beneficiary('ibu', '1/3', 1));

        if (ibu < 1) {
            if (nenek > 0) result.push(new Beneficiary('nenek', '1/6', 1));
            else if (ibu_kakek > 0) result.push(new Beneficiary('ibu_kakek', '1/6', 1));
        }


        let sI, iN;
        let penyebut = 0;
        let pembilangSementara = 1;
        let findKPK = [];
        for (let i in result) {
            if (result[i].nama === 'suami' || result[i].nama === 'istri') {
                sI = result[i].bagian_hukum_waris.split('/');
                findKPK.push(+sI[1]);
                pembilangSementara *= +sI[1];
            }
            else if ((result[i].nama === 'ibu' && result[i].bagian_didapat === '1/3') || result[i].nama === 'nenek' || result[i].nama === 'ibu_kakek') {
                iN = result[i].bagian_hukum_waris.split('/');
                findKPK.push(+iN[1]);
                pembilangSementara *= +iN[1];
            }
        }

        if (findKPK.length > 0) pembilangSementara = kpk(findKPK, pembilangSementara);

        if (sI) {
            sI[0] = pembilangSementara / +sI[1] * sI[0];
            penyebut += sI[0];
        }
        if (iN) {
            iN[0] = pembilangSementara / +iN[1] * iN[0];
            penyebut += iN[0];
        }

        let pembilang;

        penyebut > pembilangSementara ? pembilang = penyebut : pembilang = pembilangSementara;

        console.log('penyebut >> ', penyebut);
        console.log('pembilang sementara >> ', pembilangSementara);
        console.log('pembilang >> ', pembilang);

        if (sI) {
            sI[1] = pembilang;
            result[dataIndex(['suami', 'istri'], 'nama', result)].bagian_terhitung = sI.join('/');
            result[dataIndex(['suami', 'istri'], 'nama', result)].updateFunds(sI[0] * funds / pembilang);
        }
        if (iN) {
            iN[1] = pembilang;
            result[dataIndex(['ibu', 'nenek', 'ibu_kakek'], 'nama', result)].bagian_terhitung = iN.join('/');
            result[dataIndex(['ibu', 'nenek', 'ibu_kakek'], 'nama', result)].updateFunds(iN[0] * funds / pembilang);
        }

        let sisaPenyebut = pembilang - penyebut;
        let lastFunds = sisaPenyebut * funds / pembilang;
        let name, text = '';
        if (ibu > 0 && result[dataIndex(['ibu'], 'nama', result)].bagian_didapat !== '1/3') {
            result[dataIndex(['ibu'], 'nama', result)].updateCountPart(`${bahasa==='id'?'1/3 dari':'1/3 of'} ${sisaPenyebut}/${pembilang}`);
            result[dataIndex(['ibu'], 'nama', result)].updateFunds(lastFunds / 3);
            lastFunds -= lastFunds / 3;
            text = bahasa==='id'?' - 1/3 bagian ibu':' - 1/3 part of mother\'s share';
        }
        if (ayah > 0) name = 'ayah';
        else name = 'kakek';
        result.unshift(new Beneficiary(name, bahasa==='id'?'Sisa pembagian seluruh harta':'The remaining of all assets', 1));
        result[dataIndex([name], 'nama', result)].updateCountPart(`${sisaPenyebut}/${pembilang}${text}`);
        result[dataIndex([name], 'nama', result)].updateFunds(lastFunds);

        return result;
    }

    // ================================================
    //  JIKA PUNYA SAUDARA KANDUNG ATAU SAUDARA SEAYAH
    // ================================================
    static haveSiblings(body, funds, bahasa) {
        const {
            saudara_saudari_tiri_seibu, saudara_kandung, saudari_kandung, saudara_tiri_seayah, saudari_seayah, suami, istri, ibu, nenek, ibu_kakek
        } = body;
        let result = [];

        if (saudara_saudari_tiri_seibu > 0) {
            if (saudara_saudari_tiri_seibu > 1) result.push(new Beneficiary('saudara_saudari_tiri_seibu', '1/3', saudara_saudari_tiri_seibu));
            else result.push(new Beneficiary('saudara_saudari_tiri_seibu', '1/6', saudara_saudari_tiri_seibu))
        }

        if (suami > 0) result.push(new Beneficiary('suami', '1/2', 1));
        else if (istri > 0) result.push(new Beneficiary('istri', '1/4', istri));

        if (ibu > 0) result.push(new Beneficiary('ibu', '1/6', 1));
        else if (nenek > 0) result.push(new Beneficiary('nenek', '1/6', 1));
        else if (ibu_kakek > 0) result.push(new Beneficiary('ibu_kakek', '1/6', 1));

        if (saudara_kandung < 1 && saudari_kandung > 0) {
            if (saudari_kandung > 1) result.push(new Beneficiary('saudari_kandung', '2/3', saudari_kandung));
            else result.push(new Beneficiary('saudari_kandung', '1/2', 1))
        }

        let ssI, sI, iN, sK;
        let penyebut = 0;
        let pembilangSementara = 1;
        let findKPK = [];
        for (let i in result) {
            if (result[i].nama === 'saudara_saudari_tiri_seibu') {
                ssI = result[i].bagian_hukum_waris.split('/');
                findKPK.push(+ssI[1]);
                pembilangSementara *= +ssI[1];
            }
            else if (result[i].nama === 'suami' || result[i].nama === 'istri') {
                sI = result[i].bagian_hukum_waris.split('/');
                findKPK.push(+sI[1]);
                pembilangSementara *= +sI[1];
            }
            else if (result[i].nama === 'ibu' || result[i].nama === 'nenek' || result[i].nama === 'ibu_kakek') {
                iN = result[i].bagian_hukum_waris.split('/');
                findKPK.push(+iN[1]);
                pembilangSementara *= +iN[1];
            }
            else if (result[i].nama === 'saudari_kandung') {
                sK = result[i].bagian_hukum_waris.split('/');
                findKPK.push(+sK[1]);
                pembilangSementara *= +sK[1];
            }
        }

        if (findKPK.length > 0) pembilangSementara = kpk(findKPK, pembilangSementara);

        if (ssI) {
            ssI[0] = pembilangSementara / +ssI[1] * ssI[0];
            penyebut += ssI[0];
        }
        if (sI) {
            sI[0] = pembilangSementara / +sI[1] * sI[0];
            penyebut += sI[0];
        }
        if (iN) {
            iN[0] = pembilangSementara / +iN[1] * iN[0];
            penyebut += iN[0];
        }
        if (sK) {
            sK[0] = pembilangSementara / +sK[1] * sK[0];
            penyebut += sK[0];
        }

        let pembilang;

        penyebut > pembilangSementara ? pembilang = penyebut : pembilang = pembilangSementara;

        console.log('penyebut >> ', penyebut);
        console.log('pembilang sementara >> ', pembilangSementara);
        console.log('pembilang >> ', pembilang);

        if (ssI) {
            ssI[1] = pembilang;
            result[dataIndex(['saudara_saudari_tiri_seibu'], 'nama', result)].bagian_terhitung = ssI.join('/');
            result[dataIndex(['saudara_saudari_tiri_seibu'], 'nama', result)].updateFunds(ssI[0] * funds / pembilang);
        }
        if (sI) {
            sI[1] = pembilang;
            result[dataIndex(['suami', 'istri'], 'nama', result)].bagian_terhitung = sI.join('/');
            result[dataIndex(['suami', 'istri'], 'nama', result)].updateFunds(sI[0] * funds / pembilang);
        }
        if (iN) {
            iN[1] = pembilang;
            result[dataIndex(['ibu', 'nenek', 'ibu_kakek'], 'nama', result)].bagian_terhitung = iN.join('/');
            result[dataIndex(['ibu', 'nenek', 'ibu_kakek'], 'nama', result)].updateFunds(iN[0] * funds / pembilang);
        }
        if (sK) {
            sK[1] = pembilang;
            result[dataIndex(['saudari_kandung'], 'nama', result)].bagian_terhitung = sK.join('/');
            result[dataIndex(['saudari_kandung'], 'nama', result)].updateFunds(sK[0] * funds / pembilang);
        }

        let sisaPenyebut = pembilang - penyebut;
        let lastFunds = sisaPenyebut * funds / pembilang;
        let name;
        if (saudara_kandung > 0) name = ['saudara_kandung', 'saudari_kandung'];
        else name = ['saudara_tiri_seayah', 'saudari_seayah'];
        if (saudari_seayah > 0 || (saudara_tiri_seayah < 1 && saudari_kandung > 0)) {
            result.unshift(new Beneficiary(name[1], `1/2 bagian ${name[0]}`, body[name[1]]));
            result.unshift(new Beneficiary(name[0], `2 kali lipat ${name[1]}`, body[name[0]]));
            let pembilangBaru = (body[name[0]] * 2) + body[name[1]];
            result[dataIndex([name[0]], 'nama', result)].updateCountPart(`${body[name[0]] * 2}/${pembilangBaru} ${bahasa==='id'?'dari sisa':'of the remaining'} ${sisaPenyebut}/${pembilang}`);
            result[dataIndex([name[0]], 'nama', result)].updateFunds((body[name[0]] * 2) * lastFunds / pembilangBaru);
            result[dataIndex([name[1]], 'nama', result)].updateCountPart(`${body[name[1]]}/${pembilangBaru} ${bahasa==='id'?'dari sisa':'of the remaining'} ${sisaPenyebut}/${pembilang}`);
            result[dataIndex([name[1]], 'nama', result)].updateFunds(body[name[1]] * lastFunds / pembilangBaru);
        }
        else {
            result.unshift(new Beneficiary(name[0], bahasa==='id'?'Sisa pembagian seluruh harta':'The remaining of all assets', body[name[0]]));
            result[dataIndex([name[0]], 'nama', result)].updateCountPart(`${sisaPenyebut}/${pembilang}`);
            result[dataIndex([name[0]], 'nama', result)].updateFunds(lastFunds);
        }

        return result;

    }

    // =======================================
    //           AHLI WARIS LAINNYA
    // =======================================
    static haveAnother(body, funds, bahasa) {
        const {
            anak_laki_laki_saudara_kandung, anak_laki_laki_saudara_tiri_seayah, saudara_kandung_ayah, saudara_tiri_seayah_ayah,
            anak_laki_laki_saudara_kandung_ayah, anak_laki_laki_saudara_tiri_seayah_ayah, saudari_kandung, saudari_seayah,
            suami, istri, ibu, nenek, ibu_kakek, saudara_saudari_tiri_seibu, pria_wanita_yang_memerdekakan_budak
        } = body;
        let result = [];

        if (saudara_saudari_tiri_seibu > 0) {
            if (saudara_saudari_tiri_seibu > 1) result.push(new Beneficiary('saudara_saudari_tiri_seibu', '1/3', saudara_saudari_tiri_seibu));
            else result.push(new Beneficiary('saudara_saudari_tiri_seibu', '1/6', saudara_saudari_tiri_seibu))
        }

        if (suami > 0) result.push(new Beneficiary('suami', '1/2', 1));
        else if (istri > 0) result.push(new Beneficiary('istri', '1/4', istri));

        if (ibu > 0) {
            if (saudari_kandung < 1 && saudari_seayah < 1) result.push(new Beneficiary('ibu', '1/3', 1));
            else result.push(new Beneficiary('ibu', '1/6', 1));
        } 
        else if (nenek > 0) result.push(new Beneficiary('nenek', '1/6', 1));
        else if (ibu_kakek > 0) result.push(new Beneficiary('ibu_kakek', '1/6', 1));

        if (saudari_kandung > 0) {
            if (saudari_kandung > 1) result.push(new Beneficiary('saudari_kandung', '2/3', saudari_kandung));
            else result.push(new Beneficiary('saudari_kandung', '1/2', 1))
        }
        else if (saudari_seayah > 0) {
            if (saudari_seayah > 1) result.push(new Beneficiary('saudari_seayah', '2/3', saudari_seayah));
            else result.push(new Beneficiary('saudari_seayah', '1/2', 1))
        }

        let ssI, sI, iN, sKA;
        let penyebut = 0;
        let pembilangSementara = 1;
        let findKPK = [];
        for (let i in result) {
            if (result[i].nama === 'suami' || result[i].nama === 'istri') {
                sI = result[i].bagian_hukum_waris.split('/');
                findKPK.push(+sI[1]);
                pembilangSementara *= +sI[1];
            }
            else if (result[i].nama === 'ibu' || result[i].nama === 'nenek' || result[i].nama === 'ibu_kakek') {
                iN = result[i].bagian_hukum_waris.split('/');
                findKPK.push(+iN[1]);
                pembilangSementara *= +iN[1];
            }
            else if (result[i].nama === 'saudari_kandung' || result[i].nama === 'saudari_seayah') {
                sKA = result[i].bagian_hukum_waris.split('/');
                findKPK.push(+sKA[1]);
                pembilangSementara *= +sKA[1];
            }
            else if (result[i].nama === 'saudara_saudari_tiri_seibu') {
                ssI = result[i].bagian_hukum_waris.split('/');
                findKPK.push(+ssI[1]);
                pembilangSementara *= +ssI[1];
            }
        }

        if (findKPK.length > 0) pembilangSementara = kpk(findKPK, pembilangSementara);

        if (ssI) {
            ssI[0] = pembilangSementara / +ssI[1] * ssI[0];
            penyebut += ssI[0];
        }
        if (sI) {
            sI[0] = pembilangSementara / +sI[1] * sI[0];
            penyebut += sI[0];
        }
        if (iN) {
            iN[0] = pembilangSementara / +iN[1] * iN[0];
            penyebut += iN[0];
        }
        if (sKA) {
            sKA[0] = pembilangSementara / +sKA[1] * sKA[0];
            penyebut += sKA[0];
        }

        let pembilang;

        penyebut > pembilangSementara ? pembilang = penyebut : pembilang = pembilangSementara;

        console.log('penyebut >> ', penyebut);
        console.log('pembilang sementara >> ', pembilangSementara);
        console.log('pembilang >> ', pembilang);

        if (ssI) {
            ssI[1] = pembilang;
            result[dataIndex(['saudara_saudari_tiri_seibu'], 'nama', result)].bagian_terhitung = ssI.join('/');
            result[dataIndex(['saudara_saudari_tiri_seibu'], 'nama', result)].updateFunds(ssI[0] * funds / pembilang);
        }
        if (sI) {
            sI[1] = pembilang;
            result[dataIndex(['suami', 'istri'], 'nama', result)].bagian_terhitung = sI.join('/');
            result[dataIndex(['suami', 'istri'], 'nama', result)].updateFunds(sI[0] * funds / pembilang);
        }
        if (iN) {
            iN[1] = pembilang;
            result[dataIndex(['ibu', 'nenek', 'ibu_kakek'], 'nama', result)].bagian_terhitung = iN.join('/');
            result[dataIndex(['ibu', 'nenek', 'ibu_kakek'], 'nama', result)].updateFunds(iN[0] * funds / pembilang);
        }
        if (sKA) {
            sKA[1] = pembilang;
            result[dataIndex(['saudari_kandung', 'saudari_seayah'], 'nama', result)].bagian_terhitung = sKA.join('/');
            result[dataIndex(['saudari_kandung', 'saudari_seayah'], 'nama', result)].updateFunds(sKA[0] * funds / pembilang);
        }

        let sisaPenyebut = pembilang - penyebut;
        let lastFunds = sisaPenyebut * funds / pembilang;
        let name;
        if (anak_laki_laki_saudara_kandung > 0) name = 'anak_laki_laki_saudara_kandung';
        else if (anak_laki_laki_saudara_tiri_seayah > 0) name = 'anak_laki_laki_saudara_tiri_seayah';
        else if (saudara_kandung_ayah > 0) name = 'saudara_kandung_ayah';
        else if (saudara_tiri_seayah_ayah > 0) name = 'saudara_tiri_seayah_ayah';
        else if (anak_laki_laki_saudara_kandung_ayah > 0) name = 'anak_laki_laki_saudara_kandung_ayah';
        else if (anak_laki_laki_saudara_tiri_seayah_ayah > 0) name = 'anak_laki_laki_saudara_tiri_seayah_ayah';
        else if (pria_wanita_yang_memerdekakan_budak > 0) name = 'pria_wanita_yang_memerdekakan_budak'; 
        else name = 'dzawil_arhaam';
        result.unshift(new Beneficiary(name, 'Sisa pembagian seluruh harta', body[name]));
        result[dataIndex([name], 'nama', result)].bagian_terhitung = `${sisaPenyebut}/${pembilang}`;
        result[dataIndex([name], 'nama', result)].updateFunds(lastFunds);

        return result;
    }
}

module.exports = Ahli_Waris;