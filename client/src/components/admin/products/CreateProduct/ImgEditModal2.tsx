// components/ImgEditModal.tsx
import React, { useCallback, useEffect, useMemo, useState } from "react";
import Cropper, { Area } from "react-easy-crop";
import { IoMdClose } from "react-icons/io";
import { UploadedImage } from "./Media";

/* --------------------------------------------------------
   KEEP YOUR FUNCTION (UNCHANGED)
-------------------------------------------------------- */
const getCroppedImg = async (
  imageSrc: string,
  pixelCrop: { x: number; y: number; width: number; height: number },
  rotation: number = 0,
  filters: {
    brightness?: number;
    contrast?: number;
    grayscale?: number;
  } = {}
): Promise<{ file: File; url: string }> => {
  const createImage = (url: string): Promise<HTMLImageElement> =>
    new Promise((resolve, reject) => {
      const image = new Image();
      image.setAttribute("crossOrigin", "anonymous");
      image.onload = () => resolve(image);
      image.onerror = reject;
      image.src = url;
    });

  const image = await createImage(imageSrc);
  const radians = (rotation * Math.PI) / 180;

  const sin = Math.abs(Math.sin(radians));
  const cos = Math.abs(Math.cos(radians));
  const newWidth = image.width * cos + image.height * sin;
  const newHeight = image.width * sin + image.height * cos;

  const tempCanvas = document.createElement("canvas");
  tempCanvas.width = newWidth;
  tempCanvas.height = newHeight;

  const tempCtx = tempCanvas.getContext("2d");
  if (!tempCtx) throw new Error("Could not get canvas context");

  tempCtx.filter = `
    brightness(${filters.brightness ?? 100}%)
    contrast(${filters.contrast ?? 100}%)
    grayscale(${filters.grayscale ?? 0}%)
  `;

  tempCtx.translate(newWidth / 2, newHeight / 2);
  tempCtx.rotate(radians);
  tempCtx.drawImage(image, -image.width / 2, -image.height / 2);
  tempCtx.setTransform(1, 0, 0, 1, 0, 0); // Optional in modern browsers

  // Now crop from the rotated canvas
  const cropCanvas = document.createElement("canvas");
  cropCanvas.width = pixelCrop.width;
  cropCanvas.height = pixelCrop.height;

  const cropCtx = cropCanvas.getContext("2d");
  if (!cropCtx) throw new Error("Could not get crop canvas context");

  cropCtx.drawImage(
    tempCanvas,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height
  );

  return new Promise((resolve) => {
    cropCanvas.toBlob((blob) => {
      if (!blob) throw new Error("Canvas is empty");
      const file = new File([blob], "cropped-image.jpg", {
        type: "image/jpeg",
      });
      const url = URL.createObjectURL(file);
      resolve({ file, url });
    }, "image/jpeg");
  });
};

/* --------------------------------------------------------
   COMPONENT
-------------------------------------------------------- */
type ImgEditModalProps = {
  image: UploadedImage;
  onClose: () => void;
  onSave: (file: File, url: string) => void;
};

export const ImgEditModal: React.FC<ImgEditModalProps> = ({
  image,
  onClose,
  onSave,
}) => {
  /* ---------------- LOCAL STATE ---------------- */
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotate, setRotate] = useState(0);
  const [aspect, setAspect] = useState(4 / 3);
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [grayscale, setGrayscale] = useState(0);
  const [croppedAreaPixels, setCroppedAreaPixels] =
    useState<Area | null>(null);

  /* ---------------- IMAGE SOURCE ---------------- */
  const imageUrl = useMemo(
    () => (image.file ? URL.createObjectURL(image.file) : image.url),
    [image.file, image.url]
  );


useEffect(() => {
  return () => {
    if (image.file) {
      URL.revokeObjectURL(imageUrl);
    }
  };
}, [image.file, imageUrl]);


  const onCropComplete = useCallback(
    (_: Area, croppedPixels: Area) => {
      setCroppedAreaPixels(croppedPixels);
    },
    []
  );

  /* ---------------- SAVE ---------------- */
  const handleCropAndSave = async () => {
    if (!croppedAreaPixels) return;

    const { file, url } = await getCroppedImg(
      imageUrl,
      croppedAreaPixels,
      rotate,
      { brightness, contrast, grayscale }
    );

    onSave(file, url);
  };

  const resetFilters = () => {
    setZoom(1);
    setRotate(0);
    setBrightness(100);
    setContrast(100);
    setGrayscale(0);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center">
      <div className="relative w-full max-w-6xl h-[95vh] p-6">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-white text-2xl z-10"
        >
          <IoMdClose />
        </button>

        <div className="bg-white dark:bg-gray-900 rounded-lg p-4 h-full">
          <div className="relative h-[50vh]">
            <Cropper
              image={imageUrl}
              crop={crop}
              zoom={zoom}
              rotation={rotate}
              aspect={aspect}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onRotationChange={setRotate}
              onCropComplete={onCropComplete}
              style={{
                containerStyle: {
                  filter: `brightness(${brightness}%) contrast(${contrast}%) grayscale(${grayscale}%)`,
                },
              }}
            />
          </div>

          {/* CONTROLS */}
          <div className="mt-6 grid grid-cols-2 gap-4">
            <Range label="Zoom" value={zoom} min={1} max={3} step={0.1} onChange={setZoom} />
            <Range label="Brightness" value={brightness} min={50} max={200} onChange={setBrightness} />
            <Range label="Contrast" value={contrast} min={50} max={200} onChange={setContrast} />
            <Range label="Grayscale" value={grayscale} min={0} max={100} onChange={setGrayscale} />
            <Range label="Rotate" value={rotate} min={0} max={360} step={5} onChange={setRotate} />

            <select
              value={aspect}
              onChange={(e) => setAspect(Number(e.target.value))}
              className="border rounded px-2 py-1"
            >
              <option value={1}>1:1</option>
              <option value={4 / 3}>4:3</option>
              <option value={16 / 9}>16:9</option>
              <option value={3 / 4}>3:4</option>
            </select>
          </div>

          {/* ACTIONS */}
          <div className="mt-6 flex justify-end gap-4">
            <button
              onClick={resetFilters}
              className="px-4 py-2 bg-gray-300 rounded"
            >
              Reset
            </button>
            <button
              onClick={handleCropAndSave}
              className="px-4 py-2 bg-blue-600 text-white rounded"
            >
              Crop & Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

/* --------------------------------------------------------
   RANGE HELPER
-------------------------------------------------------- */

type RangeProps = {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (value: number) => void;
};

const Range = ({
  label,
  value,
  min,
  max,
  step = 1,
  onChange,
}: RangeProps) => (
  <div className="flex items-center gap-3">
    <label className="w-24">{label}</label>
    <input
      type="range"
      min={min}
      max={max}
      step={step}
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      className="w-full"
    />
  </div>
);
