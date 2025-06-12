import { Outlet } from "react-router"
export default function AuthLayout() {
  return (
    <div className="min-h-screen flex">
      <div className="flex-1 flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-md">
          <Outlet />
        </div>
      </div>

      <div className="flex-1 relative hidden md:block">
        <img src="/placeholder.svg?height=800&width=600" alt="Sari-sari store" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white p-8">
            <h1 className="text-4xl font-bold mb-4">Sari-Sari Store</h1>
            <p className="text-xl opacity-90">Your neighborhood convenience store</p>
          </div>
        </div>
      </div>
    </div>
  )

}
