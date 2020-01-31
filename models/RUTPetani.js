const mongoose = require("mongoose");
const mongoSchema = mongoose.Schema({
  nik: String,
  idKecamatan: String,
  tahun   : Number,
  luasLahan: Number,
  idKios: Number,
  idPoktan: Number,
  statusVerf : {type: Number, default: 0},
  dataRUT: [
    {
      masaTanam: Number,
      status : {type: String, default: ""},
      jenisTanaman: String,
      subTotalSaprotan: Number,
      subTotalGarapDanPemeliharaan: Number,
      subTotalBiayaUsahaTani: Number,
      subPendapatanKotor: Number,
      subPrediksiPendapatan: Number,
      totalPerMT: Number,
      kebutuhanSaprotan: [
        {
          nama: String,
          id: {type: String, default : ""},
          harga: Number,
          jumlah: Number,
          hargaSubsidi: Number,
          subTotal: Number,
          jatahSubsidi: Number,
          jumlahNonSubsidi: Number,
          status: {
            type: Number,
            default: 0
          },
          subTotalSaprotan: Number
        }
      ],
      garapDanPemeliharaan: [
        {
          jenis: String,
          harga: Number,
          jumlah: Number,
          satuan: Number
        }
      ],
      jadwalUsahaTani: {
        tglPengairanAirkeLahan: String,
        tglPengolahanLahan: String,
        tglPersemaian: String,
        tglPenanaman: String,
        tglPemeliharaan: String,
        tglPemupukanDasar: String,
        tglPenyemprotanHerbisida: String,
        tglPenyemprotanFungsida1DanZpt1: String,
        tglPemupukan1: String,
        tglPemupukan2: String,
        tglPenyemprotanFungsida2DanZpt2: String,
        tglPenyemprotanInsektisida1DanGandasliBuah1: String,
        tglPenyemprotanFungsida3DanZpt3: String,
        tglPenyemprotanInsektisida2DanGandasliBuah2: String,
        tglPanen: String,
        perkiraanJumlahPanen: {
          gabahKeringPanen: String,
          gabahKeringGiling: String,
          beras: String
        },
        hasilPascaPanen: {
          hasilPanen: String,
          keterangan: String,
          pendapatanKotor: Number
        }
      }
    }
  ],
  totalBiayaUsahaTani: Number,
  pendapatanKotor: Number,
  prediksiPendapatan: Number,
  totalPanen: {
    gabahKeringPanen: Number,
    gabahKeringGiling: Number,
    beras: Number
  }
});
module.exports = mongoose.model("rutpetani", mongoSchema);
