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
import PerhitunganMedium from './perhitungan-medium'
import PerhitunganPremium from './perhitungan-premium'
import Copyright from './copyright'

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

  console.log(mediumFetching, premiumFetching)

  const [prediksiPayload, setPrediksiPayload] = useState<{
    jenis: 'medium' | 'premium'
    tanggal: Date | undefined
  }>({
    jenis: 'medium',
    tanggal: new Date()
  })

  const [activeTab, setActiveTab] = useState<'medium' | 'premium'>('medium')

  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: undefined,
    to: undefined
  })

  const searchParams = useSearchParams()

  const cStart = searchParams.get('c_start') || '2025-04-01'
  const cEnd = searchParams.get('c_end') || '2025-04-17'

  const navigate = useRouter()

  const chartRef = useRef<HTMLCanvasElement>(null)
  const chartInstance = useRef<Chart | null>(null)

  const handlePrediksiDateChange = (dateRange?: DateRange) => {
    setDateRange(dateRange)
  }

  const handleFilter = (dateRange?: DateRange) => {
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

        const backgroundColor = currentData.map((item) => (item.type === 'prediksi' ? '#667b99' : '#7c8755'))
        const borderColor = currentData.map((item) => (item.type === 'prediksi' ? '#667b99' : '#7c8755'))

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
    if (targetDate <= new Date(jenisBeras === 'medium' ? '2025-04-17' : '2025-04-15')) {
      toast.error(`Tanggal prediksi harus lebih dari ${jenisBeras === 'medium' ? '17 April 2025' : '15 April 2025'}`)
      return
    }

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
    <div className="h-full md:h-screen overflow-y-scroll">
      <div className="mx-4 my-6 md:m-20 space-y-10">
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
                    inputclassName="bg-primary hover:bg-primary/80"
                  />
                  <Button variant="default" onClick={() => handleFilter(dateRange)}>
                    Filter
                  </Button>
                </div>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="default">Mulai Prediksi</Button>
                  </PopoverTrigger>
                  <PopoverContent align="end">
                    <div className="flex flex-col gap-4">
                      <div className="flex flex-col gap-2">
                        <Label htmlFor="jenis">Pilih Jenis</Label>
                        <Select
                          defaultValue={prediksiPayload.jenis}
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
                          variant="default"
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
                  <>
                    <PerhitunganMedium data={allMedium} targetDate={prediksiPayload.tanggal!} />
                  </>
                )}
              </>
            )}
            {activeTab === 'premium' && (
              <>
                <BarChartComponent chartRef={chartRef} isPrediksi={!!prediksiPremium} />
                {!!prediksiPremium && (
                  <>
                    <PerhitunganPremium data={allPremium} targetDate={prediksiPayload.tanggal!} />
                  </>
                )}
              </>
            )}
          </Tabs>
        </section>
      </div>
      <Copyright />
    </div>
  )
}

export default CalculatorSection
