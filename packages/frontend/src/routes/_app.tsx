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
import { Zero } from '@rocicorp/zero'
import { authService } from '@/lib/aws/cognito-auth-service'
import { zeroSchema } from '@cooked/db'
import { useZero, ZeroProvider } from '@rocicorp/zero/react'
import type { ZeroSchema } from '@cooked/db'
import config from '@/config'

export const Route = createFileRoute('/_app')({
  component: RouteComponent,
  beforeLoad: async ({ context }) => {
    const user = await context.authService.getUser()
    if (!user) {
      throw redirect({
        to: '/login',
      })
    }

    const zeroClient = new Zero({
      userID: user.id,
      auth: async () => {
        // TODO: No idea if this will work, what token do we need?
        const session = await authService.getSession()
        console.log('user', { user, session })
        return session?.accessToken
      },
      server: config.zero.server,
      schema: zeroSchema,
      kvStore: 'mem',
    })

    return {
      user,
      zeroClient,
      // TODO: not sure how I feel about this, but don't want to import
      // my schema into every file at this point, so this works for now
      useZero: () => useZero<ZeroSchema>(),
    }
  },
})

function RouteComponent() {
  const navigate = Route.useNavigate()
  const { user, authService, zeroClient } = Route.useRouteContext()

  async function signOut() {
    await authService.logout()
    navigate({ to: '/login' })
  }

  return (
    <UserProvider user={user}>
      <ZeroProvider zero={zeroClient}>
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
              {/* <React.Suspense fallback={<FullPageLoader />}> */}
              <Outlet />
              {/* </React.Suspense> */}
            </div>
          </SidebarInset>
        </SidebarProvider>
      </ZeroProvider>
    </UserProvider>
  )
}
