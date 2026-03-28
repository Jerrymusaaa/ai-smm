'use client';

import { useState, useRef } from 'react';
import { Upload, X, ImageIcon, Film, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MediaFile {
  id: string;
  name: string;
  type: 'image' | 'video' | 'document';
  size: string;
  preview?: string;
}

interface MediaUploadProps {
  files: MediaFile[];
  onChange: (files: MediaFile[]) => void;
}

export function MediaUpload({ files, onChange }: MediaUploadProps) {
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const droppedFiles = Array.from(e.dataTransfer.files);
    processFiles(droppedFiles);
  };

  const processFiles = (rawFiles: File[]) => {
    const newFiles: MediaFile[] = rawFiles.map(f => ({
      id: Math.random().toString(36).slice(2),
      name: f.name,
      type: f.type.startsWith('image/') ? 'image' : f.type.startsWith('video/') ? 'video' : 'document',
      size: f.size > 1024 * 1024 ? `${(f.size / (1024*1024)).toFixed(1)} MB` : `${(f.size / 1024).toFixed(0)} KB`,
      preview: f.type.startsWith('image/') ? URL.createObjectURL(f) : undefined,
    }));
    onChange([...files, ...newFiles]);
  };

  const removeFile = (id: string) => onChange(files.filter(f => f.id !== id));

  const TypeIcon = ({ type }: { type: MediaFile['type'] }) => {
    if (type === 'image') return <ImageIcon className="w-4 h-4" />;
    if (type === 'video') return <Film className="w-4 h-4" />;
    return <FileText className="w-4 h-4" />;
  };

  return (
    <div>
      <label className="text-sm font-medium text-white/70 block mb-3">Media</label>

      {/* Drop zone */}
      <div
        onDragOver={e => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={cn(
          'border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all',
          dragging
            ? 'border-[#0066FF]/60 bg-[#0066FF]/10'
            : 'border-white/[0.08] hover:border-white/20 hover:bg-white/[0.02]'
        )}
      >
        <input
          ref={inputRef}
          type="file"
          multiple
          accept="image/*,video/*"
          className="hidden"
          onChange={e => processFiles(Array.from(e.target.files || []))}
        />
        <div className="w-10 h-10 rounded-xl bg-white/[0.06] flex items-center justify-center mx-auto mb-3">
          <Upload className="w-5 h-5 text-white/40" />
        </div>
        <p className="text-sm text-white/50 mb-1">
          Drop files here or <span className="text-[#0066FF]">browse</span>
        </p>
        <p className="text-xs text-white/25">PNG, JPG, GIF, MP4 up to 100MB</p>
      </div>

      {/* File previews */}
      {files.length > 0 && (
        <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 gap-2">
          {files.map(file => (
            <div key={file.id} className="relative glass rounded-xl overflow-hidden border border-white/[0.06] group">
              {file.preview ? (
                <img src={file.preview} alt={file.name} className="w-full h-20 object-cover" />
              ) : (
                <div className="w-full h-20 flex flex-col items-center justify-center gap-1 bg-white/[0.04]">
                  <TypeIcon type={file.type} />
                  <span className="text-[10px] text-white/40">{file.size}</span>
                </div>
              )}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <button
                  onClick={e => { e.stopPropagation(); removeFile(file.id); }}
                  className="w-7 h-7 rounded-full bg-red-500/80 flex items-center justify-center"
                >
                  <X className="w-3.5 h-3.5 text-white" />
                </button>
              </div>
              <div className="px-2 py-1.5">
                <p className="text-[10px] text-white/50 truncate">{file.name}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
