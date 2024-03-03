"use client";
import { Button } from "@/components/ui/button";
import { useUser } from "@clerk/nextjs";
import { useMutation } from "convex/react";
import { mimeTypes } from "../../convex/schema";
import { api } from "../../convex/_generated/api";
import { useOrganization } from "@clerk/nextjs";
import { Dialog, DialogTrigger, DialogTitle, DialogHeader, DialogContent, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { z } from 'zod'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from 'sonner'

const formSchema = z.object({
  title: z.string().min(2).max(200),
  file: z.instanceof(FileList)
})

export default function UploadButton() {
  const generateUploadUrl = useMutation(api.files.generateUploadUrl);
  const organization = useOrganization()
  const user = useUser();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      file: undefined,
    },
  })

  const fileRef = form.register("file")

  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values)
    if(!orgId) return;
    const postUrl = await generateUploadUrl();
    const fileExtension = values.file[0].name.split('.').pop()?.toLowerCase();
    const result = await fetch(postUrl, {
      method: "POST",
      headers: { "Content-Type": values.file[0].type },
      body: values.file[0],
    });
    const { storageId } = await result.json();

    try{
      await createFile({
        name: values.title,
        orgId,
        fileId: storageId,
        isFavorite: false,
        inTrash: false,        
        //@ts-ignore
        type: fileExtension,
      })
  
      form.reset();
      setIsDialogOpen(false)
      toast.success('File uploaded successfully.')
    } catch(e){
      toast.error('Failed to upload file.')
    }
  }

  let orgId: string | undefined = undefined;

  if(organization.isLoaded && user.isLoaded) {
    orgId = organization.organization?.id ?? user.user?.id
  }

  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const createFile = useMutation(api.files.createFile);
  return (
      <Dialog open={isDialogOpen} onOpenChange={(isOpen) => {
        setIsDialogOpen(isOpen);
        form.reset();
      }}>
  <DialogTrigger asChild>
    <Button size='lg'>Upload</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle className="mb-4">Upload a file</DialogTitle>
      <DialogDescription>
      <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>File name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="file"
          render={({ field: { onChange }, ...field}) => (
            <FormItem>
              <FormLabel>File</FormLabel>
              <FormControl>
                <Input type='file' {...fileRef} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="gap-1.5" disabled={form.formState.isSubmitting}>{form.formState.isSubmitting ? (
          <>
          <Loader2 className="w-4 h-4 animate-spin" />
          <span>Uploading</span>
          </>
        ) : (
          <span>Upload</span> )}</Button>
      </form>
    </Form>
      </DialogDescription>
    </DialogHeader>
  </DialogContent>
</Dialog>
  );
}
