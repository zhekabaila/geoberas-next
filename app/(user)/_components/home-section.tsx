import BarChartComponent from './bar-chart'
import { useMediumStore } from '../_stores/use-medium-store'
import { usePremiumStore } from '../_stores/use-premium-store'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { useSearchParams } from 'next/navigation'

const HomeSection = () => {
  const { medium } = useMediumStore()
  const { premium } = usePremiumStore()

  const searchParams = useSearchParams()

  const startMedium = searchParams.get('start_medium') || '2025-03-01'
  const endMedium = searchParams.get('end_medium') || '2025-03-30'

  const startPremium = searchParams.get('start_premium') || '2025-03-01'
  const endPremium = searchParams.get('end_premium') || '2025-03-30'

  return (
    <ScrollArea className="h-screen overflow-y-scroll ">
      <div className="flex flex-col gap-4 m-20">
        <BarChartComponent data={medium} jenis="Medium" start={startMedium} end={endMedium} />
        <BarChartComponent data={premium} jenis="Premium" start={startPremium} end={endPremium} />
      </div>
      <ScrollBar orientation="vertical" />
    </ScrollArea>
  )
}

export default HomeSection
