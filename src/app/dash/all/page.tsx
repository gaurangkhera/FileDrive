"use client";
import { useOrganization, useUser } from "@clerk/nextjs"
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { useState } from "react";
import { FileBrowser } from "@/components/file-browser";

const page = () => {
  const organization = useOrganization();
  const user = useUser();
  const [query, setQuery] = useState('');

  let orgId: string | undefined = undefined;
  if(organization.isLoaded && user.isLoaded) {
    orgId = organization.organization?.id ?? user.user?.id
  }

  const files = useQuery(api.files.getFiles, orgId ? { orgId, query }: 'skip')?.filter((file) => !file.inTrash);
  return (
    //@ts-ignore
        <FileBrowser files={files} title={"Your files"} showBtn={true} />
  )
}

export default page;