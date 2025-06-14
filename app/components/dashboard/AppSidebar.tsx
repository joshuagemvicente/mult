"use client"

import { Home, Package, Users, BarChart3, Settings, Store, ShoppingCart, ChevronDown } from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
} from "~/components/ui/sidebar"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "~/components/ui/collapsible"

// Simple menu items
const simpleItems = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: Home,
  },
  {
    title: "Orders",
    url: "/dashboard/orders",
    icon: ShoppingCart,
  },
  {
    title: "Customers",
    url: "/dashboard/customers",
    icon: Users,
  },
]

// Collapsible menu items with submenus
const collapsibleItems = [
  {
    title: "Products",
    icon: Package,
    items: [
      {
        title: "All Products",
        url: "/dashboard/products",
      },
      {
        title: "Inventory",
        url: "/dashboard/inventory",
      },
      {
        title: "Categories",
        url: "/dashboard/products/categories",
      },
      {
        title: "Suppliers",
        url: "/dashboard/products/suppliers",
      },
    ],
  },
  {
    title: "Reports",
    icon: BarChart3,
    items: [
      {
        title: "Sales Reports",
        url: "/dashboard/reports/sales",
      },
      {
        title: "Inventory Reports",
        url: "/dashboard/reports/inventory",
      },
      {
        title: "Customer Reports",
        url: "/dashboard/reports/customers",
      },
      {
        title: "Financial Reports",
        url: "/dashboard/reports/financial",
      },
    ],
  },
  {
    title: "Settings",
    icon: Settings,
    items: [
      {
        title: "Store Settings",
        url: "/dashboard/settings/store",
      },
      {
        title: "User Management",
        url: "/dashboard/settings/users",
      },
      {
        title: "System Settings",
        url: "/dashboard/settings/system",
      },
      {
        title: "Security",
        url: "/dashboard/settings/security",
      },
    ],
  },
]

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarHeader className="border-b px-6 py-4">
        <div className="flex items-center gap-2">
          <Store className="h-6 w-6" />
          <span className="font-semibold text-lg">Sari-Sari Store</span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        {/* Simple menu items */}
        <SidebarGroup>
          <SidebarGroupLabel>Main</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {simpleItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Collapsible menu items */}
        <SidebarGroup>
          <SidebarGroupLabel>Management</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {collapsibleItems.map((item) => (
                <Collapsible key={item.title} defaultOpen className="group/collapsible">
                  <SidebarMenuItem>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton>
                        <item.icon />
                        <span>{item.title}</span>
                        <ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
                      </SidebarMenuButton>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <SidebarMenuSub>
                        {item.items.map((subItem) => (
                          <SidebarMenuSubItem key={subItem.title}>
                            <SidebarMenuSubButton asChild>
                              <a href={subItem.url}>
                                <span>{subItem.title}</span>
                              </a>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        ))}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  </SidebarMenuItem>
                </Collapsible>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}

