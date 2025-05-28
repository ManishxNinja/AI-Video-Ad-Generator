import React from 'react'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { LayoutDashboard, Settings2Icon, Video, Videotape, WalletCards } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const menuOptions = [
  {
    title:'Dashboard',
    icon:LayoutDashboard,
    path:'/workspace'

  },
  {
    title:'Create Ad',
    icon:Video,
    path:'/workspace/create-ad'

  },
  {
    title:'My Videos',
    icon:Videotape,
    path:'/workspace/my-videos'

  },
  {
    title:'Billing',
    icon:WalletCards,
    path:'/workspace/billing'

  },
  {
    title:'Settings',
    icon:Settings2Icon,
    path:'/workspace/settings'

  },
]

function AppSidebar() {
  const path = usePathname();
  return (
    <Sidebar>
      <SidebarHeader className='flex items-center'>
        <Image src={'/logo.svg'} alt='logo' width={100} height={80}/>
      </SidebarHeader>
      <hr/>
      <SidebarContent>
        <SidebarGroup className='mt-5'>
          <Button>+ Create New Ad Video</Button>
        </SidebarGroup>
        <SidebarGroup >
          <SidebarGroupLabel className='text-md'>Applications</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className='mt-2'>
              {menuOptions.map((menu,index) => (
                <SidebarMenuItem key={index} className='mt-1 '>
                    <SidebarMenuButton asChild className='p-5'>
                      <Link href={menu.path} className={`flex p-2 rounded-md gap-1 font-semibold text-lg w-full ${path == menu.path && 'text-primary bg-gray-200'}`}>
                        <menu.icon />
                        {menu.title}
                      </Link>
                    </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  )
}

export default AppSidebar
