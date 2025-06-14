
import { Button } from "../ui/button";
import { Form } from "react-router";
import { Label } from "../ui/label";
import { DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { useForm, getInputProps, getFormProps } from "@conform-to/react";
import { Input } from "../ui/input";
import { parseWithZod } from "@conform-to/zod";
import { CreateProductSchema } from "~/dtos/products/createProduct.dto";

export function CreateProductForm() {
  const [form, fields] = useForm({
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: CreateProductSchema })
    },
    shouldValidate: "onInput",
    shouldRevalidate: "onBlur",
  })
  return (
    <DialogContent
      className="lg:min-w-3xl md:min-w-2xl min-w-lg p-0 space-y-3 pb-10"
    >
      <DialogHeader className="flex flex-row items-center bg-(--app-primary) p-5 rounded-t-md outline-none mb-0">
        <div className="flex items-center text-white">
          <DialogTitle>New Product</DialogTitle>
        </div>
      </DialogHeader>
      <Form method="post" {...getFormProps(form)}>
        <div className="flex flex-col w-full px-2">
          <div className="space-y-1">
            <Label htmlFor="name">Product Name</Label>
            <Input {...getInputProps(fields.name, { type: "text" })} />
          </div>
          <div className="space-y-1">
            <Label htmlFor="sku">SKU</Label>
            <Input {...getInputProps(fields.sku, { type: "text" })} />
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
            <Input {...getInputProps(fields.price, { type: "number" })} />
          </div>
          <div className="space-y-1">
            <Label htmlFor="stock">Stock</Label>
            <Input {...getInputProps(fields.stock, { type: "number" })} />
          </div>
          <Button type="submit" form={form.id}>Save</Button>
        </div>
      </Form>
    </DialogContent>
  )
}
