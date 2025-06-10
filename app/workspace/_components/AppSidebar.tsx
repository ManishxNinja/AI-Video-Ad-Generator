"use client";

import React from 'react';
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
} from "@/components/ui/sidebar";
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { LayoutDashboard, Video, WalletCards } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

import { UserButton, useUser, SignedIn } from '@clerk/nextjs';

const menuOptions = [
  {
    title: 'Dashboard',
    icon: LayoutDashboard,
    path: '/workspace'
  },
  {
    title: 'Create Ad',
    icon: Video,
    path: '/workspace/create-ad'
  },
  {
    title: 'Billing',
    icon: WalletCards,
    path: '/workspace/billing'
  },
];

function AppSidebar() {
  const path = usePathname();
  const router = useRouter();
  const { user } = useUser();

  const OnClick = () => {
    router.push('/workspace/create-ad');
  };

  return (
    <Sidebar>
      <SidebarHeader className='flex items-center'>
        <Image src={'/logo.svg'} alt='logo' width={100} height={80} />
      </SidebarHeader>

      <hr />

      <SidebarContent>
        <SidebarGroup className='mt-5'>
          <Button onClick={OnClick}>+ Create New Ad Video</Button>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className='text-md'>Applications</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className='mt-2'>
              {menuOptions.map((menu, index) => (
                <SidebarMenuItem key={index} className='mt-1'>
                  <SidebarMenuButton asChild className='p-5'>
                    <Link
                      href={menu.path}
                      className={`flex p-2 rounded-md gap-1 font-semibold text-lg w-full ${path === menu.path ? 'text-primary bg-gray-200' : ''}`}
                    >
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

      {/* 👤 User Profile + Sign Out */}
      <SidebarFooter className="flex items-center justify-between p-4 border-t">
        <SignedIn>
          <div className="flex items-center gap-2">
            <UserButton afterSignOutUrl="/" />
            <div className="text-sm">
              {user?.fullName || user?.primaryEmailAddress?.emailAddress}
            </div>
          </div>
        </SignedIn>
      </SidebarFooter>
    </Sidebar>
  );
}

export default AppSidebar;
