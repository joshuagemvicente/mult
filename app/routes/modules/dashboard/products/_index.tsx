import { Plus } from 'lucide-react';
import { Link, Outlet, useLoaderData } from 'react-router';
import { columns } from '~/columns/products.columns';
import { DataTable } from '~/components/shared/data-table';
import { Button } from '~/components/ui/button';
import type { Route } from '../+types/_index';
import { getAllProducts } from '~/utils/products.server';


export async function loader({ request }: Route.LoaderArgs) {
  const { products } = await getAllProducts()
  return {
    data: products
  }
}


export default function Products() {
  const { data } = useLoaderData<typeof loader>()
  return (
    <div className="flex flex-col w-full">
      <div className=" flex justify-between items-center p-5">
        <div className="flex flex-col">
          <h1 className="text-3xl font-bold">Products</h1>
          <p className="text-base text-muted-foreground">Manage your store inventory</p>
        </div>
        <div>
          <Link to="/dashboard/products/add">

            <Button variant="default" className="flex items-center gap-2">
              <Plus className='h-5 w-auto' />
              <span>Add Product</span>
            </Button>
          </Link>
        </div>
      </div>
      <div className='w-full'>
        <DataTable columns={columns} data={data} />
        <section>
          <Outlet />
        </section>
      </div>
    </div>
  )

}
