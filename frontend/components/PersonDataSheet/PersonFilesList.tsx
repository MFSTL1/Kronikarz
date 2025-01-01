/* eslint-disable @next/next/no-img-element */
import { FileInfo } from "@/lib/personInterfaces";
import { Card } from "../ui/card";
import { Download, File as FileIcon, Plus, Trash } from "lucide-react";
import { Button } from "../ui/button";
import { ChangeEventHandler, useRef } from "react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { isImageFile } from "@/lib/utils";

interface Props {
  files: FileInfo[];
  image?: number | null;
  onFileAdd?: (f: File) => Promise<FileInfo>;
  onFileDelete?: (f: FileInfo) => Promise<void>;
}

export function PersonFilesList({ files, image, onFileAdd, onFileDelete }: Props) {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const fileCards = files.map((file) => {
    const fileImage = isImageFile(file.name) ? 
      <img src={file.url} alt="File image" className="size-full object-cover"/> :
      <FileIcon className="size-10" />;

    const handleDeleteFile = () => onFileDelete && onFileDelete(file);

    return (
      <DropdownMenu key={file.id}>
        <DropdownMenuTrigger asChild>
          <Button title={file.name} variant="outline" className="w-32 h-40 p-4 flex-col justify-between">
            <div className="w-full aspect-square overflow-hidden flex items-center justify-center">
              { fileImage }
            </div>
            <h4 className="text-sm text-muted-foreground text-center w-full text-ellipsis overflow-hidden">
              { file.name }
            </h4>
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent>
          <DropdownMenuLabel>{file.name}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <a href={file.url} download={file.name}>
              <DropdownMenuItem>
                <Download />
                Pobierz
              </DropdownMenuItem>
            </a>
            {onFileDelete && <DropdownMenuItem onClick={handleDeleteFile}>
              <Trash className="text-destructive" />
              <span className="text-destructive">Usuń { image === file.id && "(usunie również zdjęcie profilowe)" }</span>
            </DropdownMenuItem>}
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  });

  const handleAddFile: ChangeEventHandler<HTMLInputElement> = async (e) => {
    if (!e.target.files?.length || !onFileAdd) return;
    await onFileAdd(e.target.files[0]);  
  };

  return (
    <>
      <h3 className="text-2xl font-semibold tracking-tight text-center mt-5 mb-4">
        Pliki
      </h3>
      <Card className="p-4 flex flex-wrap gap-2">
        { fileCards }
        <input type="file" className="hidden" ref={inputRef} onChange={handleAddFile} />
        {onFileAdd && <Button onClick={() => inputRef.current?.click()} variant="outline" className="w-32 h-40 flex flex-col items-center justify-center">
          <Plus className="size-8" />
          Dodaj plik
        </Button>}
      </Card>
    </>
  )
}