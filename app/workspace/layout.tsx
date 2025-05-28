import React, { ReactNode } from 'react'
import WorkSpaceProvider from './provider'

function WorkSpaceLayout({children}: {children: ReactNode}) {
  return (
    <div>
      <WorkSpaceProvider>{children}</WorkSpaceProvider>
      
    </div>
  )
}

export default WorkSpaceLayout
