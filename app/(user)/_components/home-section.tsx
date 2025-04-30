'use client'

import BarChartComponent from './bar-chart'
import { useMediumStore } from '../_stores/use-medium-store'
import { usePremiumStore } from '../_stores/use-premium-store'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { useRouter, useSearchParams } from 'next/navigation'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
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

const HomeSection = ({ mediumFetching, premiumFetching }: IProps) => {
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

  // const [dateRange, setDateRange] = useState<DateRange | undefined>({
  //   from: undefined,
  //   to: undefined
  // })

  const [prediksiDateRange, setPrediksiDateRange] = useState<DateRange | undefined>({
    from: undefined,
    to: undefined
  })

  const searchParams = useSearchParams()

  // const cStart = searchParams.get('c_start') || '2025-03-01'
  // const cEnd = searchParams.get('c_end') || '2025-03-30'

  const pStart = searchParams.get('p_start') || '2025-03-01'
  const pEnd = searchParams.get('p_end') || '2025-03-30'

  const navigate = useRouter()

  // const handleDateChange = (dateRange?: DateRange) => {
  //   setDateRange(dateRange)
  // }

  const handlePrediksiDateChange = (dateRange?: DateRange) => {
    setPrediksiDateRange(dateRange)
  }

  // const handleFilter = (dateRange?: DateRange) => {
  //   const params = new URLSearchParams(searchParams.toString())

  //   params.set('c_start', dateRange?.from ? format(dateRange.from, 'yyyy-MM-dd') : '')
  //   params.set('c_end', dateRange?.to ? format(dateRange.to, 'yyyy-MM-dd') : '')

  //   navigate.replace(`?${params.toString()}`, { scroll: false })
  // }

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

  const prediksiHargaBeras = (hargaBeras: Data[], targetDate: Date, jenisBeras: 'medium' | 'premium') => {
    if (hargaBeras.length < 2) return []

    // Mendapatkan tanggal terakhir dari data historis
    const lastDataDate = new Date(hargaBeras[hargaBeras.length - 1].date)

    // Menghitung total hari yang perlu diprediksi
    const diffTime = targetDate.getTime() - lastDataDate.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays <= 0) return []

    const prediksi: (Data & { type: 'prediksi' })[] = []
    let totalPerubahan = 0

    // Menghitung total perubahan harga
    for (let i = 1; i < hargaBeras.length; i++) {
      totalPerubahan += hargaBeras[i].price - hargaBeras[i - 1].price
    }
    const rataRataPerubahanHarian = totalPerubahan / (hargaBeras.length - 1)

    // Menghitung prediksi untuk setiap hari sampai tanggal target
    for (let i = 1; i <= diffDays; i++) {
      const tanggalPrediksi = new Date(lastDataDate)
      tanggalPrediksi.setDate(tanggalPrediksi.getDate() + i)

      const hargaSebelumnya = i === 1 ? hargaBeras[hargaBeras.length - 1].price : prediksi[i - 2].price

      prediksi.push({
        date: format(tanggalPrediksi, 'yyyy-MM-dd'),
        price: Number((hargaSebelumnya + rataRataPerubahanHarian).toFixed(3)),
        type: 'prediksi'
      })
    }

    if (jenisBeras === 'medium') {
      setMediumPrediksi(prediksi)
      setActiveTab('medium')
    } else {
      setPremiumPrediksi(prediksi)
      setActiveTab('premium')
    }
  }

  return (
    <ScrollArea className="h-screen overflow-y-scroll">
      <div className="m-20 space-y-10">
        <section className="flex justify-between items-center" id="hero">
          <div className="basis-1/2">
            <h1 className="text-3xl font-bold">Prediksi Harga Beras di Indonesia</h1>
            <p className="text-lg text-gray-500 mt-1">
              Analisis prediksi harga beras di indonesia pada tahun 2025 menggunakan model matematika{' '}
            </p>
            <p className="text-base text-gray-400 mt-2">
              Dapatkan wawasan terbaru mengenai tren harga beras di Indonesia. Prediksi ini membantu Anda dalam mengambil
              keputusan yang lebih baik, baik untuk kebutuhan rumah tangga maupun bisnis. Data yang disajikan diolah
              menggunakan metode matematis terkini untuk hasil yang lebih akurat.
            </p>
            <Button className="mt-3">
              <a href="#grafik">Lihat Prediksi</a>
            </Button>
          </div>
          <div className="flex justify-end items-center basis-1/2">
            <Image src="/images/logo_beras.png" alt="logo" width={350} height={350} />
          </div>
        </section>
        <section id="prediksi">
          <h2 className="text-xl font-bold mb-5">Lihat Prediksi Harga Beras</h2>
          <Tabs value={activeTab}>
            <div className="flex items-center justify-between">
              <TabsList>
                <TabsTrigger value="medium" onClick={() => setActiveTab('medium')}>
                  Medium
                </TabsTrigger>
                <TabsTrigger value="premium" onClick={() => setActiveTab('premium')}>
                  Premium
                </TabsTrigger>
              </TabsList>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2">
                  <DateRangePicker
                    disableFutureDate
                    align="end"
                    selected={prediksiDateRange}
                    onDateChange={handlePrediksiDateChange}
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
                            prediksiHargaBeras(
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
          <div className="mt-5 bg-background rounded-md p-6">
            <h2 className="text-xl font-bold">Metodologi Perhitungan Prediksi</h2>
            <p className="text-base text-gray-400 mt-2">
              Prediksi harga beras di Indonesia menggunakan model matematika yang terdiri dari beberapa tahap:
            </p>
            <div className="mt-4 space-y-4">
              <div>
                <h3 className="text-lg font-semibold">1. Perhitungan Rata-rata Perubahan Harian</h3>
                <p className="text-gray-400 mt-1">Untuk menghitung rata-rata perubahan harga harian, digunakan rumus:</p>
                <div className="bg-secondary/50 p-4 rounded-md mt-2">
                  <p className="font-mono">Rata-rata Perubahan = Σ(Harga[i] - Harga[i-1]) / (n-1)</p>
                  <p className="text-sm text-gray-400 mt-2">
                    Dimana:
                    <br />
                    - Harga[i] adalah harga pada hari ke-i
                    <br />
                    - Harga[i-1] adalah harga pada hari sebelumnya
                    <br />- n adalah jumlah total data historis
                  </p>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold">2. Prediksi Harga untuk Hari Berikutnya</h3>
                <p className="text-gray-400 mt-1">
                  Setelah mendapatkan rata-rata perubahan harian, harga untuk hari-hari berikutnya dihitung dengan rumus:
                </p>
                <div className="bg-secondary/50 p-4 rounded-md mt-2">
                  <p className="font-mono">Harga Prediksi = Harga Sebelumnya + Rata-rata Perubahan</p>
                  <p className="text-sm text-gray-400 mt-2">
                    Dimana:
                    <br />
                    - Harga Sebelumnya adalah harga terakhir yang diketahui
                    <br />- Rata-rata Perubahan adalah nilai yang didapat dari perhitungan sebelumnya
                  </p>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold">3. Karakteristik Model</h3>
                <ul className="list-disc list-inside text-gray-400 mt-1 space-y-2">
                  <li>Model menggunakan pendekatan linear untuk memprediksi tren harga</li>
                  <li>Prediksi didasarkan pada pola perubahan historis harga beras</li>
                  <li>Hasil prediksi dibulatkan hingga 3 angka desimal untuk akurasi yang lebih baik</li>
                  <li>Model mempertimbangkan perubahan harga harian untuk menghasilkan prediksi yang lebih detail</li>
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

export default HomeSection
