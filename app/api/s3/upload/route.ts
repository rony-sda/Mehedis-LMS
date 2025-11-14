import { env } from "@/lib/env"
import { UploadFileSchema } from "@/lib/schemas"
import { PutObjectCommand } from "@aws-sdk/client-s3"
import { NextResponse } from "next/server"
import { v4 as uuidv4 } from 'uuid';
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"
import { S3 } from "@/lib/S3Client";
import { requireAdmin } from "@/app/data/admin/require-admin";

export async function POST(request: Request) {
  await requireAdmin()
  try {
    const body = await request.json()
    const validation = UploadFileSchema.safeParse(body)
    if (!validation.success) {
      return NextResponse.json({error: validation.error}, {status: 400})
    }

    const { fileName, contentType, size } = validation.data

    const uniqueKey = `${uuidv4()}-${fileName}`
    
    // Here you would typically generate a presigned URL using AWS SDK
    // For demonstration, we'll return a mock URL
    const command = new PutObjectCommand({
      Bucket: env.NEXT_PUBLIC_BUCKET_NAME,
      Key: uniqueKey,
      ContentType: contentType,
      ContentLength: size,
    })

    const presignedUrl = await getSignedUrl(S3, command, { expiresIn: 360 }) // URL valid for 6 minutes

  
    return NextResponse.json({ presignedUrl, key: uniqueKey })
  } catch {
    return NextResponse.json({error: "Internal Server Error"}, {status: 500})
  }
}