'use client';

import {
  SingleImageDropzone as SingleImageDropzoneUI,
  type SingleImageDropzoneProps as SingleImageDropzoneUIProps,
} from '@/components/upload/single-image';
import {
  UploaderProvider,
  type FileState,
  type UploadFn,
} from '@/components/upload/uploader-provider';
import { useEdgeStore } from '@/lib/edgestore';
import * as React from 'react';

export type SingleImageDropzoneProps = {
  value?: File;
  onChange?: (file?: File) => void | Promise<void>;
  className?: string;
  disabled?: boolean;
  isUploading?: boolean;
  height?: number;
  width?: number;
  dropzoneOptions?: SingleImageDropzoneUIProps['dropzoneOptions'];
};

export function SingleImageDropzone({
  value,
  onChange,
  className,
  disabled,
  isUploading,
  height = 220,
  width = 400,
  dropzoneOptions,
}: SingleImageDropzoneProps) {
  const { edgestore } = useEdgeStore();
  const isControlled = onChange !== undefined;

  const uploadFn: UploadFn = React.useCallback(
    async ({ file, onProgressChange, signal }) => {
      const res = await edgestore.publicFiles.upload({
        file,
        signal,
        onProgressChange,
      });
      return res;
    },
    [edgestore],
  );

  const externalValue = React.useMemo((): FileState[] | undefined => {
    if (!value) return undefined;
    return [
      {
        file: value,
        key: `controlled-${value.name}-${value.lastModified}`,
        progress: 0,
        status: 'PENDING',
      },
    ];
  }, [value]);

  const handleFileAdded = React.useCallback(
    (fileState: FileState) => {
      void onChange?.(fileState.file);
    },
    [onChange],
  );

  const handleFileRemoved = React.useCallback(() => {
    void onChange?.(undefined);
  }, [onChange]);

  return (
    <UploaderProvider
      key={value ? `${value.name}-${value.lastModified}` : 'empty'}
      uploadFn={uploadFn}
      autoUpload={!isControlled}
      value={isControlled ? externalValue : undefined}
      onFileAdded={isControlled ? handleFileAdded : undefined}
      onFileRemoved={isControlled ? handleFileRemoved : undefined}
    >
      <SingleImageDropzoneUI
        height={height}
        width={width}
        className={className}
        disabled={disabled}
        isUploading={isUploading}
        dropzoneOptions={{
          maxSize: 1024 * 1024 * 1, // 1 MB
          ...dropzoneOptions,
        }}
      />
    </UploaderProvider>
  );
}
