'use client'

// import { Fetcher } from '@/services/fetcher'
// import { useMediumStore } from '../_stores/use-medium-store'
// import { toast } from 'sonner'
// import { useEffect, useState } from 'react'
// import { usePremiumStore } from '../_stores/use-premium-store'
// import { Data } from '../types'
// import { usePremiumStore } from '../_stores/use-premium-store'
import { cn } from '@/lib/utils'
import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'

const HomeLayout = () => {
  // const { medium, setMedium, loading, setLoading, fetching, setFetching } = useMediumStore()
  // const {
  //   premium,
  //   setPremium,
  //   loading: premiumLoading,
  //   setLoading: setPremiumLoading,
  //   fetching: premiumFetching,
  //   setFetching: setPremiumFetching
  // } = usePremiumStore()
  // const [rataRata, setRataRata] = useState(0)
  // const [prediksi, setPrediksi] = useState<number[]>([])

  // const fetchMedium = () => {
  //   if (!loading) setFetching(true)

  //   Fetcher({
  //     url: '/medium',
  //     onSuccess({ data }) {
  //       setMedium(data)
  //       const r = getPrediksi(data)
  //       setPrediksi(r)
  //     },
  //     onError(error) {
  //       toast.error(error)
  //     },
  //     onFinally() {
  //       if (loading) setLoading(false)
  //       else setFetching(false)
  //     }
  //   })
  // }

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

  // const getPrediksi = (data: Data[]) => {
  //   let totalPerubahan = 0
  //   for (let i = 1; i < data.length; i++) {
  //     totalPerubahan += data[i].price - data[i - 1].price
  //   }
  //   const rataRata = totalPerubahan / data.length - 1
  //   const prediksi = []
  //   for (let i = 0; i < 12; i++) {
  //     const bulanSebelumnya = data[data.length - 1].price // Harga bulan terakhir
  //     prediksi[i] = bulanSebelumnya + rataRata * (i + 1)
  //   }
  //   return prediksi
  // }

  // useEffect(() => {
  //   fetchMedium()
  //   fetchPremium()
  // }, [])

  const [active, setActive] = useState(0)

  const handleClick = (i: number) => {
    setActive(i)
  }

  return (
    <main className="h-screen w-screen">
      <section className="flex h-full">
        {[...Array(3)].map((_, i) => (
          <div key={i} className={cn('flex', active === i ? 'flex-1' : 'flex-none')}>
            <motion.button
              type="button"
              onClick={() => handleClick(i)}
              className={cn(
                'flex items-end h-full justify-center py-10 w-28 max-w-[112px] border-r-4 border-x-black',
                active === i ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground',
                i - 1 === active && 'border-x-4'
              )}
              whileTap={{ scale: 0.98 }}
              animate={{
                scale: active === i ? 1.02 : 1,
                boxShadow: active === i ? '0 10px 15px -3px rgba(0, 0, 0, 0.1)' : 'none'
              }}
              transition={{ duration: 0.2 }}>
              <motion.p
                className="text-3xl font-bold"
                style={{ writingMode: 'sideways-lr' }}
                animate={{
                  color: active === i ? 'var(--primary-foreground)' : 'var(--secondary-foreground)'
                }}>
                Lorem Ipsum
              </motion.p>
            </motion.button>
            <AnimatePresence mode="wait">
              {active === i && (
                <motion.div
                  initial={{ width: 0, opacity: 0 }}
                  animate={{
                    width: 'auto',
                    opacity: 1,
                    transition: {
                      width: {
                        duration: 0.7
                      },
                      opacity: {
                        duration: 0.5,
                        delay: 0.2
                      }
                    }
                  }}
                  exit={{
                    width: 0,
                    opacity: 0,
                    transition: {
                      width: {
                        duration: 0.7
                      },
                      opacity: {
                        duration: 0.0
                      }
                    }
                  }}
                  className="flex-1 bg-background overflow-hidden">
                  <motion.div
                    className="p-20 h-full w-full"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{
                      delay: 0.4,
                      duration: 0.5,
                      ease: [0.4, 0, 0.2, 1]
                    }}>
                    <motion.p
                      className="text-3xl font-bold"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        delay: 0.6,
                        duration: 0.5,
                        ease: [0.4, 0, 0.2, 1]
                      }}>
                      Lorem Ipsum
                    </motion.p>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </section>
    </main>
  )
}

export default HomeLayout
