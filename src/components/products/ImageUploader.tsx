'use client';

import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';
import { Image, X } from 'lucide-react';

interface ImageUploaderProps {
  onChange: (urls: string[]) => void;
  value: string[];
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onChange, value }) => {
  const [isUploading, setIsUploading] = useState(false);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    setIsUploading(true);
    const uploadedUrls: string[] = [];

    for (const file of acceptedFiles) {
      const formData = new FormData();
      formData.append('file', file);

      try {
        const response = await axios.post('/api/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        uploadedUrls.push(response.data.url);
      } catch (error) {
        console.error('Error uploading file:', error);
        // Optionally, show a toast notification for the error
      }
    }

    onChange([...value, ...uploadedUrls]);
    setIsUploading(false);
  }, [onChange, value]);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: { 'image/*': [] },
    multiple: true,
  });

  const onRemove = (urlToRemove: string) => {
    onChange(value.filter((url) => url !== urlToRemove));
  };

  return (
    <div>
      <div
        {...getRootProps()}
        className="border-2 border-dashed border-gray-300 rounded-lg p-10 text-center cursor-pointer"
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center justify-center gap-4">
          <Image className="w-10 h-10 text-gray-400" />
          <p>Drag 'n' drop some files here, or click to select files</p>
          {isUploading && <p>Uploading...</p>}
        </div>
      </div>
      <div className="mt-4 flex flex-wrap gap-4">
        {value.map((url) => (
          <div key={url} className="relative w-32 h-32">
            <img
              src={url}
              alt="Uploaded image"
              className="w-full h-full object-cover rounded-lg"
            />
            <button
              onClick={() => onRemove(url)}
              className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImageUploader;
