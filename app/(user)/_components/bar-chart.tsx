'use client'
import { Bar, BarChart, CartesianGrid, XAxis, Cell } from 'recharts'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'
import { format } from 'date-fns'
import { Loader } from 'lucide-react'

const chartConfig = {
  price: {
    label: 'Price',
    color: 'hsl(var(--chart-1))'
  }
} satisfies ChartConfig

const DATA_COLOR = '#c5c0b4'
const PREDICTION_COLOR = '#94a3b8'

interface BarChartProps {
  data: {
    date: string
    price: number
    type?: 'data' | 'prediksi'
  }[]
  jenis: string
  start: string
  end: string
  fetching: boolean
}

export default function BarChartComponent({ data, jenis, start, end, fetching }: BarChartProps) {
  return (
    <Card className="relative bg-secondary text-secondary-foreground">
      {fetching && (
        <div className="absolute inset-0 backdrop-blur-md w-full h-full flex justify-center items-center z-10">
          <Loader className="w-6 h-6 animate-spin" />
        </div>
      )}
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
            <Bar dataKey="price" radius={1}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.type === 'prediksi' ? PREDICTION_COLOR : DATA_COLOR} />
              ))}
            </Bar>
          </BarChart>
        </ChartContainer>
        {data.some((item) => item.type === 'prediksi') && (
          <div className="flex justify-center items-center mt-10 gap-10">
            <div className="flex flex-col items-center justify-center">
              <div className="w-8 h-3" style={{ backgroundColor: DATA_COLOR }} />
              <p className="text-sm text-muted-foreground">Data</p>
            </div>
            <div className="flex flex-col items-center justify-center">
              <div className="w-8 h-3" style={{ backgroundColor: PREDICTION_COLOR }} />
              <p className="text-sm text-muted-foreground">Prediksi</p>
            </div>
          </div>
        )}
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
