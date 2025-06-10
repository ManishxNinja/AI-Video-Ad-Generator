"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { UserDetailsContext } from "@/context/UserDetailsContext";
import { useContext } from "react";
import { toast } from "sonner";



const creditsOptions = [
  { credits: 80, price: 5 },
  { credits: 200, price: 10 },
  { credits: 450, price: 20 },
  { credits: 1500, price: 50 },
];

export default function BillingPage() {
  const context = useContext(UserDetailsContext);
  if(!context) {
    throw new Error("User doesn't exist");
  }
  const {userDetail,setUserDetail} = context;
  const userCredits = userDetail?.credits; 

  const OnClick = () => {
    toast(<div className="flex font-bold text-lg">
      Currently In Development Process(Mail me at manishkaushik2243@gmail.com for adding Credits).
    </div>)
  }

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div className="space-y-1">
        <h2 className="text-3xl font-bold tracking-tight">Credits</h2>
        <p className="text-muted-foreground text-sm">
          10 Credits = 1 Video. When your credit balance reaches $0, your video generation will stop working.
        </p>
      </div>

      {/* Total Credits Left */}
      <Card className="max-w-md">
        <CardHeader>
          <CardTitle>Total Credits Left</CardTitle>
          <CardDescription>Check your current balance below.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-4xl font-bold">{userCredits} Credits</div>
        </CardContent>
      </Card>

      {/* Buy More Credits */}
      <div>
        <h3 className="text-2xl font-semibold mb-4">Buy More Credits</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
          {creditsOptions.map((option) => (
            <Card key={option.credits}>
              <CardContent className="py-6 flex flex-col items-center justify-between space-y-4">
                <div className="text-xl font-semibold">{option.credits} Credits</div>
                <div className="text-muted-foreground">{option.price} $</div>
                <Button className="w-full" onClick={OnClick}>Buy Now</Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
