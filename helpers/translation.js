const namaTranslation = {
    id: {
        anak_laki_laki: 'Anak Laki-laki',
        cucu_laki_laki: 'Cucu Laki-laki Dari Jalur Anak Laki-laki',
        anak_perempuan: 'Anak Perempuan',
        cucu_perempuan: 'Cucu Perempuan Dari Jalur Anak Laki-laki',
        ayah: 'Ayah',
        kakek: 'Kakek',
        saudara_saudari_tiri_seibu: 'Saudara/saudari (Tiri) Seibu',
        saudara_kandung: 'Saudara Kandung',
        saudara_tiri_seayah: 'Saudara (Tiri) Seayah',
        anak_laki_laki_saudara_kandung: 'Anak Laki-laki Dari Saudara Kandung',
        anak_laki_laki_saudara_tiri_seayah: 'Anak Laki-laki Dari Saudara (Tiri) Seayah',
        saudara_kandung_ayah: 'Saudara Kandung Ayah',
        saudara_tiri_seayah_ayah: 'Paman (Tiri) Seayah',
        anak_laki_laki_saudara_kandung_ayah: 'Anak Laki-laki Dari Saudara Kandung Ayah',
        anak_laki_laki_saudara_tiri_seayah_ayah: 'Anak Dari Paman (Tiri) Seayah',
        saudari_kandung: 'Saudari (Perempuan) Kandung',
        saudari_seayah: 'Saudari (Perempuan) (Tiri) Seayah',
        ibu: 'Ibu Kandung',
        nenek: 'Nenek',
        ibu_kakek: 'Ibunya Kakek',
        suami: 'Suami',
        istri: 'Istri',
        pria_wanita_yang_memerdekakan_budak: 'Pria/Wanita Yang Memerdekakan Budak'
    },
    en: {
        anak_laki_laki: 'Son',
        cucu_laki_laki: 'Grandson From Son',
        anak_perempuan: 'Daughter',
        cucu_perempuan: 'Grandaughter From Son',
        ayah: 'Father',
        kakek: 'Grandfather',
        saudara_saudari_tiri_seibu: 'One Mother\'s Sister/Brother (Stepbrother/Stepsister)',
        saudara_kandung: 'Siblings',
        saudara_tiri_seayah: 'One Father\'s Sister/Brother (Stepbrother/Stepsister)',
        anak_laki_laki_saudara_kandung: 'Sibling\'s (Male) Son',
        anak_laki_laki_saudara_tiri_seayah: 'Son of One Father\'s Sister/Brother (Stepbrother/Stepsister)',
        saudara_kandung_ayah: 'Father\'s Sibling',
        saudara_tiri_seayah_ayah: 'One Father\'s Step Uncle',
        anak_laki_laki_saudara_kandung_ayah: 'Son of Father\'s Sibling',
        anak_laki_laki_saudara_tiri_seayah_ayah: 'Son of One Father\'s Step Uncle',
        saudari_kandung: 'Sister',
        saudari_seayah: 'One Father\'s Step Sister',
        ibu: 'Mother',
        nenek: 'Grandmother',
        ibu_kakek: 'Mother of Grandfather',
        suami: 'Husband',
        istri: 'Wife',
        pria_wanita_yang_memerdekakan_budak: 'Man/Woman Who Free The Slaves'
    }
}

function translateNama(bahasa,input){

    var translated = input;
    for (let i in input){
        const orig = input[i].nama;
        const translation = namaTranslation[bahasa];
        const namaTranslated = translation[orig];
        translated[i].nama=namaTranslated;
    }
    return translated;
}

module.exports = {
    translateNama,
    namaTranslation
}