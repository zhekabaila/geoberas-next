'use client'
import { Medium, useMediumStore } from '../_stores/use-medium-store'
import { usePremiumStore } from '../_stores/use-premium-store'
import { useRouter, useSearchParams } from 'next/navigation'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { DateRangePicker } from '@/components/core/date-range-picker'
import { DateRange } from 'react-day-picker'
import { format } from 'date-fns'
import { useEffect, useState, useRef } from 'react'
import { Data } from '../types'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { DatePicker } from '@/components/core/date-picker'
import Chart from 'chart.js/auto'
import type { ChartConfiguration } from 'chart.js'
import BarChartComponent from './bar-chart'
import { toast } from 'sonner'
import { Table, TableHead, TableRow, TableHeader, TableCell, TableBody } from '@/components/ui/table'

interface IProps {
  mediumFetching: boolean
  premiumFetching: boolean
  allMedium: Data[]
  allPremium: Data[]
}

const CalculatorSection = ({ mediumFetching, premiumFetching, allMedium, allPremium }: IProps) => {
  const {
    medium,
    setPrediksi: setMediumPrediksi,
    prediksiMedium,
    setPrediksiNull: setMediumPrediksiNull,
    removePrediksiFromData: removeMediumPrediksiFromData
  } = useMediumStore()
  const {
    premium,
    setPrediksi: setPremiumPrediksi,
    prediksiPremium,
    setPrediksiNull: setPremiumPrediksiNull,
    removePrediksiFromData: removePremiumPrediksiFromData
  } = usePremiumStore()

  console.log(mediumFetching)
  console.log(premiumFetching)

  const [prediksiPayload, setPrediksiPayload] = useState<{
    jenis: 'medium' | 'premium'
    tanggal: Date | undefined
  }>({
    jenis: 'medium',
    tanggal: undefined
  })

  const [activeTab, setActiveTab] = useState<'medium' | 'premium'>('medium')

  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: undefined,
    to: undefined
  })

  const searchParams = useSearchParams()

  const cStart = searchParams.get('c_start') || '2025-03-01'
  const cEnd = searchParams.get('c_end') || '2025-03-30'

  const navigate = useRouter()

  const chartRef = useRef<HTMLCanvasElement>(null)
  const chartInstance = useRef<Chart | null>(null)

  const handlePrediksiDateChange = (dateRange?: DateRange) => {
    setDateRange(dateRange)
  }

  const handleFilterPrediksi = (dateRange?: DateRange) => {
    const params = new URLSearchParams(searchParams.toString())

    params.set('c_start', dateRange?.from ? format(dateRange.from, 'yyyy-MM-dd') : '')
    params.set('c_end', dateRange?.to ? format(dateRange.to, 'yyyy-MM-dd') : '')

    navigate.replace(`?${params.toString()}`, { scroll: false })
  }

  useEffect(() => {
    setDateRange({
      from: new Date(cStart),
      to: new Date(cEnd)
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (chartRef.current) {
      // Destroy chart sebelumnya jika ada
      if (chartInstance.current) {
        chartInstance.current.destroy()
      }

      const ctx = chartRef.current.getContext('2d')

      if (ctx) {
        // Pilih data berdasarkan tab aktif
        const currentData = activeTab === 'medium' ? medium : premium
        const labels = currentData.map((item) => item.date)
        const data = currentData.map((item) => item.price)

        const backgroundColor = currentData.map((item) => (item.type === 'prediksi' ? '#c5c0b440' : '#c5c0b4'))
        const borderColor = currentData.map((item) => (item.type === 'prediksi' ? '#c5c0b4' : '#c5c0b4'))

        const chartData = {
          labels: labels,
          datasets: [
            {
              label: `Harga Beras ${activeTab === 'medium' ? 'Medium' : 'Premium'}`,
              data: data,
              backgroundColor: backgroundColor,
              borderColor: borderColor,
              borderWidth: 1
            }
          ]
        }

        const config: ChartConfiguration = {
          type: 'bar',
          data: chartData,
          options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              y: {
                beginAtZero: false
              }
            },
            plugins: {
              legend: {
                display: false
              }
            }
          }
        }

        chartInstance.current = new Chart(ctx, config)
      }
    }

    // Cleanup function
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy()
      }
    }
  }, [medium, premium, activeTab, prediksiMedium, prediksiPremium]) // Tambahkan premium ke dependencies

  function prediksiHargaBerasGeometric(targetDate: Date, jenisBeras: 'medium' | 'premium') {
    const actualData = jenisBeras === 'medium' ? allMedium : allPremium

    if (!actualData || actualData.length < 2) {
      toast.error('Data historis minimal harus 2 entri.')
      return
    }

    let totalRasio = 0
    let count = 0

    for (let i = 1; i < actualData.length; i++) {
      const hargaHariIni = actualData[i].price
      const hargaSebelumnya = actualData[i - 1].price
      const rasio = hargaHariIni / hargaSebelumnya
      totalRasio += rasio
      count++
    }

    const rataRasio = totalRasio / count

    // Ambil harga terakhir dan tanggal terakhir dari data historis
    const hargaTerakhir = actualData[actualData.length - 1].price
    const tanggalTerakhir = new Date(actualData[actualData.length - 1].date)
    const tanggalAkhir = new Date(targetDate)

    const hasilPrediksi: Medium[] = []

    let index = 1
    const tanggal = new Date(tanggalTerakhir)

    while (tanggal < tanggalAkhir) {
      tanggal.setDate(tanggal.getDate() + 1)
      const hargaPrediksi = hargaTerakhir * Math.pow(rataRasio, index)

      hasilPrediksi.push({
        date: tanggal.toISOString().split('T')[0],
        price: parseFloat(hargaPrediksi.toFixed(3)),
        type: 'prediksi'
      })

      index++
    }

    if (jenisBeras === 'medium') {
      if (!!prediksiMedium) {
        setMediumPrediksiNull()
        removeMediumPrediksiFromData()
      }
      setMediumPrediksi(hasilPrediksi)
      setActiveTab('medium')
    } else {
      if (!!prediksiPremium) {
        setPremiumPrediksiNull()
        removePremiumPrediksiFromData()
      }
      setPremiumPrediksi(hasilPrediksi)
      setActiveTab('premium')
    }
  }

  return (
    <div className="h-[77vh] md:h-screen overflow-y-scroll">
      <div className="mx-4 mt-4 mb-0 md:m-20 space-y-10">
        <section id="prediksi">
          <h2 className="text-lg md:text-xl font-bold mb-5">Lihat Prediksi Harga Beras</h2>
          <Tabs value={activeTab}>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-3">
              <TabsList className="w-fit md:w-auto">
                <TabsTrigger value="medium" onClick={() => setActiveTab('medium')}>
                  Medium
                </TabsTrigger>
                <TabsTrigger value="premium" onClick={() => setActiveTab('premium')}>
                  Premium
                </TabsTrigger>
              </TabsList>
              <div className="flex flex-col md:flex-row md:items-center gap-2">
                <div className="flex items-center gap-2">
                  <DateRangePicker
                    disableFutureDate
                    align="end"
                    selected={dateRange}
                    onDateChange={handlePrediksiDateChange}
                    className="w-full md:w-auto"
                  />
                  <Button variant="outline" onClick={() => handleFilterPrediksi(dateRange)}>
                    Filter
                  </Button>
                </div>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline">Mulai Prediksi</Button>
                  </PopoverTrigger>
                  <PopoverContent align="end">
                    <div className="flex flex-col gap-4">
                      <div className="flex flex-col gap-2">
                        <Label htmlFor="jenis">Pilih Jenis</Label>
                        <Select
                          onValueChange={(value) =>
                            setPrediksiPayload({ ...prediksiPayload, jenis: value as 'medium' | 'premium' })
                          }>
                          <SelectTrigger id="jenis">
                            <SelectValue placeholder="Pilih Jenis" />
                          </SelectTrigger>
                          <SelectContent id="jenis">
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="premium">Premium</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex flex-col gap-2">
                        <Label htmlFor="tanggal">Tanggal</Label>
                        <DatePicker
                          type="popover"
                          value={prediksiPayload.tanggal}
                          onChange={(date) => setPrediksiPayload({ ...prediksiPayload, tanggal: date })}
                        />
                      </div>
                      <div className="flex flex-col gap-2">
                        <Button
                          variant="outline"
                          onClick={() => prediksiHargaBerasGeometric(prediksiPayload.tanggal!, prediksiPayload.jenis)}>
                          Prediksi
                        </Button>
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            {activeTab === 'medium' && (
              <>
                <BarChartComponent chartRef={chartRef} isPrediksi={!!prediksiMedium} />
                {!!prediksiMedium && (
                  <div className="bg-primary p-4 rounded-md mt-2">
                    <div className="mb-5">
                      <h3 className="text-base font-medium">Prediksi Harga Beras Medium</h3>
                      <p className="text-xs">
                        {format(new Date(cStart), 'dd MMMM yyyy')} - {format(new Date(cEnd), 'dd MMMM yyyy')}
                      </p>
                    </div>
                    <div className="max-h-[350px] overflow-y-scroll">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Tanggal</TableHead>
                            <TableHead>Harga</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {prediksiMedium?.map((item) => (
                            <TableRow key={item.date}>
                              <TableCell>{item.date}</TableCell>
                              <TableCell>{item.price}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                )}
              </>
            )}
            {activeTab === 'premium' && (
              <>
                <BarChartComponent chartRef={chartRef} isPrediksi={!!prediksiPremium} />
                {!!prediksiPremium && (
                  <div className="bg-primary p-4 rounded-md mt-2">
                    <div className="mb-5">
                      <h3 className="text-base font-medium">Prediksi Harga Beras Premium</h3>
                      <p className="text-xs">
                        {format(new Date(cStart), 'dd MMMM yyyy')} - {format(new Date(cEnd), 'dd MMMM yyyy')}
                      </p>
                    </div>
                    <div className="max-h-[350px] overflow-y-scroll">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Tanggal</TableHead>
                            <TableHead>Harga</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {prediksiPremium?.map((item) => (
                            <TableRow key={item.date}>
                              <TableCell>{item.date}</TableCell>
                              <TableCell>{item.price}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                )}
              </>
            )}
          </Tabs>
          <div className="mt-5 bg-background rounded-md p-0 md:p-6">
            <h2 className="text-xl font-bold">Metodologi Perhitungan Prediksi</h2>
            <p className="text-base  mt-2">
              Prediksi harga beras di Indonesia pada aplikasi ini menggunakan metode{' '}
              <span className="font-semibold">barisan geometri</span> dengan langkah-langkah sebagai berikut:
            </p>
            <div className="mt-4 space-y-4">
              <div>
                <h3 className="text-lg font-semibold">1. Pengambilan Data Harga Harian</h3>
                <p className=" mt-1">Ambil data harga beras harian dari data historis yang tersedia.</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold">2. Hitung Rasio Pertumbuhan Harian</h3>
                <p className=" mt-1">Hitung rasio pertumbuhan harian dengan rumus:</p>
                <div className="bg-secondary/50 p-4 rounded-md mt-2">
                  <p className="font-mono">Rasio-i = Harga hari ke-i / Harga hari ke-(i-1)</p>
                </div>
                <p className="text-sm  mt-2">Lakukan perhitungan ini untuk setiap hari dalam data (kecuali hari pertama).</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold">3. Hitung Rata-rata Rasio Pertumbuhan</h3>
                <p className=" mt-1">
                  Setelah mendapatkan seluruh rasio harian, hitung rata-rata dari semua rasio tersebut dengan rumus:
                </p>
                <div className="bg-secondary/50 p-4 rounded-md mt-2">
                  <p className="font-mono">r = (r₁ + r₂ + ... + rₙ) / n</p>
                </div>
                <p className="text-sm  mt-2">
                  Di mana r₁, r₂, ..., rₙ adalah rasio pertumbuhan harian dan n adalah jumlah rasio yang dihitung.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold">4. Prediksi Harga Hari Berikutnya</h3>
                <p className=" mt-1">Prediksi harga untuk hari ke-mendatang dihitung dengan rumus barisan geometri:</p>
                <div className="bg-secondary/50 p-4 rounded-md mt-2">
                  <p className="font-mono">Harga Prediksi ke-k = Harga Terakhir × r^k</p>
                </div>
                <p className="text-sm  mt-2">
                  Di mana:
                  <br />
                  - Harga Terakhir adalah harga pada hari terakhir data historis
                  <br />
                  - r adalah rata-rata rasio pertumbuhan harian
                  <br />- k adalah jumlah hari setelah data terakhir yang ingin diprediksi
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold">5. Karakteristik Model</h3>
                <ul className="list-disc list-inside  mt-1 space-y-2">
                  <li>Model ini mengasumsikan pertumbuhan harga mengikuti pola geometri (rasio tetap setiap hari).</li>
                  <li>Prediksi sangat bergantung pada pola pertumbuhan historis harga beras.</li>
                  <li>Hasil prediksi dibulatkan hingga 3 angka desimal untuk akurasi yang lebih baik.</li>
                  <li>Model cocok untuk tren harga yang cenderung naik/turun secara proporsional.</li>
                </ul>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

export default CalculatorSection
