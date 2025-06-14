import { SidebarTrigger } from "~/components/ui/sidebar"
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar"
import { Separator } from "~/components/ui/separator"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuShortcut, DropdownMenuTrigger } from "../ui/dropdown-menu"
import { authClient } from "~/lib/auth.client"

export function DashboardHeader() {
  const userName = "Juan Dela Cruz"
  const userInitials = userName
    .split(" ")
    .map((name) => name[0])
    .join("")
    .toUpperCase()

  return (
    <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
      <SidebarTrigger className="-ml-1" />
      <Separator orientation="vertical" className="mr-2 h-4" />

      <div className="flex-1"></div>
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium">{userName}</span>
        <Separator orientation="vertical" className="h-4" />
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Avatar className="h-8 w-8">
              <AvatarImage src="" alt={userName} />
              <AvatarFallback>{userInitials}</AvatarFallback>
            </Avatar>
            <DropdownMenuContent >
              <DropdownMenuItem>
                Profile
                <DropdownMenuShortcut>Ctrl + P</DropdownMenuShortcut>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => authClient.signOut()}> Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenuTrigger>
        </DropdownMenu>
      </div>
    </header >
  )
}

