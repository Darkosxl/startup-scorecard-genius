
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Upload, CheckCircle, AlertCircle } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

interface FileUploaderProps {
  onFileUpload: (file: File) => void;
  acceptedFileTypes?: string;
  maxSizeMB?: number;
}

const FileUploader: React.FC<FileUploaderProps> = ({
  onFileUpload,
  acceptedFileTypes = ".csv, application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  maxSizeMB = 10
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [fileName, setFileName] = useState<string | null>(null);
  const { toast } = useToast();
  
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };
  
  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };
  
  const validateFile = (file: File): boolean => {
    const fileTypes = acceptedFileTypes.split(',').map(type => type.trim());
    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
    
    if (!fileTypes.some(type => type.includes(fileExtension) || type.includes(file.type))) {
      toast({
        title: "Invalid file type",
        description: `Please upload a file with one of these formats: ${acceptedFileTypes}`,
        variant: "destructive"
      });
      return false;
    }
    
    if (file.size > maxSizeMB * 1024 * 1024) {
      toast({
        title: "File too large",
        description: `File size must be less than ${maxSizeMB}MB`,
        variant: "destructive"
      });
      return false;
    }
    
    return true;
  };
  
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      if (validateFile(file)) {
        processFile(file);
      }
    }
  };
  
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      if (validateFile(file)) {
        processFile(file);
      }
    }
  };
  
  const processFile = (file: File) => {
    try {
      setFileName(file.name);
      setUploadStatus('success');
      onFileUpload(file);
      toast({
        title: "File uploaded",
        description: `${file.name} has been uploaded successfully`,
      });
    } catch (error) {
      setUploadStatus('error');
      toast({
        title: "Upload failed",
        description: "An error occurred while processing the file",
        variant: "destructive"
      });
    }
  };
  
  return (
    <Card
      className={`border-2 border-dashed rounded-lg p-6 transition-all animate-fade-in ${
        isDragging 
          ? 'border-primary bg-primary/5' 
          : uploadStatus === 'success' 
            ? 'border-green-500 bg-green-50 dark:bg-green-900/10' 
            : uploadStatus === 'error' 
              ? 'border-red-500 bg-red-50 dark:bg-red-900/10' 
              : 'border-slate-300 dark:border-slate-700 hover:border-primary'
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className="flex flex-col items-center justify-center space-y-4 text-center">
        {uploadStatus === 'success' ? (
          <CheckCircle className="w-12 h-12 text-green-500" />
        ) : uploadStatus === 'error' ? (
          <AlertCircle className="w-12 h-12 text-red-500" />
        ) : (
          <Upload className="w-12 h-12 text-slate-400" />
        )}
        
        <div className="space-y-1">
          <h3 className="text-lg font-medium">
            {uploadStatus === 'success' 
              ? 'File Uploaded Successfully' 
              : uploadStatus === 'error' 
                ? 'Upload Failed' 
                : 'Upload your startup dataset'}
          </h3>
          
          {uploadStatus === 'success' && fileName ? (
            <p className="text-sm text-slate-500 dark:text-slate-400">{fileName}</p>
          ) : (
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Drag and drop your CSV file, or click to browse
            </p>
          )}
          
          {uploadStatus === 'idle' && (
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-2">
              Supported formats: CSV, Excel (up to {maxSizeMB}MB)
            </p>
          )}
        </div>
        
        {uploadStatus !== 'success' && (
          <div>
            <input
              id="file-upload"
              type="file"
              className="hidden"
              onChange={handleFileSelect}
              accept={acceptedFileTypes}
            />
            <label htmlFor="file-upload">
              <Button variant="outline" size="sm" className="mt-2" asChild>
                <span>Browse Files</span>
              </Button>
            </label>
          </div>
        )}
        
        {uploadStatus === 'success' && (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => {
              setUploadStatus('idle');
              setFileName(null);
            }}
          >
            Upload Another File
          </Button>
        )}
      </div>
    </Card>
  );
};

export default FileUploader;
