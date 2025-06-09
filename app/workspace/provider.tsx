"use client"

import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { UserDetailsContext } from '@/context/UserDetailsContext';
import { api } from '@/convex/_generated/api';
import { useUser } from '@clerk/nextjs';
import { useMutation } from 'convex/react';
import React, { ReactNode, useEffect, useState } from 'react';
import AppSidebar from './_components/AppSidebar';
import { Id } from "@/convex/_generated/dataModel"



type WorkSpaceProviderProps = {
  children: ReactNode;
};

interface UserDetail {
  _id: Id<"users">;
  name: string;
  email: string;
  picture?: string;
  credits: number
}

function WorkSpaceProvider({ children }: WorkSpaceProviderProps) {
  const newUserMutation = useMutation(api.user.CreateNewUser);
  const[userDetail,setUserDetail] = useState<UserDetail | null>(null);
  const {user} = useUser();

  useEffect(() => {
    if(user) {
      CreateNewUser();
    }
  },[user]);

  const CreateNewUser = async () => {

    try {
      if(!user) return;
      const result = await newUserMutation({
        name: user?.fullName!,
        email: user?.primaryEmailAddress?.emailAddress!,
        picture: user?.imageUrl!,
      });
      console.log(result);
      setUserDetail(result);
    } catch(error) {
      console.log("Error Creating user:",error);
    }
    
  }
  return <UserDetailsContext.Provider value={{userDetail,setUserDetail}}>
    <SidebarProvider>
      <div className=''>
        <AppSidebar />
      </div>
      <div className='w-full'>
        <SidebarTrigger />
        {children}
      </div>
    </SidebarProvider>
  </UserDetailsContext.Provider>
}

export default WorkSpaceProvider;
