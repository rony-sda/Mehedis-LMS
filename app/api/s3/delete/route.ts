import { requireAdmin } from "@/app/data/admin/require-admin"
import { env } from "@/lib/env"
import { S3 } from "@/lib/S3Client"
import { DeleteObjectCommand } from "@aws-sdk/client-s3"
import { NextResponse } from "next/server"

export async function DELETE(request: Request) {
  await requireAdmin()
  try {
    const body = await request.json()
    const key = body.key
    if (!key) {
      return NextResponse.json({
        error: 'Missing or invalid object key'
      }, { status: 400 })
       }
      const command = new DeleteObjectCommand({
        Bucket: env.NEXT_PUBLIC_BUCKET_NAME,
        Key: key
      })

      await S3.send(command)
      return NextResponse.json({error: "File deleted  Successfully"}, {status: 200})
   
  } catch (error) {
    return NextResponse.json({error: 'Somthing went wrong'}, {status: 500})
  }
}