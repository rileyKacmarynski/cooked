import React from 'react'
import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'
import { AppSidebar } from '@/components/app-sidebar'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { Separator } from '@/components/ui/separator'
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar'
import UserProvider from '@/lib/user-provider'
import { FullPageLoader } from '@/components/ui/loading-indicator'

export const Route = createFileRoute('/_app')({
  component: RouteComponent,
  beforeLoad: async ({ context }) => {
    const user = await context.authService.getUser()
    if (!user) {
      throw redirect({
        to: '/login',
      })
    }

    return {
      user,
    }
  },
})

function RouteComponent() {
  const navigate = Route.useNavigate()
  const { user, authService } = Route.useRouteContext()

  async function signOut() {
    await authService.logout()
    navigate({ to: '/login' })
  }

  return (
    <UserProvider user={user}>
      <SidebarProvider>
        <AppSidebar signOut={signOut} />
        <SidebarInset className="h-dvh overflow-hidden p-0">
          <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            {/* <Breadcrumb> */}
            {/*   <BreadcrumbList> */}
            {/*     <BreadcrumbItem className="hidden md:block"> */}
            {/*       <BreadcrumbLink href="/">Listing Tools</BreadcrumbLink> */}
            {/*     </BreadcrumbItem> */}
            {/*     <BreadcrumbSeparator className="hidden md:block" /> */}
            {/*     <BreadcrumbItem></BreadcrumbItem> */}
            {/*   </BreadcrumbList> */}
            {/* </Breadcrumb> */}
          </header>
          <div className="p-4 h-full">
            {/* TODO: figure out some way to pass in a skeleton for each route */}
            <React.Suspense fallback={<FullPageLoader />}>
              <Outlet />
            </React.Suspense>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </UserProvider>
  )
}
