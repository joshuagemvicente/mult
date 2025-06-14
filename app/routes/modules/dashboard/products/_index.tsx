import { Plus, Scan } from 'lucide-react';
import { Link, Outlet, useLoaderData } from 'react-router';
import { columns } from '~/columns/products.columns';
import { DataTable } from '~/components/shared/data-table';
import { Button } from '~/components/ui/button';
import type { Route } from '../+types/_index';
import { deleteProduct, getAllProducts, incrementProductStockBySku } from '~/utils/products.server';
import { dataWithError, redirectWithSuccess } from 'remix-toast';
import type { ProductTableColumns } from '~/columns/products.columns';

export async function loader({ request }: Route.LoaderArgs) {
  const { products } = await getAllProducts();
  
  const formattedProducts: ProductTableColumns[] = products.map(product => ({
    ...product,
    createdAt: product.createdAt.toISOString(),
    updatedAt: product.updatedAt.toISOString()
  }));
  
  return {
    data: formattedProducts
  };
}

export default function Products() {
  const { data } = useLoaderData<typeof loader>();
  
  return (
    <div className="flex flex-col w-full">
      <div className="flex justify-between items-center p-5">
        <div className="flex flex-col">
          <h1 className="text-3xl font-bold">Products</h1>
          <p className="text-base text-muted-foreground">Manage your store inventory</p>
        </div>
        <div className="flex items-center gap-2">
          <Link to="barcode">
          <Button 
            variant="outline" 
            className="flex items-center gap-2"
            // onClick={() => setScannerOpen(true)}
            >
            <Scan className='h-5 w-auto' />
            <span>Scan Barcode</span>
          </Button>
            </Link>
          
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
  );
}

// Action handler for both delete and barcode scan operations
export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  const action = formData.get("action");
  
  // Handle barcode scanning increment stock
  if (action === "incrementStock") {
    const sku = formData.get("sku");
    
    if (!sku || typeof sku !== "string") {
      return dataWithError(null, "Invalid SKU provided");
    }
    
    const result = await incrementProductStockBySku(sku);
    
    if ("error" in result) {
      return dataWithError(null, `Product with SKU ${sku} not found`);
    }
    
    return redirectWithSuccess("/dashboard/products", `Added 1 item to product with SKU: ${sku}`);
  }
  
  // Handle delete product
  const id = formData.get("id");
  if (!id) {
    return dataWithError(null, "Product ID is required for deletion");
  }
  
  await deleteProduct(String(id));
  return redirectWithSuccess("/dashboard/products", "Product has been deleted.");
}
