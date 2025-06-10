import { SignIn } from '@clerk/nextjs'

export default function Page() {
  return <div className='min-w-full min-h-[100vh] bg-slate-500 flex items-center justify-center'>
    <div >
      <SignIn />
    </div>
      
    </div>
}