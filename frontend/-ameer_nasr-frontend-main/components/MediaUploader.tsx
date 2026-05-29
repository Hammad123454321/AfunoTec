"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import Image from "next/image";
import { X, Play } from "lucide-react";

export interface MediaUploaderProps {
  name?: string;
  value?: (File | string)[]; // Multiple media files, can be URLs or Files
  onChange?: (files: (File | string)[]) => void;
  label?: string;
  disabled?: boolean;
  className?: string;
  maxFiles?: number;
  acceptVideo?: boolean; // Enable video upload
  acceptImage?: boolean; // Enable image upload
}

export default function MediaUploader({
  name,
  value = [],
  onChange,
  label = "Upload Media",
  disabled = false,
  className = "",
  maxFiles = 6,
  acceptVideo = true,
  acceptImage = true,
}: MediaUploaderProps) {
  const [previews, setPreviews] = useState<
    { url: string; type: "image" | "video" }[]
  >([]);

  // Build accept object based on props
  const acceptTypes: Record<string, string[]> = {};
  if (acceptImage) acceptTypes["image/*"] = [];
  if (acceptVideo) acceptTypes["video/*"] = [];

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (!onChange) return;
      const newFiles = [...(value || []), ...acceptedFiles].slice(0, maxFiles);
      onChange(newFiles);
    },
    [onChange, value, maxFiles]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: true,
    accept: acceptTypes,
    disabled,
  });

  // Determine media type
  const getMediaType = (item: File | string): "image" | "video" => {
    if (typeof item === "string") {
      // Check URL extension or assume image by default
      const lower = item.toLowerCase();
      if (
        lower.includes(".mp4") ||
        lower.includes(".webm") ||
        lower.includes(".mov") ||
        lower.includes(".avi")
      ) {
        return "video";
      }
      return "image";
    }
    return item.type.startsWith("video/") ? "video" : "image";
  };

  // Create preview URLs for new Files + keep existing URLs
  useEffect(() => {
    const previewData = value.map((item) => {
      const url = typeof item === "string" ? item : URL.createObjectURL(item);
      const type = getMediaType(item);
      return { url, type };
    });

    setPreviews(previewData);

    return () => {
      previewData.forEach(({ url }) => {
        if (url.startsWith("blob:")) URL.revokeObjectURL(url);
      });
    };
  }, [value]);

  const handleRemove = (index: number) => {
    if (!onChange) return;
    const newValues = [...value];
    newValues.splice(index, 1);
    onChange(newValues);
  };

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      {label && (
        <label
          htmlFor={name}
          className="text-sm font-medium text-gray-700 dark:text-gray-200"
        >
          {label}
        </label>
      )}

      <div
        {...getRootProps()}
        className={`relative flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all duration-200
        ${
          isDragActive
            ? "border-primary-500 bg-primary-50 dark:bg-primary-950/30"
            : "border-gray-300 dark:border-gray-700 hover:border-primary-400"
        }
        ${disabled ? "opacity-50 cursor-not-allowed" : ""}
      `}
      >
        <input {...getInputProps()} name={name} disabled={disabled} />

        <div className="flex flex-wrap gap-3 justify-center w-full">
          {previews.length > 0 ? (
            previews.map(({ url, type }, index) => (
              <div
                key={index}
                className="relative w-32 h-32 rounded-lg overflow-hidden group bg-gray-100 dark:bg-gray-800"
              >
                {type === "image" ? (
                  <Image
                    src={url}
                    alt={`Uploaded ${index + 1}`}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                ) : (
                  <div className="relative w-full h-full">
                    <video
                      src={url}
                      className="w-full h-full object-cover"
                      muted
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                      <Play
                        size={32}
                        className="text-white drop-shadow-lg"
                        fill="white"
                      />
                    </div>
                  </div>
                )}
                {!disabled && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemove(index);
                    }}
                    className="absolute top-1 right-1 bg-black/50 hover:bg-black/70 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-8 text-gray-500 dark:text-gray-400">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-10 w-10 mb-2 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 16.5v-9a1.5 1.5 0 011.5-1.5h4.379a1.5 1.5 0 011.06.44l1.122 1.12a1.5 1.5 0 001.06.44H19.5A1.5 1.5 0 0121 9v7.5M3 16.5l2.25-2.25a.75.75 0 011.06 0l2.19 2.19a.75.75 0 001.06 0l1.19-1.19a.75.75 0 011.06 0L15 17.25M3 16.5V21h18v-4.5"
                />
              </svg>
              <p className="text-sm">
                {isDragActive
                  ? "Drop media here..."
                  : "Drag & drop or click to upload"}
              </p>
              <p className="text-xs mt-1">
                {acceptImage && acceptVideo
                  ? "Images & Videos"
                  : acceptImage
                  ? "Images only"
                  : "Videos only"}
              </p>
            </div>
          )}
        </div>
      </div>

      {value.length > 0 && (
        <p className="text-xs text-gray-500 mt-1 text-right">
          {value.length}/{maxFiles} files selected
        </p>
      )}
    </div>
  );
}

// ✅ 1. Plain Form + FormData

/*
"use client";

import { useState } from "react";
import MediaUploader from "@/components/MediaUploader";

export default function MediaUploadForm() {
  const [media, setMedia] = useState<(File | string)[]>([]);
  const [title, setTitle] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    media.forEach((item) => {
      if (item instanceof File) formData.append("media", item);
    });
    formData.append("title", title);

    await fetch("/api/upload", { method: "POST", body: formData });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto">
      <input
        type="text"
        placeholder="Title"
        className="border rounded-md w-full p-2"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <MediaUploader value={media} onChange={setMedia} />

      <button
        type="submit"
        className="bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-md"
      >
        Submit
      </button>
    </form>
  );
}
*/

// ✅ 2. React Hook Form Integration
/*
import { useForm, Controller } from "react-hook-form";
import MediaUploader from "@/components/MediaUploader";

export default function HookFormMediaUpload() {
  const { control, handleSubmit } = useForm({
    defaultValues: { name: "", media: [] },
  });

  const onSubmit = async (data: any) => {
    const formData = new FormData();
    formData.append("name", data.name);
    data.media.forEach((item: File) => formData.append("media", item));
    await fetch("/api/upload", { method: "POST", body: formData });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-md mx-auto space-y-4">
      <Controller
        name="name"
        control={control}
        render={({ field }) => (
          <input {...field} className="border p-2 rounded w-full" placeholder="Name" />
        )}
      />

      <Controller
        name="media"
        control={control}
        render={({ field }) => (
          <MediaUploader value={field.value} onChange={field.onChange} />
        )}
      />

      <button type="submit" className="bg-primary-500 text-white px-4 py-2 rounded">
        Upload
      </button>
    </form>
  );
}
*/

// ✅ 3. Images Only
/*
<MediaUploader 
  value={files} 
  onChange={setFiles} 
  acceptVideo={false} 
  acceptImage={true}
/>
*/

// ✅ 4. Videos Only
/*
<MediaUploader 
  value={files} 
  onChange={setFiles} 
  acceptVideo={true} 
  acceptImage={false}
  label="Upload Videos"
/>
*/
