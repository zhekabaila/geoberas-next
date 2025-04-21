import { NextRequest } from 'next/server'
import { medium } from '@/json/data.json'

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl
  const startDate = searchParams.get('start') || ''
  const endDate = searchParams.get('end') || ''

  const filteredData = medium.filter((item) => {
    const itemDate = new Date(item.date)
    return itemDate >= new Date(startDate) && itemDate <= new Date(endDate)
  })

  const data = !startDate && !endDate ? medium : filteredData

  return Response.json({ data })
}
