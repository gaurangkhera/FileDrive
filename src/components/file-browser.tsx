"use client";

import UploadButton from "@/components/upload-button"
import { FileCard } from "@/components/file-card";
import { CloudRain } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { SearchBar } from "@/components/search-bar";
import { useState } from "react";
import { Doc } from "../../convex/_generated/dataModel";

export function FileBrowser ({ files, title, showBtn, description }: { files: Doc<'files'>[], title: string, showBtn: boolean, description?: string }) {
    const [query, setQuery] = useState('');
    return (
        <div className="flex-grow">
            <div className="flex justify-between items-center">
          <div>
          <h1 className={`text-4xl font-bold ${description ? 'mb-2' : 'mb-8'}`}>
            { title }
          </h1>
          {description && <p className="text-md text-muted-foreground mb-8">{description}</p>}
          </div>


  
          <SearchBar query={query} setQuery={setQuery} />
  
          { showBtn ? <UploadButton /> : null }
        </div>
  
        {files === undefined ? (
          <div className="grid grid-cols-4 gap-4">
            <Skeleton className="col-span-1 h-64" />
            <Skeleton className="col-span-1 h-64" />
            <Skeleton className="col-span-1 h-64" />
            <Skeleton className="col-span-1 h-64" />
          </div>
        ) : files.length === 0 ? (
          <div className="flex flex-col gap-4 w-full items-center mt-20">
            <div className="bg-primary/10 rounded-full">
              <CloudRain className="w-24 h-24 text-primary p-4" />
            </div>
            <div className="text-md font-medium">No files found.</div>
          </div>
        ) : (
          <div className="grid grid-cols-4 gap-4">
            {files.map((file) => <FileCard file={file} />)}
          </div>
        )}
        </div>
    )
}