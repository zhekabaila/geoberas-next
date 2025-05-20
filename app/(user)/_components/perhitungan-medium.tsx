import { useEffect, useState } from 'react'
import { Medium } from '../_stores/use-medium-store'
import { TableCell, TableHeader, TableRow } from '@/components/ui/table'
import { TableBody } from '@/components/ui/table'
import { TableHead } from '@/components/ui/table'
import { Table } from '@/components/ui/table'
import { Data } from '../types'

interface IProps {
  data: Medium[]
  targetDate: Date
}

interface IPerhitungan {
  date: string
  currentPrice: number
  previousPrice: number
  ratio: number | string
  totalRasio: number | string
}

const PerhitunganMedium = ({ data, targetDate }: IProps) => {
  const [perhitungan, setPerhitungan] = useState<IPerhitungan[]>([])
  const [hasilPrediksi, setHasilPrediksi] = useState<Data[]>([])
  const [rataRasio, setRataRasio] = useState<number>(0)
  const [hargaTerakhir, setHargaTerakhir] = useState<number>(0)
  const [panjangData, setPanjangData] = useState<number>(0)
  const [totalRasio, setTotalRasio] = useState<number>(0)

  useEffect(() => {
    // Perhitungan rasio
    let totalRasio = 0
    let count = 0
    const perhitunganArr: IPerhitungan[] = []

    for (let i = 1; i < data.length; i++) {
      const currentPrice = data[i].price
      const previousPrice = data[i - 1].price
      const ratio = currentPrice / previousPrice
      totalRasio += ratio
      count++
      perhitunganArr.push({
        date: data[i].date,
        currentPrice,
        previousPrice,
        ratio: ratio,
        totalRasio: totalRasio
      })
    }

    const rataRasio = count > 0 ? totalRasio / count : 0
    setPerhitungan(perhitunganArr)
    setRataRasio(rataRasio)
    setPanjangData(count)
    setTotalRasio(totalRasio)

    // Prediksi harga
    if (data.length > 0) {
      const hargaTerakhir = data[data.length - 1].price
      setHargaTerakhir(hargaTerakhir)
      const tanggalTerakhir = new Date(data[data.length - 1].date)
      const tanggalTarget = new Date(targetDate)

      let index = 1
      const tanggal = new Date(tanggalTerakhir)
      const hasilPrediksiArr: Data[] = []

      while (tanggal < tanggalTarget) {
        tanggal.setDate(tanggal.getDate() + 1)
        const hargaPrediksi = hargaTerakhir * Math.pow(rataRasio, index)
        hasilPrediksiArr.push({
          date: tanggal.toISOString().split('T')[0],
          price: parseFloat(hargaPrediksi.toFixed(3))
        })
        index++
      }

      setHasilPrediksi(hasilPrediksiArr)
    } else {
      setHargaTerakhir(0)
      setHasilPrediksi([])
    }
  }, [data, targetDate])

  return (
    <>
      <div className="bg-primary p-4 rounded-md mt-2">
        <div className="mb-5">
          <h3 className="text-base font-medium">Proses Perhitungan</h3>
        </div>
        <div className="max-h-[350px] overflow-y-scroll">
          <Table>
            <TableHeader>
              <TableRow className="border-b-black">
                <TableHead className="text-sm font-semibold text-black">Tanggal</TableHead>
                <TableHead className="text-sm font-semibold text-black">Harga Saat Ini = A</TableHead>
                <TableHead className="text-sm font-semibold text-black">Harga Sebelumnya = B</TableHead>
                <TableHead className="text-sm font-semibold text-black">Rasio = A/B</TableHead>
                <TableHead className="text-sm font-semibold text-black">Total Rasio</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {perhitungan?.map((item) => (
                <TableRow key={`perhitungan-${item.date}`} className="border-b-black/10">
                  <TableCell>{item.date}</TableCell>
                  <TableCell>{item.currentPrice}</TableCell>
                  <TableCell>{item.previousPrice}</TableCell>
                  <TableCell>{item.ratio}</TableCell>
                  <TableCell>{item.totalRasio}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <div>
          <h3 className="text-base font-medium">Rata-rata Rasio</h3>
          <p className="text-xs">
            {totalRasio} / {panjangData} = {rataRasio}
          </p>
        </div>
      </div>
      <div className="bg-primary p-4 rounded-md mt-2">
        <div className="mb-5">
          <h3 className="text-base font-medium">Hasil Prediksi</h3>
        </div>
        <div className="max-h-[350px] overflow-y-scroll">
          <Table>
            <TableHeader>
              <TableRow className="border-b-black">
                <TableHead className="text-sm font-semibold text-black">Tanggal</TableHead>
                <TableHead className="text-sm font-semibold text-black">
                  Harga = harga terakhir x rata-rata rasio<sup>hari ke-n</sup>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {hasilPrediksi?.map((item, index) => (
                <TableRow key={`hasil-prediksi-${item.date}`} className="border-b-black/10">
                  <TableCell>{item.date}</TableCell>
                  <TableCell>
                    {hargaTerakhir} x {rataRasio}
                    <sup>{index + 1}</sup> = {item.price}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </>
  )
}

export default PerhitunganMedium
