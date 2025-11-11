// components/ImagePreviewModal.tsx
import React from 'react';
import Cropper from 'react-easy-crop';
import { Area } from 'react-easy-crop';
import { IoMdClose } from "react-icons/io";
import { UploadedImage } from './Media';

type ImagePreviewModalProps = {
  image: UploadedImage;
  onClose: () => void;
  crop: { x: number; y: number };
  zoom: number;
  rotate: number;
  aspect: number;
  brightness: number;
  contrast: number;
  grayscale: number;
  onCropChange: (crop: { x: number; y: number }) => void;
  onZoomChange: (zoom: number) => void;
  onRotationChange: (rotate: number) => void;
  onAspectChange: (aspect: number) => void;
  onBrightnessChange: (value: number) => void;
  onContrastChange: (value: number) => void;
  onGrayscaleChange: (value: number) => void;
  onCropComplete: (croppedArea: Area, croppedAreaPixels: Area) => void;
  onResetFilters: () => void;
  onCropAndSave: () => void;
};

export const ImgEditModal: React.FC<ImagePreviewModalProps> = ({
  image,
  onClose,
  crop,
  zoom,
  rotate,
  aspect,
  brightness,
  contrast,
  grayscale,
  onCropChange,
  onZoomChange,
  onRotationChange,
  onAspectChange,
  onBrightnessChange,
  onContrastChange,
  onGrayscaleChange,
  onCropComplete,
  onResetFilters,
  onCropAndSave,
}) => {
  // ✅ Handle both File and Cloudinary image URLs
  const imageUrl = image.file
    ? URL.createObjectURL(image.file)
    : image.url;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-80 flex justify-center items-center">
      <div className='h-[95vh] flex items-center justify-center max-w-6xl w-full relative p-8'>
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-white text-2xl z-10"
        >
          <IoMdClose className="text-white dark:text-black" />
        </button>

        <div className="relative w-full h-full bg-white dark:bg-gray-900 p-4 rounded-lg">
          <div className="relative h-[50vh]">
            <Cropper
              image={imageUrl}
              crop={crop}
              zoom={zoom}
              rotation={rotate}
              aspect={aspect}
              onCropChange={onCropChange}
              onZoomChange={onZoomChange}
              onRotationChange={onRotationChange}
              onCropComplete={onCropComplete}
              style={{
                containerStyle: {
                  filter: `brightness(${brightness}%) contrast(${contrast}%) grayscale(${grayscale}%)`,
                },
              }}
            />
          </div>

          {/* Filters Panel */}
          <div className="mt-6 space-y-4 grid grid-cols-2 gap-x-8">
            <div className="flex items-center gap-4">
              <label className="w-24">Zoom</label>
              <input
                type="range"
                min={1}
                max={3}
                step={0.1}
                value={zoom}
                onChange={(e) => onZoomChange(Number(e.target.value))}
                className="w-full"
              />
            </div>
            <div className="flex items-center gap-4">
              <label className="w-24">Brightness</label>
              <input
                type="range"
                min={50}
                max={200}
                value={brightness}
                onChange={(e) => onBrightnessChange(Number(e.target.value))}
                className="w-full"
              />
            </div>
            <div className="flex items-center gap-4">
              <label className="w-24">Contrast</label>
              <input
                type="range"
                min={50}
                max={200}
                value={contrast}
                onChange={(e) => onContrastChange(Number(e.target.value))}
                className="w-full"
              />
            </div>
            <div className="flex items-center gap-4">
              <label className="w-24">Grayscale</label>
              <input
                type="range"
                min={0}
                max={100}
                value={grayscale}
                onChange={(e) => onGrayscaleChange(Number(e.target.value))}
                className="w-full"
              />
            </div>
            <div className="flex items-center gap-4">
              <label className="w-24">Rotate</label>
              <input
                type="range"
                min={0}
                max={360}
                step={4}
                value={rotate}
                onChange={(e) => onRotationChange(Number(e.target.value))}
                className="w-full"
              />
            </div>
            <div className="flex items-center gap-4">
              <label className="w-24 text-nowrap">Aspect Ratio</label>
              <select
                value={aspect}
                onChange={(e) => onAspectChange(parseFloat(e.target.value))}
                className="w-full border rounded px-2 py-1 bg-white dark:bg-gray-800 text-black dark:text-white"
              >
                <option value={1}>1:1</option>
                <option value={4 / 3}>4:3</option>
                <option value={16 / 9}>16:9</option>
                <option value={3 / 4}>3:4</option>
                <option value={9 / 16}>9:16</option>
              </select>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-6 text-right flex justify-end gap-4">
            <button
              type="button"
              onClick={onResetFilters}
              className="px-4 py-2 bg-gray-300 dark:bg-gray-700 text-black dark:text-white rounded"
            >
              Reset
            </button>
            <button
              className="px-4 py-2 bg-blue-600 text-white rounded"
              type="button"
              onClick={onCropAndSave}
            >
              Crop & Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};


