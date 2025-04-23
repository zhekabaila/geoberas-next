'use client'
import { Area, AreaChart, CartesianGrid, XAxis } from 'recharts'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'

const chartConfig = {
  price: {
    label: 'Price',
    color: 'hsl(var(--chart-1))'
  }
} satisfies ChartConfig

interface RicePriceChartProps {
  data: {
    date: string
    price: number
  }[]
}

export default function RicePriceChart({ data }: RicePriceChartProps) {
  return (
    <Card className="bg-background p-0">
      <CardHeader>
        <CardTitle>Grafik Harga Beras</CardTitle>
        <CardDescription>Grafik harga beras untuk 3 bulan terakhir</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <AreaChart
            accessibilityLayer
            data={data}
            margin={{
              left: 12,
              right: 12
            }}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dot" />} />
            <Area
              dataKey="price"
              type="natural"
              fill="var(--color-primary)"
              fillOpacity={0.4}
              stroke="var(--color-primary)"
              stackId="a"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
      {/* <CardFooter>
        <div className="flex w-full items-start gap-2 text-sm">
          <div className="grid gap-2">
            <div className="flex items-center gap-2 font-medium leading-none">
              Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
            </div>
            <div className="flex items-center gap-2 leading-none text-muted-foreground">January - June 2024</div>
          </div>
        </div>
      </CardFooter> */}
    </Card>
  )
}
