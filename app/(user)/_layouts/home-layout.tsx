/* eslint-disable @typescript-eslint/no-unused-vars */
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
import { useSearchParams } from 'next/navigation'

const HomeSection = dynamic(() => import('../_components/home-section'), { ssr: false })
const MemberSection = dynamic(() => import('../_components/member-section'), { ssr: false })
const TechnologySection = dynamic(() => import('../_components/technology-section'), { ssr: false })
const CalculatorSection = dynamic(() => import('../_components/calculator-section'), { ssr: false })
const OtherProjectSection = dynamic(() => import('../_components/other-project-section'), { ssr: false })

const HomeLayout = () => {
  const [active, setActive] = useState(0)
  const { setMedium, loading, setLoading, fetching, setFetching } = useMediumStore()
  const {
    setPremium,
    loading: premiumLoading,
    setLoading: setPremiumLoading,
    fetching: premiumFetching,
    setFetching: setPremiumFetching
  } = usePremiumStore()

  const searchParams = useSearchParams()

  const startMedium = searchParams.get('start_medium') || '2025-03-01'
  const endMedium = searchParams.get('end_medium') || '2025-03-30'

  const startPremium = searchParams.get('start_premium') || '2025-03-01'
  const endPremium = searchParams.get('end_premium') || '2025-03-30'


  const fetchMedium = () => {
    if (!loading) setFetching(true)

    Fetcher({
      url: '/medium',
      params: {
        start: startMedium,
        end: endMedium
      },
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
      url: '/premium',
      params: {
        start: '2025-01-01',
        end: '2025-01-31'
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

  useEffect(() => {
    fetchMedium()
    fetchPremium()
  }, [])

  const handleClick = (i: number) => {
    setActive(i)
  }

  return (
    <main className="h-screen overflow-hidden w-screen">
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
                        delay: 0.2
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
                    {menu.section === 'home' && <HomeSection />}
                    {menu.section === 'member' && <MemberSection />}
                    {menu.section === 'technology' && <TechnologySection />}
                    {menu.section === 'calculator' && <CalculatorSection />}
                    {menu.section === 'other-projects' && <OtherProjectSection />}
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
