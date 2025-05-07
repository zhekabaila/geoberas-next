'use client'

interface BarChartProps {
  chartRef: React.RefObject<HTMLCanvasElement>
  isPrediksi: boolean
}

export default function BarChartComponent({ chartRef, isPrediksi }: BarChartProps) {
  return (
    <div className="w-full h-[800px] bg-secondary rounded-md p-6">
      <div className="flex items-center justify-center gap-4">
        <div className="flex items-center gap-2">
          <div className="bg-[#7c8755] border border-[#7c8755] w-8 h-3"></div>
          <p className="text-sm">Data</p>
        </div>
        {isPrediksi && (
          <div className="flex items-center gap-2">
            <div className="bg-[#667b99] border border-[#667b99] w-8 h-3"></div>
            <p className="text-sm">Prediksi</p>
          </div>
        )}
      </div>
      <canvas ref={chartRef} />
    </div>
  )
}
