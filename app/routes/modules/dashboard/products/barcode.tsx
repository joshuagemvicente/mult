import { useState } from "react";
import { useNavigate } from "react-router";
import { Dialog } from "~/components/ui/dialog";
import { BarcodeScanner } from "~/components/products/BarcodeScanner";
import { redirectWithSuccess, dataWithError } from "remix-toast";
import type { Route } from "./+types/barcode";
import { incrementProductStockBySku } from "~/utils/products.server";

export default function BarcodePage() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(true);
  
  const handleClose = () => {
    setIsOpen(false);
    setTimeout(() => navigate(-1), 100);
  };
  
  return (
    <Dialog 
      open={isOpen} 
      onOpenChange={(open) => {
        if (!open) handleClose();
      }}
    >
      <BarcodeScanner
        isOpen={isOpen} 
        onClose={handleClose}
        onScanSuccess={() => {}}
      />
    </Dialog>
  );
}

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  const action = formData.get("action");
  
  if (action === "incrementStock") {
    const sku = formData.get("sku");
    
    if (!sku || typeof sku !== "string") {
      return dataWithError(null, "Invalid SKU provided");
    }
    
    const result = await incrementProductStockBySku(sku);
    
    if ("error" in result) {
      // Return the error to be handled by the component
      return dataWithError(null, `Product with SKU ${sku} not found`);
    }
    
    return redirectWithSuccess("/dashboard/products", `Added 1 item to product with SKU: ${sku}`);
  }
  
  return dataWithError(null, "Invalid action");
}
