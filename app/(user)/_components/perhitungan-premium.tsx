import { useMemo } from 'react'
import { Premium } from '../_stores/use-premium-store'
import { TableCell, TableHeader, TableRow } from '@/components/ui/table'
import { TableBody } from '@/components/ui/table'
import { TableHead } from '@/components/ui/table'
import { Table } from '@/components/ui/table'
import { Data } from '../types'

interface IProps {
  data: Premium[]
  targetDate: Date
}

const PerhitunganPremium = ({ data, targetDate }: IProps) => {
  const { perhitungan, hasilPrediksi, rataRasio, hargaTerakhir } = useMemo(() => {
    let totalRasio = 0
    let rataRasio = 0
    let count = 0
    const perhitungan: { date: string; currentPrice: number; previousPrice: number; ratio: number }[] = []
    const hasilPrediksi: Data[] = []
    for (let i = 1; i < data.length; i++) {
      const currentPrice = data[i].price
      const previousPrice = data[i - 1].price
      const ratio = currentPrice / previousPrice
      totalRasio += ratio
      count++
      perhitungan.push({
        date: data[i].date,
        currentPrice,
        previousPrice,
        ratio
      })
    }
    rataRasio = count > 0 ? totalRasio / count : 0

    const hargaTerakhir = data[data.length - 1].price
    const tanggalTerakhir = new Date(data[data.length - 1].date)
    const tanggalTarget = new Date(targetDate)

    let index = 1
    const tanggal = new Date(tanggalTerakhir)

    while (tanggal < tanggalTarget) {
      tanggal.setDate(tanggal.getDate() + 1)
      const hargaPrediksi = hargaTerakhir * Math.pow(rataRasio, index)

      hasilPrediksi.push({
        date: tanggal.toISOString().split('T')[0],
        price: parseFloat(hargaPrediksi.toFixed(3))
      })

      index++
    }

    return { perhitungan, hasilPrediksi, rataRasio, hargaTerakhir }
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
              <TableRow>
                <TableHead>Tanggal</TableHead>
                <TableHead>Harga Saat Ini = A</TableHead>
                <TableHead>Harga Sebelumnya = B</TableHead>
                <TableHead>Rasio = A/B</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {perhitungan?.map((item) => (
                <TableRow key={`perhitungan-${item.date}`}>
                  <TableCell>{item.date}</TableCell>
                  <TableCell>{item.currentPrice}</TableCell>
                  <TableCell>{item.previousPrice}</TableCell>
                  <TableCell>{item.ratio}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <div>
          <h3 className="text-base font-medium">Rata-rata Rasio</h3>
          <p className="text-xs">{rataRasio}</p>
        </div>
      </div>
      <div className="bg-primary p-4 rounded-md mt-2">
        <div className="mb-5">
          <h3 className="text-base font-medium">Hasil Prediksi</h3>
        </div>
        <div className="max-h-[350px] overflow-y-scroll">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tanggal</TableHead>
                <TableHead>
                  Harga = harga terakhir x rata-rata rasio<sup>hari ke-n</sup>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {hasilPrediksi.map((item, index) => (
                <TableRow key={`hasil-prediksi-${item.date}`}>
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

export default PerhitunganPremium
