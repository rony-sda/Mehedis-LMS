import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, ShieldX } from "lucide-react";
import Link from "next/link";

export default function NotAdmin() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <div className="bg-destructive/10 rounded-full p-4 w-fit mx-auto">
            <ShieldX className="size-16 text-destructive"/>
          </div>

          <CardTitle className="text-2xl mt-3">Access Restricted</CardTitle>
        </CardHeader>
        <CardContent>
          <Link href='/' className={buttonVariants({
            className: "w-full",
            variant: 'destructive'
          })}><ArrowLeft/></Link>
  </CardContent>
      </Card>
    </div>
  )
}