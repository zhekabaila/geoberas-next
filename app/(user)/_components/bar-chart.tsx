'use client'
import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'
import { format } from 'date-fns'

const chartConfig = {
  price: {
    label: 'Price',
    color: 'hsl(var(--chart-1))'
  }
} satisfies ChartConfig

interface BarChartProps {
  data: {
    date: string
    price: number
  }[]
  jenis: string
  start: string
  end: string
}

export default function BarChartComponent({ data, jenis, start, end }: BarChartProps) {
  return (
    <Card className="bg-secondary text-secondary-foreground">
      <CardHeader>
        <CardTitle>Grafik Harga Beras {jenis}</CardTitle>
        <CardDescription>
          {format(new Date(start), 'dd MMMM yyyy')} - {format(new Date(end), 'dd MMMM yyyy')}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={data}>
            <CartesianGrid vertical={true} />
            <XAxis
              dataKey="date"
              tickLine={true}
              tickMargin={10}
              axisLine={true}
              tickFormatter={(value) => value.slice(8, 10)}
            />
            <ChartTooltip cursor={true} content={<ChartTooltipContent />} />
            <Bar dataKey="price" fill="#c5c0b4" radius={1} />
          </BarChart>
        </ChartContainer>
      </CardContent>
      {/* <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">Showing total visitors for the last 6 months</div>
      </CardFooter> */}
    </Card>
  )
}
