import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "../ui/button";
import { DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Form, useActionData } from "react-router";
import { CheckCircle, Camera, RefreshCw, AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import Webcam from "react-webcam";
import jsQR from "jsqr";

interface BarcodeScannerProps {
  isOpen: boolean;
  onClose: () => void;
  onScanSuccess?: (sku: string) => void;
}

export function BarcodeScanner({ isOpen, onClose, onScanSuccess }: BarcodeScannerProps) {
  const [error, setError] = useState<string | null>(null);
  const [scannedSku, setScannedSku] = useState<string | null>(null);
  const [scanSuccess, setScanSuccess] = useState(false);
  const [isScanning, setIsScanning] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const actionData = useActionData<{ error?: string }>();
  
  const webcamRef = useRef<Webcam>(null);
  const animationFrameRef = useRef<number>(0);
  const lastProcessTimeRef = useRef<number>(0);
  const processingRef = useRef<boolean>(false);
  
  // Check for errors from action data
  useEffect(() => {
    if (actionData?.error && scanSuccess) {
      setError(actionData.error);
      setScanSuccess(false);
    }
  }, [actionData, scanSuccess]);
  
  // Process a captured frame to detect QR codes with error handling
  const processFrame = useCallback((imageSrc: string) => {
    // Don't process if already processing a frame
    if (processingRef.current) return;
    
    processingRef.current = true;
    
    try {
      const image = new Image();
      
      image.onload = () => {
        try {
          // Create canvas to process the image
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");
          if (!ctx) {
            processingRef.current = false;
            return;
          }
          
          // Set canvas dimensions to match image
          canvas.width = image.width;
          canvas.height = image.height;
          
          // Draw image to canvas
          ctx.drawImage(image, 0, 0);
          
          try {
            // Get image data for QR processing
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            
            // Process with jsQR
            const code = jsQR(imageData.data, imageData.width, imageData.height);
            
            if (code) {
              // QR code found!
              console.log("Found QR code:", code.data);
              setScannedSku(code.data);
              setScanSuccess(true);
              setIsScanning(false);
              
              if (onScanSuccess) {
                onScanSuccess(code.data);
              }
            }
          } catch (err) {
            console.error("Error processing image data:", err);
          }
          
          processingRef.current = false;
        } catch (err) {
          console.error("Canvas error:", err);
          processingRef.current = false;
        }
      };
      
      image.onerror = () => {
        console.error("Failed to load image");
        processingRef.current = false;
      };
      
      image.src = imageSrc;
    } catch (err) {
      console.error("Process frame error:", err);
      processingRef.current = false;
    }
  }, [onScanSuccess]);
  
  // Scanning loop with throttling
  const scanLoop = useCallback(() => {
    if (!isScanning || !webcamRef.current || scanSuccess) return;
    
    const now = Date.now();
    // Throttle to process only every 200ms (5 frames per second)
    if (now - lastProcessTimeRef.current > 200) {
      lastProcessTimeRef.current = now;
      
      try {
        const imageSrc = webcamRef.current.getScreenshot();
        
        if (imageSrc) {
          processFrame(imageSrc);
        }
      } catch (err) {
        console.error("Screenshot error:", err);
      }
    }
    
    // Continue scanning if no success yet
    if (!scanSuccess && isScanning) {
      animationFrameRef.current = requestAnimationFrame(scanLoop);
    }
  }, [isScanning, scanSuccess, processFrame]);
  
  // Start/stop scanning based on component state
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    
    if (isOpen && isScanning && !scanSuccess) {
      // Short delay to ensure webcam is initialized
      timeoutId = setTimeout(() => {
        if (webcamRef.current) {
          animationFrameRef.current = requestAnimationFrame(scanLoop);
        }
      }, 1000);
    }
    
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isOpen, isScanning, scanSuccess, scanLoop]);
  
  // Handle webcam errors
  const handleWebcamError = (err: string | DOMException) => {
    console.error("Webcam error:", err);
    setError(getErrorMessage(err));
    setIsScanning(false);
  };
  
  // Get user-friendly error message
  const getErrorMessage = (error: any): string => {
    const errorMsg = error?.toString() || "Unknown error";
    
    if (errorMsg.includes("NotAllowedError")) {
      return "Camera access denied. Please allow camera access and try again.";
    } else if (errorMsg.includes("NotFoundError")) {
      return "No camera found. Please ensure your device has a camera.";
    } else if (errorMsg.includes("NotReadableError")) {
      return "Camera is in use by another application.";
    } else {
      return `Scanner error: ${errorMsg}`;
    }
  };
  
  // Handle retry
  const handleRetry = () => {
    setScannedSku(null);
    setScanSuccess(false);
    setError(null);
    setIsScanning(true);
    processingRef.current = false;
    lastProcessTimeRef.current = 0;
    setIsSubmitting(false);
  };
  
  // Handle close
  const handleClose = () => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    setIsScanning(false);
    onClose();
  };
  
  // Handle form submission
  const handleSubmit = () => {
    setIsSubmitting(true);
  };
  
  return (
    <DialogContent className="sm:max-w-md">
      <DialogHeader>
        <DialogTitle>Scan Product Barcode</DialogTitle>
      </DialogHeader>
      
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription className="flex flex-col gap-2">
            <p>{error}</p>
            <Button onClick={handleRetry} variant="outline" className="mt-2">
              <RefreshCw className="h-4 w-4 mr-2" />
              Try Again
            </Button>
          </AlertDescription>
        </Alert>
      )}
      
      {scanSuccess && scannedSku && !error ? (
        <div className="space-y-4">
          <Alert>
            <CheckCircle className="h-4 w-4 text-green-500" />
            <AlertTitle>Barcode Scanned Successfully</AlertTitle>
            <AlertDescription>Product SKU: {scannedSku}</AlertDescription>
          </Alert>
          
          <Form method="post" action="/dashboard/products" onSubmit={handleSubmit}>
            <input type="hidden" name="action" value="incrementStock" />
            <input type="hidden" name="sku" value={scannedSku} />
            <div className="flex gap-2">
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Processing..." : "Add 1 to Stock"}
              </Button>
              <Button type="button" variant="outline" onClick={handleRetry} disabled={isSubmitting}>
                Scan Again
              </Button>
            </div>
          </Form>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="w-full h-[300px] bg-slate-100 rounded overflow-hidden relative">
            {isScanning ? (
              <Webcam
                ref={webcamRef}
                audio={false}
                screenshotFormat="image/jpeg"
                videoConstraints={{
                  facingMode: "environment",
                  width: 640,
                  height: 480
                }}
                onUserMediaError={handleWebcamError}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover'
                }}
              />
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/10 z-10">
                <Camera className="h-8 w-8 mb-2" />
                <p className="text-sm">Camera not active</p>
              </div>
            )}
            {isScanning && (
              <div className="absolute inset-0 border-2 border-dashed border-gray-400 pointer-events-none m-8"></div>
            )}
          </div>
          
          <div className="text-sm text-center text-muted-foreground">
            Position the barcode in the center of the frame
          </div>
          
          <div className="flex justify-center">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
          </div>
        </div>
      )}
    </DialogContent>
  );
}




