import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table'
import { Checkbox } from '@/components/ui/checkbox'
import { format } from 'date-fns'
import { Data as Medium } from '../types'

interface IProps {
  data: Medium[]
  loading: boolean
  fetching: boolean
}

const DataTable = ({ data }: IProps) => {
  return (
    <Table className="border border-input">
      <TableHeader>
        <TableRow>
          <TableHead className="rounded-md">
            <Checkbox />
          </TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Price</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((item, index) => (
          <TableRow key={index}>
            <TableCell>
              <Checkbox />
            </TableCell>
            <TableCell>{format(new Date(item.date), 'dd MMM yyyy')}</TableCell>
            <TableCell>{item.price}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

export default DataTable
