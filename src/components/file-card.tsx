import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Doc, Id } from "../../convex/_generated/dataModel";
import { Button } from "./ui/button";
import {
  Download,
  File,
  MoreVertical,
  FileText,
  FileArchive,
  Image as ImageIcon,
  FileVideo,
  FilePlus,
  FileMinus,
  FileStack,
  Music,
  Code,
  Database,
  Loader2,
  Star,
  StarOff,
  Trash2,
  ArchiveRestore,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { format } from "date-fns";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { toast } from "sonner";
import Image from "next/image";

function getFileUrl(fileId: Id<"_storage">): string {
  return `${process.env.NEXT_PUBLIC_CONVEX_URL}/api/storage/${fileId}`;
}

function getFileIcon(fileType: string) {
  switch (fileType) {
    case "csv":
    case "txt":
      return <FileText className="text-primary w-[100px] h-[100px]" />;
    case "pdf":
      return <FileStack className="text-primary w-[100px] h-[100px]" />;
    case "doc":
    case "docx":
    case "odt":
    case "tex":
    case "rtf":
      return <FileMinus className="text-primary w-[100px] h-[100px]" />;
    case "xls":
    case "xlsx":
      return <FilePlus className="text-primary w-[100px] h-[100px]" />;
    case "ppt":
    case "pptx":
      return <FileMinus className="text-primary w-[100px] h-[100px]" />;
    case "zip":
    case "rar":
    case "7z":
    case "tar":
    case "gz":
    case "bz2":
    case "s7z":
    case "jar":
    case "war":
    case "xip":
    case "iso":
      return <FileArchive className="text-primary w-[100px] h-[100px]" />;
    case "mp4":
    case "mov":
    case "avi":
    case "mkv":
    case "flv":
    case "wmv":
    case "mpg":
    case "mpeg":
    case "mp2":
    case "mpe":
    case "mpv":
    case "m4p":
    case "m4v":
    case "swf":
    case "avchd":
      return <FileVideo className="text-primary w-[100px] h-[100px]" />;
    case "mp3":
    case "wav":
    case "flac":
    case "aac":
    case "ogg":
      return <Music className="text-primary w-[100px] h-[100px]" />;
    case "html":
    case "css":
    case "js":
    case "ts":
    case "java":
    case "py":
    case "rb":
    case "go":
    case "php":
    case "cpp":
    case "c":
    case "cs":
    case "swift":
    case "kt":
    case "rs":
    case "lua":
      return <Code className="text-primary w-[100px] h-[100px]" />;
    case "sql":
    case "db":
    case "dbf":
    case "mdb":
    case "accdb":
      return <Database className="text-primary w-[100px] h-[100px]" />;
    default:
      return <File className="text-primary w-[100px] h-[100px]" />;
  }
}

export function FileCardActions({ file }: { file: Doc<"files"> }) {
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  
  const deleteFile = useMutation(api.files.deleteFile);
  const favFile = useMutation(api.files.favFile);
  const unFavFile = useMutation(api.files.unFavFile);
  const moveToTrash = useMutation(api.files.moveToTrash)
  const restoreFile = useMutation(api.files.restoreFile)
  return (
    <>
      <AlertDialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete this
              file and remove its data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={async () => {
                await deleteFile({
                  fileId: file._id,
                  orgId: file.orgId,
                });
                toast.success("File deleted successfully.");
              }}
            >
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <DropdownMenu>
        <DropdownMenuTrigger
          className="rounded-full hover:bg-zinc-800 focus:bg-zinc-700 cursor-pointer"
          asChild
        >
          <MoreVertical className="w-8 h-8 p-2" />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {!file.inTrash ? (
            <><DropdownMenuItem
            onClick={!file.isFavorite ? async () => {
              await favFile({
                fileId: file._id,
              })
              toast.success('Added to Favorites.')
            } : async () => {
              await unFavFile({
                fileId: file._id
              })
              toast.success('Removed from Favorites.')
            }}
            className="flex gap-1.5"
          >
            { file.isFavorite ? (
              <><StarOff className="w-4 h-4 text-primary" />
              <span>Un-favorite</span></>
            ) : (
              <><Star className="w-4 h-4 text-primary" />
              <span>Favorite</span></>
            )}
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={async () =>  {
              await moveToTrash({
                fileId: file._id,
              })
              toast.success('Moved to trash.')
            }}
            className="flex gap-1.5"
          >
            <Trash2 className="w-4 h-4 text-destructive" />
            Move to trash
          </DropdownMenuItem></>
          ) : (

          <DropdownMenuItem
            onClick={async () =>  {
              await restoreFile({
                fileId: file._id,
              })
              toast.success('Restored successfully.')
            }}
            className="flex gap-1.5"
          >
            <ArchiveRestore className="w-4 h-4 text-primary" />
            Restore file
          </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}

export function FileCard({ file }: { file: Doc<"files"> }) {
  const [download, setDownload] = useState(false);
  const imageTypes = [
    "jpeg",
    "jpg",
    "png",
    "gif",
    "bmp",
    "svg",
    "webp",
    "image",
  ];
  return (
    <Card className="flex flex-col justify-between">
      <div>
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            <div className="flex items-center space-x-2 overflow-hidden">
              {file.isFavorite && <Star className="w-4 h-4 text-primary" />}
              <span className="overflow-ellipsis overflow-hidden whitespace-nowrap">
                {file.name}
              </span>
            </div>
            <FileCardActions file={file} />
          </CardTitle>
          <CardDescription>
            {format(new Date(file._creationTime), "MMM yyyy")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {imageTypes.includes(file.type) ? (
            <Image
              src={getFileUrl(file.fileId)}
              alt={file.name}
              height={300}
              width={300}
            />
          ) : (
            <div className="text-center flex items-center justify-center w-[200px] h-[200px] mx-auto bg-primary/10 rounded-full py-4 px-0">
              {getFileIcon(file.type)}
            </div>
          )}
        </CardContent>
      </div>
      <CardFooter>
        <Button
          disabled={download}
          size="icon"
          onClick={async () => {
            setDownload(true);
            const fileData = await fetch(getFileUrl(file.fileId)).then(
              (response) => response.blob()
            );
            const blobUrl = URL.createObjectURL(fileData);

            const link = document.createElement("a");
            link.href = blobUrl;
            link.download = file.name;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            setDownload(false);
          }}
        >
          {download ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <Download className="w-5 h-5" />
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
