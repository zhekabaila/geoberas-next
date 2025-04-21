'use client'
import DataTable from '../_components/data-table'
import { Fetcher } from '@/services/fetcher'
import { useMediumStore } from '../_stores/use-medium-store'
import { toast } from 'sonner'
import { useEffect } from 'react'
import { usePremiumStore } from '../_stores/use-premium-store'

const HomeLayout = () => {
  const { medium, setMedium, loading, setLoading, fetching, setFetching } = useMediumStore()
  const {
    premium,
    setPremium,
    loading: premiumLoading,
    setLoading: setPremiumLoading,
    fetching: premiumFetching,
    setFetching: setPremiumFetching
  } = usePremiumStore()

  const fetchMedium = () => {
    if (!loading) setFetching(true)

    Fetcher({
      url: 'http://localhost:3000/api/medium',
      onSuccess({ data }) {
        setMedium(data)
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

  const fetchPremium = () => {
    if (!premiumLoading) setPremiumFetching(true)

    Fetcher({
      url: 'http://localhost:3000/api/premium',
      onSuccess({ data }) {
        setPremium(data)
      },
      onError(error) {
        toast.error(error)
      },
      onFinally() {
        if (premiumLoading) setPremiumLoading(false)
        else setPremiumFetching(false)
      }
    })
  }

  useEffect(() => {
    fetchMedium()
    fetchPremium()
  }, [])

  return (
    <div className="m-10">
      <DataTable data={medium} loading={loading} fetching={fetching} />
      <DataTable data={premium} loading={premiumLoading} fetching={premiumFetching} />
    </div>
  )
}

export default HomeLayout
