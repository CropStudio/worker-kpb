const mongoose = require("mongoose");
const mongoSchema = mongoose.Schema({
  idKecamatan: String,
  tahun   : Number,
  luasLahan: Number,
  statusVerf : {type: Number, default: 0},
  dataRUT: [
    {
      masaTanam: Number,
      status : {type: String, default: ""},
      jenisTanaman: String,
      kebutuhanSaprotan: [
        {
          nama: String,
          id: {type: String, default : ""},
          harga: Number,
          jumlah: Number
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
  sumberAirLahan: {
    irigasi: {
      tglAwal: String,
      tglLahir: String,
      id_kab: String
    }
  },
  totalBiayaUsahaTani: Number,
  pendapatanKotor: Number,
  prediksiPendapatan: Number
});
module.exports = mongoose.model("rutpoktan", mongoSchema);
