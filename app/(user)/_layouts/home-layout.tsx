'use client'

import { Fetcher } from '@/services/fetcher'
import { useMediumStore } from '../_stores/use-medium-store'
import { toast } from 'sonner'
import { useEffect, useState } from 'react'
import { usePremiumStore } from '../_stores/use-premium-store'
import { cn } from '@/lib/utils'
import { motion, AnimatePresence } from 'framer-motion'
import { MENU_HOME } from '../_constants/data'
import dynamic from 'next/dynamic'
import { ArrowBigUp } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Data } from '../types'

const HomeSection = dynamic(() => import('../_components/home-section'), { ssr: false })
const MemberSection = dynamic(() => import('../_components/member-section'), { ssr: false })
const TechnologySection = dynamic(() => import('../_components/technology-section'), { ssr: false })
const CalculatorSection = dynamic(() => import('../_components/calculator-section'), { ssr: false })
const OtherProjectSection = dynamic(() => import('../_components/other-project-section'), { ssr: false })

const HomeLayout = () => {
  const [allMedium, setAllMedium] = useState<Data[]>([])
  const [allPremium, setAllPremium] = useState<Data[]>([])

  const { setMedium, loading, setLoading, fetching: mediumFetching, setFetching: setMediumFetching } = useMediumStore()
  const {
    setPremium,
    loading: premiumLoading,
    setLoading: setPremiumLoading,
    fetching: premiumFetching,
    setFetching: setPremiumFetching
  } = usePremiumStore()

  const searchParams = useSearchParams()

  const active = searchParams.get('active') ? parseInt(searchParams.get('active')!) : 0

  const cStart = searchParams.get('c_start') || '2025-04-01'
  const cEnd = searchParams.get('c_end') || '2025-04-17'

  const fetchMedium = () => {
    if (!loading) setMediumFetching(true)

    Fetcher({
      url: '/medium',
      params: {
        start: cStart,
        end: cEnd
      },
      onSuccess({ data }) {
        setMedium(data)
      },
      onError(error) {
        toast.error(error)
      },
      onFinally() {
        if (loading) setLoading(false)
        else setMediumFetching(false)
      }
    })
  }

  const fetchPremium = () => {
    if (!premiumLoading) setPremiumFetching(true)

    Fetcher({
      url: '/premium',
      params: {
        start: cStart,
        end: cEnd
      },
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

  const fetchAllPremium = () => {
    if (!premiumLoading) setPremiumFetching(true)
    Fetcher({
      url: '/premium',
      onSuccess({ data }) {
        setAllPremium(data)
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

  const fetchAllMedium = () => {
    if (!loading) setMediumFetching(true)
    Fetcher({
      url: '/medium',
      onSuccess({ data }) {
        setAllMedium(data)
      },
      onError(error) {
        toast.error(error)
      },
      onFinally() {
        if (loading) setLoading(false)
        else setMediumFetching(false)
      }
    })
  }

  useEffect(() => {
    fetchMedium()
    fetchPremium()

    fetchAllPremium()
    fetchAllMedium()

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cStart, cEnd])

  const navigate = useRouter()

  const handleClick = (i: number) => {
    const params = new URLSearchParams(searchParams.toString())

    params.set('active', i.toString())

    navigate.replace(`?${params.toString()}`, { scroll: false })
  }

  return (
    <>
      <main className="hidden md:block h-screen overflow-hidden w-screen">
        <section className="flex h-full">
          {MENU_HOME.map((menu, i) => (
            <div key={i} className={cn('flex', active === i ? 'flex-1' : 'flex-none')}>
              <motion.button
                type="button"
                onClick={() => handleClick(i)}
                className={cn(
                  'flex items-end h-full justify-center py-10 w-20 max-w-[112px] border-r-4 border-x-black',
                  active === i ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground',
                  i - 1 === active && 'border-x-4'
                )}
                whileTap={{ scale: 0.98 }}
                animate={{
                  scale: active === i ? 1.02 : 1,
                  boxShadow: active === i ? '0 10px 15px -3px rgba(0, 0, 0, 0.1)' : 'none'
                }}
                transition={{ duration: 0.2 }}>
                <motion.div
                  className="flex items-center justify-center gap-4 text-3xl font-bold"
                  style={{ writingMode: 'sideways-lr' }}
                  animate={{
                    color: active === i ? 'var(--primary-foreground)' : 'var(--secondary-foreground)'
                  }}>
                  {active === i && <ArrowBigUp className="w-8 h-8" />}
                  {menu.name}
                </motion.div>
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
                          duration: 1
                        },
                        opacity: {
                          duration: 0.5,
                          delay: 1.2
                        }
                      }
                    }}
                    exit={{
                      width: 0,
                      opacity: 0,
                      transition: {
                        width: {
                          duration: 1
                        },
                        opacity: {
                          duration: 0.0
                        }
                      }
                    }}
                    className="flex-1 bg-background overflow-hidden">
                    <motion.div
                      className="h-full w-full"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{
                        delay: 0.4,
                        duration: 0.5
                      }}>
                      {menu.section === 'beranda' && <HomeSection />}
                      {menu.section === 'anggota' && <MemberSection />}
                      {menu.section === 'teknologi' && <TechnologySection />}
                      {menu.section === 'kalkulator' && (
                        <CalculatorSection
                          mediumFetching={mediumFetching}
                          premiumFetching={premiumFetching}
                          allMedium={allMedium}
                          allPremium={allPremium}
                        />
                      )}
                      {menu.section === 'other-projects' && <OtherProjectSection />}
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </section>
      </main>
      <main className="block md:hidden">
        <div className="flex flex-col h-full min-h-screen">
          {MENU_HOME.map((menu, i) => (
            <>
              <button
                onClick={() => handleClick(i)}
                key={i}
                className="flex items-center gap-4 text-xl font-bold p-3 border-b-2 border-b-black">
                {menu.name}
              </button>
              {active === i && (
                <div className="flex-1">
                  {menu.section === 'beranda' && <HomeSection />}
                  {menu.section === 'anggota' && <MemberSection />}
                  {menu.section === 'teknologi' && <TechnologySection />}
                  {menu.section === 'kalkulator' && (
                    <CalculatorSection
                      mediumFetching={mediumFetching}
                      premiumFetching={premiumFetching}
                      allMedium={allMedium}
                      allPremium={allPremium}
                    />
                  )}
                  {menu.section === 'other-projects' && <OtherProjectSection />}
                </div>
              )}
            </>
          ))}
        </div>
      </main>
    </>
  )
}

export default HomeLayout
