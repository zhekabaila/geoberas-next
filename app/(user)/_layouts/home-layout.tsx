import { Button } from '@/components/ui/button'
import DataTable from '../_components/data-table'

const HomeLayout = () => {
  return (
    <div className="m-10">
      <DataTable />
      <Button link="/about" target="_blank" variant="destructive" size="lg" className="mt-2">
        Click me
      </Button>
    </div>
  )
}

export default HomeLayout
