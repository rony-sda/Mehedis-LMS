

export function useMakeUrl(urlKey: string): string {
  const bucket = process.env.NEXT_PUBLIC_BUCKET_NAME;
  return `https://${bucket}.t3.storage.dev/${urlKey}`
}
