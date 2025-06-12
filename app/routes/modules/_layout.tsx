import { auth } from "~/lib/auth";
import type { Route } from "../+types/home";
import { data, Outlet, redirect } from "react-router";
import { prisma } from "~/lib/prisma";
import { SidebarProvider } from "~/components/ui/sidebar"
import { AppSidebar } from "~/components/dashboard/AppSidebar";
import { DashboardHeader } from "~/components/dashboard/AppHeader";


export async function loader({ request }: Route.LoaderArgs) {
  const session = await auth.api.getSession({
    headers: request.headers,
  })

  if (!session) {
    throw redirect("/login")
  }

  const user = await prisma.user.findUnique({
    where: {
      id: session.user.id
    }
  })

  if (!user) {
    throw redirect("/login")
  }


  return data({ session })
}


export default function DashboardLayout() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="flex-1 flex flex-col min-h-screen">
        <DashboardHeader />
        <div className="flex-1 p-6">
          <Outlet />
        </div>
      </main>
    </SidebarProvider>
  )

}
