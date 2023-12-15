/* eslint-disable @typescript-eslint/no-explicit-any */
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import useDragDrop from '@/hooks/useDragDrop';
import { cn, formatBytes } from '@/lib/utils';
import { Expand, File, Loader2, RotateCcw, Trash2, UploadCloud, Video } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Button } from '../ui/button';
import { api_client } from '@/utils/api-client';
import { useMutation, useQueryClient } from 'react-query';
import { toast } from '../ui/use-toast';
import { useParams } from 'react-router-dom';

export default function UploadComponent() {
  const params = useParams();
  const [files, setFiles] = useState<File[]>([]);
  const [loadingState, setLoadingState] = useState<any>({});
  const [previewImage, setPreviewImage] = useState<any>(null);
  const [imagePreviews, setImagePreviews] = useState<{ [key: string]: string }>({});
  const [isVideoValid] = useState<boolean>(false);
  const [totalWeight, setTotalWeight] = useState<number>(0);
  const [open, setOpen] = useState(false);

  const { dragOver, setDragOver, onDragOver, onDragLeave, fileDropError, setFileDropError } = useDragDrop();

  const onDrop = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setDragOver(false);

    const selectedFiles = Array.from(e.dataTransfer.files);

    // console.log the types of the files
    console.log(selectedFiles.map((file) => file.type.split('/')[0]));

    if (
      selectedFiles.some((file) => {
        const fileType = file.type.split('/')[0];
        return isVideoValid ? fileType !== 'image' && fileType !== 'video' : fileType !== 'image';
      })
    ) {
      return setFileDropError('Invalid file type!');
    }

    setFiles((prevFiles) => [...prevFiles, ...selectedFiles]);
    setFileDropError('');
  };

  const fileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files as FileList);

    if (
      selectedFiles.some((file) => {
        const fileType = file.type.split('/')[0];
        return isVideoValid ? fileType !== 'image' && fileType !== 'video' : fileType !== 'image';
      })
    ) {
      return setFileDropError('Invalid file type!');
    }

    setFiles((prevFiles) => [...prevFiles, ...selectedFiles]);
    setFileDropError('');
  };

  const simulateLoading = (file: File) => {
    // Calcula la duración del temporizador en milisegundos
    const duration = Math.max(1000, Math.min(file.size / 750, 4000));

    setLoadingState((prev: any) => ({ ...prev, [file.name]: true }));

    setTimeout(() => {
      setLoadingState((prev: any) => ({ ...prev, [file.name]: false }));
    }, duration);
  };

  const handleDelete = (fileName: string) => {
    // Filtrar los archivos para eliminar el seleccionado
    setFiles(files.filter((file) => file.name !== fileName));
  };

  const handlePreview = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e: any) => {
      setPreviewImage(e.target.result);
    };
    reader.readAsDataURL(file);
  };

  const generatePreview = (file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreviews((prev) => ({
        ...prev,
        [file.name]: reader.result as string
      }));
    };
    reader.readAsDataURL(file);
  };

  useEffect(() => {
    files.forEach((file) => {
      if (loadingState[file.name] === undefined) {
        generatePreview(file);
        simulateLoading(file);
      }
    });
    setTotalWeight(files.reduce((acc, file) => acc + file.size, 0));
    console.log(files);
    console.log(files.length);
  }, [files, loadingState]);

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationKey: ['uploadFileMutationTvojtato'],
    mutationFn: async (formData: Array<File>) => {
      const data_to_send = new FormData();
      for (let i = 0; i < formData.length; i++) {
        data_to_send.append('file', formData[i]);
      }
      console.log(data_to_send);
      const { data } = await api_client.post(`shops/upload/${params.id}`, data_to_send, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return data;
    },
    onSuccess: () => {
      toast({
        variant: 'default',
        title: 'File uploaded successfully'
      });
      queryClient.invalidateQueries('shopsDetailQuery');
      setOpen(false);
      setFiles([]);
    },
    onError: (error: any) => {
      toast({
        variant: 'destructive',
        title: 'Uh oh! Something went wrong.',
        description: error.response.data.message
      });
    }
  });

  const handleUpload = async () => {
    mutation.mutateAsync(files);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="outline">Upload new files</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          {/* Uploader */}
          <div className="dark:bg-neutral-800 bg-white border dark:border-neutral-700 w-full max-w-lg rounded-xl mt-4">
            <div className="border-b dark:border-neutral-700">
              <div className="flex flex-row justify-start items-center px-4 py-2 gap-2">
                <div className="rounded-full border p-2 flex flex-row justify-center items-center dark:border-neutral-700">
                  <UploadCloud className="h-5 w-5 text-neutral-600" />
                </div>
                <div>
                  <p className="font-semibold mb-0">Upload your files</p>
                  <p className="text-sm text-neutral-500 -mt-1">Drag and drop your files.</p>
                </div>
              </div>
            </div>
            <form>
              <label htmlFor="file" onDragOver={onDragOver} onDragLeave={onDragLeave} onDrop={onDrop}>
                <div
                  className={cn(
                    'px-4 py-2 border-[1.5px] border-dashed dark:border-neutral-700 m-2 rounded-xl flex flex-col justify-start items-center hover:cursor-pointer',
                    dragOver && 'border-blue-600 bg-blue-50'
                  )}
                >
                  <div className="flex flex-col justify-start items-center">
                    <UploadCloud className={cn('h-5 w-5 text-neutral-600 my-4', dragOver && 'text-blue-500')} />
                    <p className="font-semibold">Choose a file or drag & drop it here</p>
                    <p className="text-neutral-500 text-sm">Any files. Up to 50 MB.</p>
                    <div className="px-3 py-1 border dark:border-neutral-700 rounded-xl mt-4 mb-2 drop-shadow-sm hover:drop-shadow transition-all hover:cursor-pointer bg-white dark:bg-neutral-700">
                      Select files
                    </div>
                  </div>
                </div>
              </label>
              <input type="file" name="file" id="file" className="hidden" onChange={fileSelect} multiple />
            </form>

            {files.length > 0 && (
              <div className="w-full px-4 py-2 gap-2 flex flex-col justify-start items-center border-t dark:border-neutral-700 max-h-52 overflow-auto">
                <div className="w-full flex flex-row justify-end items-center">
                  <p className="bg-neutral-100 px-2 text-sm py-1 rounded-full text-neutral-500">
                    {files.length} {files.length === 1 ? 'file' : 'files'}, {formatBytes(totalWeight)}
                  </p>
                </div>
                {files.map((file, index) => {
                  const isLoading = loadingState[file.name];
                  const preview = imagePreviews[file.name];

                  // Check if file is an image
                  const isImage = (file: string) => {
                    return file.match(/image.*/);
                  };
                  // Check if file is a video
                  const isVideo = (file: string) => {
                    return file.match(/video.*/);
                  };

                  return (
                    <div
                      key={index}
                      className="flex flex-row justify-between items-center border dark:border-neutral-700 rounded-lg px-2 py-1 w-full group"
                    >
                      <div className="flex flex-row justify-start items-center gap-2">
                        <div>
                          {isLoading ? (
                            <div className="flex flex-row justify-center items-center gap-2 h-10 w-10 border rounded-md">
                              <Loader2 className="h-4 w-4 animate-spin text-neutral-500" />
                            </div>
                          ) : (
                            preview && (
                              <div className="relative h-10 w-10">
                                {isImage(preview) && (
                                  <div className="relative h-10 w-10">
                                    <img
                                      src={preview}
                                      alt="Preview"
                                      className="rounded-md h-full w-full border"
                                      style={{ objectFit: 'cover' }}
                                    />
                                  </div>
                                )}
                                {isVideo(preview) && (
                                  <div className="relative h-10 w-10 flex flex-row justify-center items-center border rounded-lg text-neutral-500 hover:text-neutral-700 transition-all">
                                    <Video className="h-5 w-5" />
                                  </div>
                                )}
                              </div>
                            )
                          )}
                        </div>
                        <div className="flex flex-col justify-start items-start gap-1">
                          <div className="flex flex-row justify-start items-center gap-2">
                            <div className="max-w-[300px] truncate">
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <p className="truncate hover:cursor-help">{file.name}</p>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>{file.name}</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            </div>
                          </div>
                          <div className="flex flex-row justify-start items-center gap-2">
                            <p className="text-xs text-neutral-500">{formatBytes(file.size)}</p>
                            {!isLoading && (
                              <div className="flex flex-row justify-start items-center text-xs rounded-full px-2 py-[0.5px] gap-1">
                                <div className="h-2 w-2 bg-green-400 rounded-full" />
                                <p className="text-neutral-500">Uploaded</p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-row justify-end items-center gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <button
                              onClick={() => handlePreview(file)}
                              className="text-neutral-400 hidden group-hover:flex flex-row justify-end bg-neutral-100 p-1 rounded-lg hover:text-black transition-all hover:cursor-pointer"
                            >
                              <Expand className="h-4 w-4" />
                            </button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogTitle>{file.name}</DialogTitle>
                            <div className="bg-neutral-100 rounded-xl relative w-full min-h-[300px] h-full flex flex-col justify-center items-center ">
                              {previewImage ? (
                                isImage(previewImage) ? (
                                  <img
                                    src={previewImage}
                                    alt="Image Preview"
                                    className="rounded-md h-full w-full border"
                                    style={{ objectFit: 'cover' }}
                                  />
                                ) : isVideo(previewImage) ? (
                                  <video
                                    src={previewImage}
                                    controls
                                    className="rounded-md h-full w-full border"
                                    style={{ objectFit: 'cover' }}
                                  />
                                ) : null
                              ) : (
                                <Loader2 className="h-4 w-4 animate-spin text-neutral-500" />
                              )}
                            </div>
                          </DialogContent>
                        </Dialog>
                        <button
                          className="text-neutral-400 hidden group-hover:flex flex-row justify-end bg-neutral-100 p-1 rounded-lg hover:text-black transition-all hover:cursor-pointer"
                          onClick={() => handleDelete(file.name)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
            {fileDropError && (
              <div className="bg-orange-50 py-1 mx-2 rounded-lg text-center my-2 border border-orange-200 flex flex-row justify-center items-center gap-2">
                <File className="h-4 w-4 text-orange-400" />
                <p className="text-orange-400 text-sm font-medium">{fileDropError}</p>
              </div>
            )}
          </div>
          {files.length > 0 && (
            <div className="w-full">
              <div className="flex justify-between px-3">
                <Button
                  className="text-sm mt-4 rounded-full px-4 py-1 hover:cursor-pointer transition-all"
                  onClick={handleUpload}
                >
                  <UploadCloud className="inline-block h-4 w-4 mr-1" />
                  Upload
                </Button>
                <Button
                  variant={'outline'}
                  className="text-sm mt-4 rounded-full px-4 py-1 hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:cursor-pointer transition-all border text-neutral-500 hover:text-black"
                  onClick={() => setFiles([])}
                >
                  <RotateCcw className="inline-block h-4 w-4 mr-1" />
                  Reset
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
