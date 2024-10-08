"use client"

import React, { useEffect, useRef, useState } from 'react'

interface IFileInputProps {
  title?: string;
  subtitle?: string;
  onFileSelect: any;
  deSelect?: any;
  maxSizeInBytes?: number;
  acceptedFormats?: string[];
}

export default function FileInput({ title, subtitle, onFileSelect, deSelect, maxSizeInBytes = 10*1024*1024, acceptedFormats = ['.png', 'jpeg'] }: IFileInputProps) {
  const fileInputRef = useRef(null);
  const [file, setFile] = useState<any>(null);

  const handleFileChange = (event: any) => {
    const file = event.target.files[0];
    const fileExtension = file.name.split('.').pop().toLowerCase();
    if (file.size < maxSizeInBytes && acceptedFormats.includes(`.${fileExtension}`)) {
      setFile(file);
      onFileSelect(file);
    }
  }

  const handleButtonClick = () => {
    if (fileInputRef.current) {
      (fileInputRef.current as any).click();
    }
  }

  useEffect(() => {
    if (deSelect) {
      setFile(null);
    }
  }, [deSelect])

  return (
    <div className="flex flex-col gap-y-2">
      {
        title && 
        <p className="text-sm font-medium">{title}</p>
      }
      <button className="file-upload"
        onClick={handleButtonClick}
      >
        <input
          type="file"
          className="file-input"
          ref={fileInputRef}
          onChange={handleFileChange}
        />
        <span>
          <img src="images/image_ico.svg" alt="" /> Choose file
        </span>{" "}
        {file ? file.name : "No files selected"}
        </button>
        {
          subtitle && <p className="text-sm text-gray-500 font-medium">{subtitle}</p>
        }
    </div>
  )
}
