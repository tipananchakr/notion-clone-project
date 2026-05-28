'use client';

import { Spinner } from '@/components/spinner';
import { cn } from '@/lib/utils';
import {
  AlertCircleIcon,
  ImagePlusIcon,
  Trash2Icon,
  XIcon,
} from 'lucide-react';
import * as React from 'react';
import { useDropzone, type DropzoneOptions } from 'react-dropzone';
import { ProgressCircle } from './progress-circle';
import { formatFileSize, useUploader } from './uploader-provider';

const DROPZONE_VARIANTS = {
  base: 'group relative flex cursor-pointer flex-col items-center justify-center overflow-hidden rounded-2xl border border-dashed border-border/70 bg-gradient-to-br from-muted/40 via-background to-muted/20 shadow-sm outline-none transition-all duration-300 ease-out hover:border-primary/50 hover:shadow-md focus-visible:ring-2 focus-visible:ring-primary/25 focus-visible:ring-offset-2 focus-visible:ring-offset-background',
  image:
    'cursor-pointer border border-border/60 bg-muted p-0 shadow-md ring-1 ring-black/5 dark:ring-white/10',
  active: 'border-primary/60 ring-2 ring-primary/20',
  disabled:
    'cursor-not-allowed border-border/50 bg-muted/30 opacity-60 shadow-none hover:border-border/50 hover:shadow-sm',
  accept:
    'scale-[1.01] border-primary bg-primary/5 shadow-md ring-2 ring-primary/20',
  reject: 'border-destructive/60 bg-destructive/5 ring-2 ring-destructive/15',
};

export interface SingleImageDropzoneProps
  extends React.HTMLAttributes<HTMLInputElement> {
  width: number;
  height: number;
  disabled?: boolean;
  isUploading?: boolean;
  dropzoneOptions?: Omit<
    DropzoneOptions,
    'disabled' | 'onDrop' | 'maxFiles' | 'multiple'
  >;
}

const SingleImageDropzone = React.forwardRef<
  HTMLInputElement,
  SingleImageDropzoneProps
>(
  (
    {
      dropzoneOptions,
      width,
      height,
      className,
      disabled,
      isUploading,
      ...props
    },
    ref,
  ) => {
    const { fileStates, addFiles, removeFile, cancelUpload } = useUploader();
    const [error, setError] = React.useState<string>();

    const fileState = React.useMemo(() => fileStates[0], [fileStates]);
    const maxSize = dropzoneOptions?.maxSize;

    const tempUrl = React.useMemo(() => {
      if (fileState?.file) {
        return URL.createObjectURL(fileState.file);
      }
      return null;
    }, [fileState]);

    React.useEffect(() => {
      return () => {
        if (tempUrl) {
          URL.revokeObjectURL(tempUrl);
        }
      };
    }, [tempUrl]);

    const displayUrl = tempUrl ?? fileState?.url;
    const isDisabled =
      !!disabled ||
      !!isUploading ||
      fileState?.status === 'UPLOADING' ||
      fileState?.status === 'COMPLETE';

    const { getRootProps, getInputProps, isFocused, isDragAccept, isDragReject } =
      useDropzone({
        accept: { 'image/*': [] },
        multiple: false,
        disabled: isDisabled,
        onDrop: (acceptedFiles, rejectedFiles) => {
          setError(undefined);

          if (rejectedFiles.length > 0) {
            if (rejectedFiles[0]?.errors[0]) {
              const error = rejectedFiles[0].errors[0];
              const code = error.code;

              const messages: Record<string, string> = {
                'file-too-large': `The file is too large. Max size is ${formatFileSize(
                  maxSize ?? 0,
                )}.`,
                'file-invalid-type': 'Invalid file type.',
                'too-many-files': 'You can only upload one file.',
                default: 'The file is not supported.',
              };

              setError(messages[code] ?? messages.default);
            }
            return;
          }

          if (acceptedFiles.length > 0) {
            if (fileStates[0]) {
              removeFile(fileStates[0].key);
            }
            addFiles(acceptedFiles);
          }
        },
        ...dropzoneOptions,
      });

    const dropZoneClassName = React.useMemo(
      () =>
        cn(
          DROPZONE_VARIANTS.base,
          isFocused && DROPZONE_VARIANTS.active,
          isDisabled && DROPZONE_VARIANTS.disabled,
          displayUrl && DROPZONE_VARIANTS.image,
          isDragReject && DROPZONE_VARIANTS.reject,
          isDragAccept && DROPZONE_VARIANTS.accept,
          className,
        ),
      [
        isFocused,
        isDisabled,
        displayUrl,
        isDragAccept,
        isDragReject,
        className,
      ],
    );

    const errorMessage = error ?? fileState?.error;
    const showReplaceHint =
      !!displayUrl && !isDisabled && !isUploading && fileState?.status !== 'UPLOADING';

    return (
      <div className="flex w-full flex-col items-center gap-3">
        <div
          {...getRootProps({
            className: dropZoneClassName,
            style: { width, height },
          })}
        >
          <input ref={ref} {...getInputProps()} {...props} />

          {displayUrl ? (
            <>
              <img
                className="h-full w-full object-cover"
                src={displayUrl}
                alt={fileState?.file.name ?? 'uploaded image'}
              />

              {showReplaceHint && (
                <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/0 opacity-0 transition-all duration-300 group-hover:bg-black/45 group-hover:opacity-100">
                  <span className="rounded-full bg-white/95 px-3.5 py-1.5 text-xs font-medium text-foreground shadow-lg backdrop-blur-sm dark:bg-zinc-900/95 dark:text-zinc-100">
                    Click to replace
                  </span>
                </div>
              )}
            </>
          ) : (
            <div
              className={cn(
                'flex flex-col items-center justify-center gap-3 px-6 text-center',
                isDisabled && 'opacity-50',
              )}
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary shadow-sm ring-1 ring-primary/10 transition-transform duration-300 group-hover:scale-105">
                <ImagePlusIcon className="h-7 w-7" strokeWidth={1.5} />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-semibold tracking-tight text-foreground">
                  Drop your image here
                </p>
                <p className="text-xs text-muted-foreground">
                  or click to browse from your device
                </p>
                {maxSize && (
                  <p className="pt-0.5 text-[11px] text-muted-foreground/80">
                    Max size · {formatFileSize(maxSize)}
                  </p>
                )}
              </div>
            </div>
          )}

          {displayUrl && (isUploading || fileState?.status === 'UPLOADING') && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 backdrop-blur-[2px]">
              {isUploading ? (
                <div className="flex flex-col items-center gap-2">
                  <Spinner size="icon" className="text-white" />
                  <span className="text-xs font-medium text-white/90">
                    Uploading…
                  </span>
                </div>
              ) : (
                <ProgressCircle progress={fileState.progress} />
              )}
            </div>
          )}

          {displayUrl &&
            !disabled &&
            !isUploading &&
            fileState &&
            fileState.status !== 'COMPLETE' && (
              <button
                type="button"
                className="pointer-events-auto absolute right-2.5 top-2.5 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-black/55 text-white shadow-lg backdrop-blur-sm transition-all hover:scale-105 hover:bg-black/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
                onClick={(e) => {
                  e.stopPropagation();
                  if (fileState.status === 'UPLOADING') {
                    cancelUpload(fileState.key);
                  } else {
                    removeFile(fileState.key);
                    setError(undefined);
                  }
                }}
              >
                {fileState.status === 'UPLOADING' ? (
                  <XIcon className="h-4 w-4" />
                ) : (
                  <Trash2Icon className="h-4 w-4" />
                )}
              </button>
            )}
        </div>

        {errorMessage && (
          <div
            className="flex w-full items-start gap-2 rounded-xl border border-destructive/20 bg-destructive/5 px-3 py-2.5 text-xs text-destructive"
            style={{ maxWidth: width }}
          >
            <AlertCircleIcon className="mt-0.5 h-4 w-4 shrink-0" />
            <span className="leading-relaxed">{errorMessage}</span>
          </div>
        )}
      </div>
    );
  },
);
SingleImageDropzone.displayName = 'SingleImageDropzone';

export { SingleImageDropzone };
