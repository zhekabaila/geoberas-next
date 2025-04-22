'use client'
import DataTable from '../_components/data-table'
import { Fetcher } from '@/services/fetcher'
import { useMediumStore } from '../_stores/use-medium-store'
import { toast } from 'sonner'
import { useEffect, useState } from 'react'
// import { usePremiumStore } from '../_stores/use-premium-store'
import { Data } from '../types'

const HomeLayout = () => {
  const { medium, setMedium, loading, setLoading, fetching, setFetching } = useMediumStore()
  // const {
  //   premium,
  //   setPremium,
  //   loading: premiumLoading,
  //   setLoading: setPremiumLoading,
  //   fetching: premiumFetching,
  //   setFetching: setPremiumFetching
  // } = usePremiumStore()
  // const [rataRata, setRataRata] = useState(0)
  const [prediksi, setPrediksi] = useState<number[]>([])
  const fetchMedium = () => {
    if (!loading) setFetching(true)

    Fetcher({
      url: '/medium',
      onSuccess({ data }) {
        setMedium(data)
        const r = getPrediksi(data)
        setPrediksi(r)
      },
      onError(error) {
        toast.error(error)
      },
      onFinally() {
        if (loading) setLoading(false)
        else setFetching(false)
      }
    })
  }

  // const fetchPremium = () => {
  //   if (!premiumLoading) setPremiumFetching(true)

  //   Fetcher({
  //     url: '/premium',
  //     onSuccess({ data }) {
  //       setPremium(data)
  //     },
  //     onError(error) {
  //       toast.error(error)
  //     },
  //     onFinally() {
  //       if (premiumLoading) setPremiumLoading(false)
  //       else setPremiumFetching(false)
  //     }
  //   })
  // }

  const getPrediksi = (data: Data[]) => {
    let totalPerubahan = 0
    for (let i = 1; i < data.length; i++) {
      totalPerubahan += data[i].price - data[i - 1].price
    }
    const rataRata = totalPerubahan / data.length - 1
    const prediksi = []
    for (let i = 0; i < 12; i++) {
      const bulanSebelumnya = data[data.length - 1].price // Harga bulan terakhir
      prediksi[i] = bulanSebelumnya + rataRata * (i + 1)
    }
    return prediksi
  }

  useEffect(() => {
    fetchMedium()
    // fetchPremium()
  }, [])

  return (
    <div className="m-10">
      <DataTable data={medium} loading={loading} fetching={fetching} />
      {/* <div className="text-center text-2xl font-bold">Rata-rata perubahan harga: {rataRata}</div> */}
      {/* <DataTable data={premium} loading={premiumLoading} fetching={premiumFetching} /> */}
      {prediksi.map((p, i) => (
        <div key={i} className="text-center text-2xl font-bold">
          Prediksi harga beras hari ke-{i + 1}: {p}
        </div>
      ))}
    </div>
  )
}

export default HomeLayout
