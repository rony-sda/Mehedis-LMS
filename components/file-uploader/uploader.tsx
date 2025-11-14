
"use client"


import { useCallback, useEffect, useState } from 'react';
import {FileRejection, useDropzone } from 'react-dropzone';
import { Card, CardContent } from '../ui/card';
import { cn } from '@/lib/utils';
import { RenderEmptyState, RenderErrorState, RenderUploadedState, RenderUploadingState } from './render-state';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';
import { useMakeUrl } from '@/hooks/useMakeUrl';




interface UploaderState {
  id: string | null;
  file: File | null;
  progress: number;
  uploading: boolean;
  key?: string;
  isDelation: boolean;
  error: boolean;
  objectUrl?: string | undefined;
  fileType: "image" | "video"
 
}

interface iAppProps {
  value?: string,
  onChange?: (value: string) => void,
  
}

function Uploader({ value, onChange }: iAppProps) {
  
  const fileUrl = useMakeUrl(value || '')

  const [fileState, setFileState] = useState<UploaderState>({
    id: null,
    file: null,
    progress: 0,
    uploading: false,
    isDelation: false,
    error: false,
    fileType: "image",
    key: value,
    objectUrl: fileUrl
  })


 const uploadFile = useCallback(async (file: File) => {
  // Upload শুরুতে state আপডেট
  setFileState(prev => ({
    ...prev,
    uploading: true,
    error: false,
    progress: 0,
  }))

  try {
    // 🔹 Step 1: Presigned URL রিকোয়েস্ট পাঠানো
    const presignedResponse = await fetch('/api/s3/upload', {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        fileName: file.name,
        contentType: file.type,
        size: file.size,
        isImage: true,
      }),
    })

    // 🔹 Step 2: Error হলে হ্যান্ডল করো
    if (!presignedResponse.ok) {
      toast.error('Failed to get presigned URL')
      setFileState(prev => ({
        ...prev,
        uploading: false,
        error: true,
        progress: 0,
      }))
      return
    }

    // 🔹 Step 3: রেসপন্স থেকে presignedUrl আর key নেওয়া
    const { presignedUrl, key } = await presignedResponse.json()

    if (!presignedUrl || !key) {
      toast.error("Invalid upload response")
      setFileState(prev => ({
        ...prev,
        uploading: false,
        error: true,
      }))
      return
    }

    // 🔹 Step 4: ফাইলটা PUT করা S3 তে
    await new Promise<void>((resolve, reject) => {
      const xhr = new XMLHttpRequest()

      xhr.upload.onprogress = event => {
        if (event.lengthComputable) {
          const percentageCompleted = (event.loaded / event.total) * 100
          setFileState(prev => ({
            ...prev,
            uploading: true,
            error: false,
            progress: Math.round(percentageCompleted),
          }))
        }
      }

      xhr.onload = () => {
        if (xhr.status === 200 || xhr.status === 204) {
          setFileState(prev => ({
            ...prev,
            uploading: false,
            key,
            progress: 100,
          }))
          onChange?.(key)
          toast.success("File uploaded successfully 🎉")
          resolve()
        } else {
          reject(new Error('Upload failed'))
        }
      }

      xhr.onerror = () => reject(new Error("Upload failed"))

      xhr.open("PUT", presignedUrl)
      xhr.setRequestHeader('Content-Type', file.type)
      xhr.send(file)
    })

  } catch (error) {
    console.error(error)
    toast.error('Something went wrong while uploading')
    setFileState(prev => ({
      ...prev,
      uploading: false,
      error: true,
      progress: 0,
    }))
  }
}, [onChange]) 



  const onDrop = useCallback((acceptedFiles: File[]) => {

     if (acceptedFiles.length === 0) return

     const file = acceptedFiles[0]


    setFileState({
      id: uuidv4(),
      file: file,
      progress: 0,
      uploading: false,
      isDelation: false,
      error: false,
      fileType: "image",
      objectUrl: URL.createObjectURL(file)
    })

    

      uploadFile(file)
      
  }, [uploadFile])

 async function handleRemoveFile() {
   if (fileState.isDelation || !fileState.objectUrl) return
   
   try {
     setFileState((prev) => ({
          ...prev,
         isDelation: true

     }))
     
     const response = await fetch('/api/s3/delete', {
       method: "DELETE",
       headers: {"Content-Type" : "application/json"},
       body: JSON.stringify({
         key: fileState.key
       })
     })

     if (!response.ok) {
       toast.error("faild to remove file from storage")
        setFileState((prev) => ({
          ...prev,
          isDelation: true,
          error: true,
          

        }))
       return
     }

      if (fileState.objectUrl && !fileState.objectUrl.startsWith('http')) {
      URL.revokeObjectURL(fileState.objectUrl)
     }

     onChange?.("")
     
      setFileState(() => ({
        file: null,
        uploading: false,
        progress: 0,
        objectUrl: undefined,
        error: false,
        fileType: 'image',
        id: null,
        isDelation: false
      }))
     
     return toast.success('file deleted successfully')
   } catch (error) {
     toast.error('Error removing file. please try again')
      setFileState((prev) => ({
        ...prev,
        isDelation: false,
        error: true
      }))
   }
  }


  function fileRejections(fileRejection: FileRejection[]) { 
    if (fileRejection.length > 0) { 
      const tooManyFiles = fileRejection.find(rejection => rejection.errors[0].code === "too-many-files");
      const fileTooLarge = fileRejection.find(rejection => rejection.errors[0].code === "file-too-large");
      if (fileTooLarge) {
        toast.error("File is too large. Max size is 5MB");
      }
      if (tooManyFiles) {
        toast.error("You can only upload one file");
      }
    }
  }

  function renderContent() {
    if (fileState.uploading) {
      return (
       <RenderUploadingState file={fileState.file as File} progress={fileState.progress} />
     )
    }
    if (fileState.error) {
      return <RenderErrorState/> 
    }

    if (fileState.objectUrl) {
      return <RenderUploadedState handleRemoveFile={handleRemoveFile} isDelation={fileState.isDelation} previewUrl={fileState.objectUrl} />
    }

    return <RenderEmptyState isDragActive={isDragActive} />
  }
  
  useEffect(() => {
  return () => {
    if (fileState.objectUrl && !fileState.objectUrl.startsWith('http')) {
      URL.revokeObjectURL(fileState.objectUrl)
    }
  }
}, [fileState.objectUrl])


  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': [] },
    maxFiles: 1,
    multiple: false,
    maxSize: 5 * 1024 * 1024,
    onDropRejected: fileRejections,
    disabled: fileState.uploading || !!fileState.objectUrl 
    });
  
 

  return (
    <Card {...getRootProps()} className={cn("relative border-dashed border-2 rounded-md p-6 text-center cursor-pointer transition-colors duration-200 ease-in-out w-full h-64", isDragActive ?"border-primary bg-primary/10 border-solid" : "border-border hover:border-primary")}>
      <CardContent className='flex items-center justify-center h-full w-full p-4'>
         <input {...getInputProps()} />    
       {renderContent()}
     </CardContent>
    </Card>
  );
}

export default Uploader;



