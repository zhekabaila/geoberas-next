import BarChartComponent from './bar-chart'
import { useMediumStore } from '../_stores/use-medium-store'
import { usePremiumStore } from '../_stores/use-premium-store'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'

const HomeSection = () => {
  const { medium } = useMediumStore()
  const { premium } = usePremiumStore()

  return (
    <ScrollArea className="h-screen overflow-y-scroll ">
      <div className="flex flex-col gap-4 p-20">
        <BarChartComponent data={medium} jenis="Medium" start="2025-01-01" end="2025-01-30" />
        <BarChartComponent data={premium} jenis="Premium" start="2025-01-01" end="2025-01-30" />
      </div>
      <ScrollBar orientation="vertical" />
    </ScrollArea>
  )
}

export default HomeSection
