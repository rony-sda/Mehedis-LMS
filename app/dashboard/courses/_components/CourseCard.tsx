import { getAdminCourseType } from "@/app/data/admin/get-admin-courses";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useMakeUrl } from "@/hooks/useMakeUrl";
import { ArrowRight, Eye, MoreVerticalIcon, PencilIcon, School, TimerIcon, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface iAppProps {
  data: getAdminCourseType,
}

function CourseCard({data}: iAppProps) {
  const imageUrl = useMakeUrl(data.fileKey)
  
  return (
    <Card className="group relative py-0 gap-0">
      <div className="absolute top-0 right-0 z-10">
        <DropdownMenu>
          <DropdownMenuTrigger asChild className="bg-transparent text-white hover:text-black">
            <Button variant="secondary" size="icon">
              <MoreVerticalIcon className="size-4"/>
 </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem asChild>
              <Link href={`courses/${data.id}/edit`}>
                <PencilIcon className="size-4 mr-2"/> Edit Course
            </Link>
            </DropdownMenuItem>

            <DropdownMenuItem asChild>
              <Link href={`courses/${data.slug}`}>
                <Eye className="size-4 mr-2"/> Preview
            </Link>
            </DropdownMenuItem>

            <DropdownMenuSeparator />
            
            <DropdownMenuItem asChild>
              <Link href={`courses/${data.id}/delete`}>
                <Trash2 className="size-4 mr-2 text-destructive"/> Delete Course
            </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <Image src={imageUrl} width={600} height={400} alt="image" className="w-full rounded-t-lg aspect-video h-full object-cover" />
      
      <CardContent className="p-4">
        <Link className="font-medium text-lg line-clamp-2 hover:underline group-hover:text-primary transition-colors" href={`courses/${data.id}`}>
        {data.title}
        </Link>

        <div className="mt-4 flex items-center gap-x-5">
          <div className="flex items-center gap-x-2">
            <TimerIcon className="size-6 p-1 rounded-md text-primary bg-primary/10" />
            <p className="text-sm text-muted-foreground">{data.duration}h</p>
          </div>
          <div className="flex items-center gap-x-2">
            <School className="size-6 p-1 rounded-md text-primary bg-primary/10" />
            <p className="text-sm text-muted-foreground">{data.level}</p>
          </div>
        </div>
        <Link className={buttonVariants({
          className: 'w-full mt-4'
        })} href={`courses/${data.id}/edit`}>Edit Course <ArrowRight className="size-4"/></Link>
      </CardContent>
    </Card>
  );
}

export default CourseCard;