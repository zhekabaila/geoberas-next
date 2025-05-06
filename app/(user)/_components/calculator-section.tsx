'use client'
import BarChartComponent from './bar-chart'
import { useMediumStore } from '../_stores/use-medium-store'
import { usePremiumStore } from '../_stores/use-premium-store'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { useRouter, useSearchParams } from 'next/navigation'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { DateRangePicker } from '@/components/core/date-range-picker'
import { DateRange } from 'react-day-picker'
import { format } from 'date-fns'
import { useEffect, useState } from 'react'
import { Data } from '../types'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { DatePicker } from '@/components/core/date-picker'

interface IProps {
  mediumFetching: boolean
  premiumFetching: boolean
}

const CalculatorSection = ({ mediumFetching, premiumFetching }: IProps) => {
  const { medium, setPrediksi: setMediumPrediksi } = useMediumStore()
  const { premium, setPrediksi: setPremiumPrediksi } = usePremiumStore()

  const [prediksiPayload, setPrediksiPayload] = useState<{
    jenis: 'medium' | 'premium'
    tanggal: Date | undefined
  }>({
    jenis: 'medium',
    tanggal: undefined
  })

  const [activeTab, setActiveTab] = useState<'medium' | 'premium'>('medium')

  const [prediksiDateRange, setPrediksiDateRange] = useState<DateRange | undefined>({
    from: undefined,
    to: undefined
  })

  const searchParams = useSearchParams()

  const pStart = searchParams.get('p_start') || '2025-03-01'
  const pEnd = searchParams.get('p_end') || '2025-03-30'

  const navigate = useRouter()

  const handlePrediksiDateChange = (dateRange?: DateRange) => {
    setPrediksiDateRange(dateRange)
  }

  const handleFilterPrediksi = (dateRange?: DateRange) => {
    const params = new URLSearchParams(searchParams.toString())

    params.set('p_start', dateRange?.from ? format(dateRange.from, 'yyyy-MM-dd') : '')
    params.set('p_end', dateRange?.to ? format(dateRange.to, 'yyyy-MM-dd') : '')

    navigate.replace(`?${params.toString()}`, { scroll: false })
  }

  useEffect(() => {
    setPrediksiDateRange({
      from: new Date(pStart),
      to: new Date(pEnd)
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function prediksiHargaBerasGeometric(hargaBeras: Data[], targetDate: Date, jenisBeras: 'medium' | 'premium') {
    if (hargaBeras.length < 2) {
      throw new Error('Data historis minimal harus 2 entri.')
    }

    // Hitung rata-rata rasio pertumbuhan harian
    let totalRasio = 0
    let count = 0

    for (let i = 1; i < hargaBeras.length; i++) {
      const hargaHariIni = hargaBeras[i].price
      const hargaSebelumnya = hargaBeras[i - 1].price
      const rasio = hargaHariIni / hargaSebelumnya
      totalRasio += rasio
      count++
    }

    const rataRasio = totalRasio / count

    // Ambil harga terakhir dan tanggal terakhir dari data historis
    const hargaTerakhir = hargaBeras[hargaBeras.length - 1].price
    const tanggalTerakhir = new Date(hargaBeras[hargaBeras.length - 1].date)
    const tanggalAkhir = new Date(targetDate)

    const hasilPrediksi = []

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
      setMediumPrediksi(hasilPrediksi)
      setActiveTab('medium')
    } else {
      setPremiumPrediksi(hasilPrediksi)
      setActiveTab('premium')
    }
  }

  return (
    <ScrollArea className="h-[77vh] md:h-screen  overflow-y-scroll">
      <div className="mx-4 mt-4 mb-0 md:m-20 space-y-10">
        <section id="prediksi">
          <h2 className="text-lg md:text-xl font-bold mb-5">Lihat Prediksi Harga Beras</h2>
          <Tabs value={activeTab}>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
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
                    selected={prediksiDateRange}
                    onDateChange={handlePrediksiDateChange}
                    className="w-full md:w-auto"
                  />
                  <Button variant="outline" onClick={() => handleFilterPrediksi(prediksiDateRange)}>
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
                          onClick={() =>
                            prediksiHargaBerasGeometric(
                              prediksiPayload.jenis === 'medium' ? medium : premium,
                              prediksiPayload.tanggal!,
                              prediksiPayload.jenis
                            )
                          }>
                          Prediksi
                        </Button>
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            <TabsContent value="medium">
              <BarChartComponent data={medium} jenis="Medium" start={pStart} end={pEnd} fetching={mediumFetching} />
            </TabsContent>
            <TabsContent value="premium">
              <BarChartComponent data={premium} jenis="Premium" start={pStart} end={pEnd} fetching={premiumFetching} />
            </TabsContent>
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
        <ScrollBar orientation="vertical" />
      </div>
    </ScrollArea>
  )
}

export default CalculatorSection
