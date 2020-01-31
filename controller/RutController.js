const RutModel = require('../models/RUT')
const RutPetani = require('../models/RutPetani')
exports.parse = (message, channel) => {
  // console.log(message.data.idDesa)
  showRutPerkecamatanAll('1801042001').then((res) => {
    RutPetani.insertMany(res).then(() => {
      console.log('data berhasil di input')
    })
    // console.log(res)
  })
}

const showRutPerkecamatanAll = async (idDesa) =>
  new Promise(async (resolve, reject) => {
    const tahunSekarang = new Date().getFullYear();
    RutModel
    .aggregate([
      {
        $match: { idDesa: idDesa }
      },
      {
        $lookup: {
          from: "pupuk_subsidis",
          localField: "dataRUT.kebutuhanSaprotan.id",
          foreignField: "id",
          as: "barangSubsidi"
        }
      },
      {
        $lookup: {
          from: "petanis",
          localField: "idDesa",
          foreignField: "area.sub_district_code",
          as: "petani"
        }
      },
      {
        $lookup: {
          from: "e_rdkks",
          localField: "petani.nik",
          foreignField: "farmer_nik",
          as: "rdkk"
        }
      },
      { $match: { "rdkk.year": tahunSekarang, "rdkk.status.id": 6 } }
      ])
      .then(res => {
        if (res.length > 0) {
          let mainData = res[0]
          delete mainData._id
          let dataPetani = Array.from(mainData.petani)
          // dataPetani.splice(30, 527)
          let dataRDKK = mainData.rdkk
          // let dataRUT = mainData.dataRUT
          delete mainData.petani
          delete mainData.rdkk
          let dataBaru = dataPetani.map(data => {
            let rdkk = dataRDKK.filter(r => {
              return r.farmer_nik === data.nik
            })
            let rdkkFinal = rdkk.length < 1 ? null : rdkk[0]
            let dataPerPetani = parseData(mainData, data, rdkkFinal)
            let idKios = null
            let idPoktan = null
            if (rdkkFinal !== null) {
              idKios = rdkkFinal.retailer_id
              idPoktan = rdkkFinal.farmer_group_id
            }
            // console.log(dataPerPetani)
            // dataBaru.push(dataPerPetani)
            // return data.nik
            // return dataPerPetani
            // console.log(mt1)
            // return parseData(mainData, data, rdkkFinal)
            const mt1 = dataPerPetani.dataRUT[0]
            const mt2 = dataPerPetani.dataRUT[1]
            const mt3 = dataPerPetani.dataRUT[2]
            return {
              nik: data.nik,
              idPenuyuluh: mainData.idPenyuluh,
              idDesa: mainData.idDesa,
              tahun: dataPerPetani.tahun,
              idPoktan: idPoktan,
              idKios: idKios,
              dataRUT: [
                {
                  masaTanam: mt1.masaTanam,
                  jenisTanaman: mt1.jenisTanaman,
                  subTotalSaprotan: mt1.subTotalSaprotan,
                  subTotalGarapDanPemeliharaan: mt1.subTotalGarapDanPemeliharaan,
                  subTotalBiayaUsahaTani: mt1.subTotalBiayaUsahaTani,
                  subPendapatanKotor: mt1.subPendapatanKotor,
                  subPrediksiPendapatan: mt1.subPrediksiPendapatan,
                  totalPerMT: mt1.Number,
                  kebutuhanSaprotan: getKebutuhanSaprotan(mt1.kebutuhanSaprotan),
                  garapDanPemeliharaan: getGarapDanPemeliharaan(mt1.garapDanPemeliharaan)
                },
                {
                  masaTanam: mt2.masaTanam,
                  jenisTanaman: mt2.jenisTanaman,
                  subTotalSaprotan: mt2.subTotalSaprotan,
                  subTotalGarapDanPemeliharaan: mt2.subTotalGarapDanPemeliharaan,
                  subTotalBiayaUsahaTani: mt2.subTotalBiayaUsahaTani,
                  subPendapatanKotor: mt2.subPendapatanKotor,
                  subPrediksiPendapatan: mt2.subPrediksiPendapatan,
                  totalPerMT: mt2.Number,
                  kebutuhanSaprotan: getKebutuhanSaprotan(mt2.kebutuhanSaprotan),
                  garapDanPemeliharaan: getGarapDanPemeliharaan(mt2.garapDanPemeliharaan)
                },
                {
                  masaTanam: mt3.masaTanam,
                  jenisTanaman: mt3.jenisTanaman,
                  subTotalSaprotan: mt3.subTotalSaprotan,
                  subTotalGarapDanPemeliharaan: mt3.subTotalGarapDanPemeliharaan,
                  subTotalBiayaUsahaTani: mt3.subTotalBiayaUsahaTani,
                  subPendapatanKotor: mt3.subPendapatanKotor,
                  subPrediksiPendapatan: mt3.subPrediksiPendapatan,
                  totalPerMT: mt3.Number,
                  kebutuhanSaprotan: getKebutuhanSaprotan(mt3.kebutuhanSaprotan),
                  garapDanPemeliharaan: getGarapDanPemeliharaan(mt3.garapDanPemeliharaan)
                }
              ],
              totalBiayaUsahaTani: dataPerPetani.totalBiayaUsahaTani,
              pendapatanKotor: dataPerPetani.pendapatanKotor,
              prediksiPendapatan: dataPerPetani.prediksiPendapatan,
              totalPanen: {
                gabahKeringPanen: dataPerPetani.totalPanen.gabahKeringPanen,
                gabahKeringGiling: dataPerPetani.totalPanen.gabahKeringGiling,
                beras: dataPerPetani.totalPanen.beras
              }
            }
          })


          // for (let i = 0; i < dataPetani.length; i++) {
          //   let rdkk = dataRDKK.filter(r => {
          //     return r.farmer_nik === dataPetani[i].nik
          //   })
          //   let rdkkFinal = rdkk.length < 1 ? null : rdkk[0]
          //   const dataPerPetani = parseData(mainData, dataPetani[i], rdkkFinal)
          //   let idKios = null
          //   let idPoktan = null
          //   if (rdkkFinal !== null) {
          //     idKios = rdkkFinal.retailer_id
          //     idPoktan = rdkkFinal.farmer_group_id
          //   }
          //   console.log(dataPerPetani)
          //   // dataBaru.push(dataPerPetani)

          // }

          // console.log(dataPetani.length)
          resolve(dataBaru)
        }
      });
  });

  const getKebutuhanSaprotan = (arr) => {
    let data =  arr.map(res => {
      return {
        nama: res.nama,
        harga: res.harga,
        jumlah: res.jumlah,
        id: res.id,
        hargaSubsidi: res.hargaSubsidi,
        subTotal: res.subTotal,
        jatahSubsidi: res.jatahSubsidi,
        jumlahNonSubsidi: res.jumlahNonSubsidi
      }
    })
    return data
  }

  getGarapDanPemeliharaan = (arr) => {
    let data = arr.map(res => {
      return {
        jenis: res.jenis,
        harga: res.harga,
        jumlah: res.jumlah,
        satuan: res.satuan
      }
    })
    return data
  }

  const getLuasLahanPerMT = (data, mainData) => {
    let luasLahan
    if (mainData.petani.luas_tanah === undefined) {
      luasLahan = 0
    } else {
      if (data === 1) {
        luasLahan = mainData.petani.luas_tanah.mt1_planting_area === undefined ? 0 : mainData.petani.luas_tanah.mt1_planting_area
      } else if (data === 2) { 
        luasLahan = mainData.petani.luas_tanah.mt2_planting_area === undefined ? 0 : mainData.petani.luas_tanah.mt2_planting_area
      }else {
        luasLahan = mainData.petani.luas_tanah.mt3_planting_area === undefined ? 0 : mainData.petani.luas_tanah.mt3_planting_area
      }
    }
    return Number(luasLahan)
  }
  const getJatahSubsidi = (jenisPupuk, masaTanam, mainData) => {
    let jatah = 0
    if (mainData.rdkk === null) {
      jatah = 0
    } else {
      if (jenisPupuk === 'za') {
        if (masaTanam === 1) {
          jatah = mainData.rdkk.mt1_za
        } else if (masaTanam === 2) {
          jatah = mainData.rdkk.mt2_za
        } else {
          jatah = mainData.rdkk.mt3_za
        }
      } else if (jenisPupuk === 'organic') {
        if (masaTanam === 1) {
          jatah = mainData.rdkk.mt1_organic
        } else if (masaTanam === 2) {
          jatah = mainData.rdkk.mt2_organic
        } else {
          jatah = mainData.rdkk.mt3_organic
        }
      } else if (jenisPupuk === 'npk') {
        if (masaTanam === 1) {
          jatah = mainData.rdkk.mt1_npk
        } else if (masaTanam === 2) {
          jatah = mainData.rdkk.mt2_npk
        } else {
          jatah = mainData.rdkk.mt3_npk
        }
      } else if (jenisPupuk === 'sp36') {
        if (masaTanam === 1) {
          jatah = mainData.rdkk.mt1_sp36
        } else if (masaTanam === 2) {
          jatah = mainData.rdkk.mt2_sp36
        } else {
          jatah = mainData.rdkk.mt3_sp36
        }
      } else if (jenisPupuk === 'urea') {
        if (masaTanam === 1) {
          jatah = mainData.rdkk.mt1_urea
        } else if (masaTanam === 2) {
          jatah = mainData.rdkk.mt2_urea
        } else {
          jatah = mainData.rdkk.mt3_urea
        }
      } else {
        jatah = 0
      }
    }
    return jatah
  }
  const getHargaSubsidi = (id, mainData) => {
    if (id === '') {
      return 0
    } else {
      return mainData.barangSubsidi.filter(p => {
        return p.id === id
      })[0].harga
    }
  }

  const parseData = (mainData, dataPetani, rdkk) => {
      // mainData.petani = dataPetani
      Object.assign(mainData, {
        petani: dataPetani
      })
      mainData.rdkk = rdkk
          let dataRUT = mainData.dataRUT
          let totalSaprotan = 0
          let totalGarapDanPemeliharaan = 0
          let pendapatanKotor = 0
          let totalPanen = { 
            gabahKeringPanen: 0,
            gabahKeringGiling: 0,
            beras: 0
          }
          dataRUT.forEach(data => {
            let totalPerMT = 0
            let luasLahan = getLuasLahanPerMT(data.masaTanam, mainData)
            let gabahKeringPanenPerMT = 0
            let gabahKeringGilingPerMT = 0
            let berasPerMT = 0
            let subTotalGarapDanPemeliharaan = 0
            data.kebutuhanSaprotan.forEach(pupuk => {
              let totalBiayaPerPupuk
              let jumlahBeli = (pupuk.jumlah * luasLahan)
              let hargaNonSubsidi = pupuk.harga
              let hargaSubsidi = getHargaSubsidi(pupuk.id, mainData)
              let jatahSubsidi = getJatahSubsidi(pupuk.id, data.masaTanam, mainData)
              let jumlahNonSubsidi = jumlahBeli - jatahSubsidi

              if (pupuk.id === '') {
                totalBiayaPerPupuk = jumlahBeli * hargaNonSubsidi
              } else {
                
                if (jumlahNonSubsidi < 0) {
                  totalBiayaPerPupuk = jumlahBeli * hargaSubsidi
                } else {
                  totalBiayaPerPupuk = ((jumlahBeli - jumlahNonSubsidi) * hargaSubsidi) + (hargaNonSubsidi * jumlahNonSubsidi)
                }
                
              }
              // console.log(mainData.petani.nik + ' = ' + jatahSubsidi)
              pupuk.jumlah = jumlahBeli
              Object.assign(pupuk, {
                hargaSubsidi: hargaSubsidi,
                subTotal: totalBiayaPerPupuk,
                jatahSubsidi: jatahSubsidi,
                jumlahNonSubsidi: jumlahNonSubsidi < 0 ? 0 : jumlahNonSubsidi
              })
            
              totalPerMT += totalBiayaPerPupuk
              
            })
            
            totalSaprotan += totalPerMT
            data.garapDanPemeliharaan.forEach(garap => {
              subTotalGarapDanPemeliharaan += (Math.round(luasLahan * garap.jumlah)) * garap.harga
            })
            
            totalGarapDanPemeliharaan += subTotalGarapDanPemeliharaan

            
            let pendapatanKotorPerMT = (data.jadwalUsahaTani.hasilPascaPanen.pendapatanKotor * luasLahan)
            data.jadwalUsahaTani.hasilPascaPanen.pendapatanKotor = pendapatanKotorPerMT
            pendapatanKotor += pendapatanKotorPerMT

            // hitung perkiraan panen 
            gabahKeringPanenPerMT = (data.jadwalUsahaTani.perkiraanJumlahPanen.gabahKeringPanen * luasLahan)
            gabahKeringGilingPerMT = (data.jadwalUsahaTani.perkiraanJumlahPanen.gabahKeringGiling * luasLahan)
            berasPerMT = (data.jadwalUsahaTani.perkiraanJumlahPanen.beras * luasLahan)

            data.jadwalUsahaTani.perkiraanJumlahPanen.gabahKeringPanen = gabahKeringPanenPerMT
            data.jadwalUsahaTani.perkiraanJumlahPanen.gabahKeringGiling = gabahKeringGilingPerMT
            data.jadwalUsahaTani.perkiraanJumlahPanen.beras = berasPerMT

            totalPanen.gabahKeringPanen += gabahKeringPanenPerMT
            totalPanen.gabahKeringGiling += gabahKeringGilingPerMT
            totalPanen.beras += berasPerMT
            let subTotalBiayaUsahaTani = totalPerMT + subTotalGarapDanPemeliharaan
            Object.assign(data, {
              luasLahan: luasLahan,
              subTotalSaprotan: totalPerMT,
              subTotalGarapDanPemeliharaan: subTotalGarapDanPemeliharaan,
              subTotalBiayaUsahaTani: subTotalBiayaUsahaTani,
              subPendapatanKotor: pendapatanKotorPerMT,
              subPrediksiPendapatan: pendapatanKotorPerMT - subTotalBiayaUsahaTani
            })
          })
          mainData.pendapatanKotor = pendapatanKotor
          mainData.totalBiayaUsahaTani = totalSaprotan + totalGarapDanPemeliharaan
          mainData.prediksiPendapatan = pendapatanKotor - mainData.totalBiayaUsahaTani
          Object.assign(mainData, {
            totalSaprotan: totalSaprotan,
            totalGarapDanPemeliharaan: totalGarapDanPemeliharaan,
            totalPanen: totalPanen
          })
          // delete mainData.rdkk
          // delete mainData.petani
          // console.log(mainData)
          // resolve(mainData)
          return mainData
        }