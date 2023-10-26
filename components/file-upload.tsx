"use client";
import React, { FC, useCallback } from "react";
import { useDropzone } from "react-dropzone";

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  uploadedFile: File | null;
}

export const FileUpload: FC<FileUploadProps> = ({
  onFileSelect,
  uploadedFile,
}) => {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      onFileSelect(acceptedFiles[0]);
    },
    [onFileSelect]
  );

  const { getRootProps, getInputProps } = useDropzone({
    maxFiles: 1,
    onDrop,
    accept: { "application/pdf": [".pdf"] },
  });

  return (
    <div
      {...getRootProps()}
      className={`flex flex-col items-center p-5 pb-6 border-2 border-dashed rounded-lg border-gray-300 bg-fafafa text-gray-400 cursor-pointer transition-all ease-in-out duration-300 hover:border-gray-600 ${
        uploadedFile ? "w-1/2" : "w-full"
      }`}
    >
      <input {...getInputProps()} />
      <p>Dra og slipp en PDF, eller klikk for å velge</p>
    </div>
  );
};
