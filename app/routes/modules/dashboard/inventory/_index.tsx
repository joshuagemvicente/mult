import { Badge } from "~/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card"

export default () => {
  return (
    <div className="w-full flex flex-col gap-5">
      <div className="flex flex-col text-left">
        <h2 className="text-black font-bold text-2xl">Inventory Management</h2>
        <span className="text-muted-foreground">Track and manage your product stock levels</span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <Card>
          <CardHeader>
            <CardTitle className="font-semibold">Total Stock Value</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              Price
            </div>
            <span className="text-muted-foreground">Current inventory value</span>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="font-semibold">Low Stock Items</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              Price
            </div>
            <span className="text-muted-foreground">Current inventory value</span>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="font-semibold">Out of Stock</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              Price
            </div>
            <span className="text-muted-foreground">Items to restock</span>
          </CardContent>
        </Card>
      </div>
      <Card >
        <CardHeader>
          <CardTitle className="text-2xl">Stock Alerts</CardTitle>
          <CardDescription>Items that require your attention</CardDescription>
        </CardHeader>
        {/* map the product stocks that are low in inventory*/}
        <CardContent>
          <Card>
            <CardContent className="flex items-center justify-between">
              <div>
                <p>Rice (5kg)</p>
                <span className="text-muted-foreground">Staples</span>
              </div>
              <div className="flex items-center flex-row gap-2">
                <Badge variant="destructive">Out of Stock</Badge>
                <span>0 units</span>
              </div>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  )

}
