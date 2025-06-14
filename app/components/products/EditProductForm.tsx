import { useForm, getInputProps, getFormProps } from "@conform-to/react"
import { parseWithZod } from "@conform-to/zod"
import { DialogContent, DialogHeader, DialogTitle } from "../ui/dialog"
import { EditProductSchema } from "~/dtos/products/editProduct.dto"
import { Form } from "react-router";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Input } from "../ui/input";

interface EditProductProps {
  id: string;
  name: string;
  sku: string;
  description: string | null;
  brand: string | null;
  price: number;
  stock: number;
  imageUrl: string | null;
}

interface EditProductFormProps {
  product: EditProductProps;
}

export function EditProductForm({ product }: EditProductFormProps) {
  const [form, fields] = useForm({
    id: "edit-product-form",
    defaultValue: {
      name: product.name,
      sku: product.sku,
      description: product.description || "",
      brand: product.brand || "",
      price: String(product.price),
      stock: String(product.stock),
      imageUrl: product.imageUrl || "",
    },
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: EditProductSchema })
    },
    shouldValidate: "onInput",
    shouldRevalidate: "onBlur",
  })
  
  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Edit Product</DialogTitle>
      </DialogHeader>

    <Form method="post" {...getFormProps(form)}>
      <input type="hidden" name="id" value={product.id} />
      
      <div className="flex flex-col gap-6 max-w-2xl">
        <div className="space-y-1">
          <Label htmlFor="name">Product Name</Label>
          <Input {...getInputProps(fields.name, { type: "text" })} />
          {fields.name.errors && (
            <p className="text-sm text-red-500">{fields.name.errors}</p>
          )}
        </div>
        
        <div className="space-y-1">
          <Label htmlFor="sku">SKU</Label>
          <Input {...getInputProps(fields.sku, { type: "text" })} />
          {fields.sku.errors && (
            <p className="text-sm text-red-500">{fields.sku.errors}</p>
          )}
        </div>
        
        <div className="space-y-1">
          <Label htmlFor="description">Description</Label>
          <Input {...getInputProps(fields.description, { type: "text" })} />
        </div>
        
        <div className="space-y-1">
          <Label htmlFor="brand">Brand</Label>
          <Input {...getInputProps(fields.brand, { type: "text" })} />
        </div>
        
        <div className="space-y-1">
          <Label htmlFor="price">Price</Label>
          <Input {...getInputProps(fields.price, { type: "number", step: "0.01" })} />
          {fields.price.errors && (
            <p className="text-sm text-red-500">{fields.price.errors}</p>
          )}
        </div>
        
        <div className="space-y-1">
          <Label htmlFor="stock">Stock</Label>
          <Input {...getInputProps(fields.stock, { type: "number" })} />
          {fields.stock.errors && (
            <p className="text-sm text-red-500">{fields.stock.errors}</p>
          )}
        </div>
        
        <div className="space-y-1">
          <Label htmlFor="imageUrl">Image URL</Label>
          <Input {...getInputProps(fields.imageUrl, { type: "text" })} />
        </div>
        
        <div className="flex justify-end gap-2 pt-4">
          <Button type="submit" form={form.id}>Save Changes</Button>
        </div>
      </div>
    </Form>
    </DialogContent>
  )
}
