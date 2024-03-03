"use client";
import { useOrganization, useUser } from "@clerk/nextjs"
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { useState } from "react";
import { FileBrowser } from "@/components/file-browser";


export default function page() {
  const organization = useOrganization();
  const user = useUser();
  const [query, setQuery] = useState('');

  let orgId: string | undefined = undefined;
  if(organization.isLoaded && user.isLoaded) {
    orgId = organization.organization?.id ?? user.user?.id
  }

  const files = useQuery(api.files.getFiles, orgId ? { orgId, query }: 'skip')?.filter((file) => file.inTrash);
  
    return (
        //@ts-ignore
        <FileBrowser files={files} description={'Items in Trash will be permanently deleted after 30 days.'} title={"Trash"} showBtn={false} />
    )
}