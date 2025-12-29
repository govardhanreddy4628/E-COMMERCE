import { useState, useRef } from 'react';
import { Paperclip, X, File, Image, FileText } from 'lucide-react';
import { Button } from '../../../ui/button';


interface FileAttachment {
  name: string;
  size: number;
  type: string;
  url: string;
}

interface FileUploadProps {
  onFileUpload: (file: FileAttachment) => void;
  onRemoveFile: () => void;
  attachedFile: FileAttachment | null;
  disabled?: boolean;
}

export function FileUpload({ onFileUpload, onRemoveFile, attachedFile, disabled }: FileUploadProps) {
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      alert('File size must be less than 10MB');
      return;
    }

    const fileAttachment: FileAttachment = {
      name: file.name,
      size: file.size,
      type: file.type,
      url: URL.createObjectURL(file)
    };

    onFileUpload(fileAttachment);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) return <Image size={16} />;
    if (type.includes('pdf') || type.includes('document')) return <FileText size={16} />;
    return <File size={16} />;
  };

  if (attachedFile) {
    return (
      <div className="flex items-center gap-2 p-2 bg-muted rounded-lg border">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <div className="text-muted-foreground">
            {getFileIcon(attachedFile.type)}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{attachedFile.name}</p>
            <p className="text-xs text-muted-foreground">{formatFileSize(attachedFile.size)}</p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={onRemoveFile}
          disabled={disabled}
          className="h-6 w-6 p-0 hover:bg-destructive hover:text-destructive-foreground"
        >
          <X size={12} />
        </Button>
      </div>
    );
  }

  return (
    <div className="relative">
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        onChange={handleFileSelect}
        accept="image/*,.pdf,.doc,.docx,.txt,.csv,.xlsx"
        disabled={disabled}
      />
      
      <Button
        variant="ghost"
        size="sm"
        onClick={() => fileInputRef.current?.click()}
        disabled={disabled}
        className="h-8 w-8 p-0"
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <Paperclip size={16} className={dragActive ? 'text-primary' : 'text-muted-foreground'} />
      </Button>

      {dragActive && (
        <div className="absolute -inset-2 bg-primary/10 border-2 border-dashed border-primary rounded-lg flex items-center justify-center">
          <p className="text-xs text-primary font-medium">Drop file here</p>
        </div>
      )}
    </div>
  );
}