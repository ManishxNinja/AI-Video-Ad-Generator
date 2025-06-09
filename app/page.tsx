'use client'
import { Loader } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const router = useRouter();
  useEffect(() => {
    router.push('/workspace');
  })
  return (
    <div className="flex items-center justify-center min-w-full min-h-full bottom-50">
      <Loader className="animate-spin" />
      <h2 className="font-bold text-2xl">Fetching Data....</h2>
    </div>
    
  );
}
