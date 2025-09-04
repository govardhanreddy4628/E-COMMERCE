import { useState, useCallback } from 'react';
import { Area } from 'react-easy-crop';
import Cropper from 'react-easy-crop';
import { IoMdClose } from 'react-icons/io';

interface ImgPreviewModalProps {
    previewIndex: number | null;
    setPreviewIndex: (index: number | null) => void;
}

const ImgPreviewModal = ({previewIndex, setPreviewIndex}: ImgPreviewModalProps) => {
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);

    const [croppedAreaPixels, setCroppedAreaPixels] = useState<{
        x: number;
        y: number;
        width: number;
        height: number;
    } | null>(null);


    // Filters
    const [brightness, setBrightness] = useState(100);
    const [contrast, setContrast] = useState(100);
    const [grayscale, setGrayscale] = useState(0);
    const [rotate, setRotate] = useState(0);


    const [images, setImages] = useState<File[]>([]);

   

        




    // make it separate component if u wish
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
                image.setAttribute('crossOrigin', 'anonymous');
                image.onload = () => resolve(image);
                image.onerror = reject;
                image.src = url;
            });

        const image = await createImage(imageSrc);

        const radians = (rotation * Math.PI) / 180;

        // Calculate bounding box of rotated image
        const sin = Math.abs(Math.sin(radians));
        const cos = Math.abs(Math.cos(radians));
        const newWidth = image.width * cos + image.height * sin;
        const newHeight = image.width * sin + image.height * cos;

        // Create a temporary canvas to draw the rotated image
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = newWidth;
        tempCanvas.height = newHeight;

        const tempCtx = tempCanvas.getContext('2d');
        if (!tempCtx) throw new Error('Could not get canvas context');

        // Apply filters
        tempCtx.filter = `
    brightness(${filters.brightness ?? 100}%)
    contrast(${filters.contrast ?? 100}%)
    grayscale(${filters.grayscale ?? 0}%)
  `;

        // Rotate around center
        tempCtx.translate(newWidth / 2, newHeight / 2);
        tempCtx.rotate(radians);
        tempCtx.drawImage(image, -image.width / 2, -image.height / 2);
        tempCtx.resetTransform?.(); // Optional in modern browsers

        // Now crop from the rotated canvas
        const cropCanvas = document.createElement('canvas');
        cropCanvas.width = pixelCrop.width;
        cropCanvas.height = pixelCrop.height;

        const cropCtx = cropCanvas.getContext('2d');
        if (!cropCtx) throw new Error('Could not get crop canvas context');

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
                if (!blob) throw new Error('Canvas is empty');
                const file = new File([blob], 'cropped-image.jpg', { type: 'image/jpeg' });
                const url = URL.createObjectURL(file);
                resolve({ file, url });
            }, 'image/jpeg');
        });
    };


    const handleCropAndSave = async () => {
        if (
            previewIndex === null ||
            croppedAreaPixels === null ||
            !images[previewIndex]
        ) {
            console.warn("Cannot crop: Missing image or crop area");
            return;
        }

        const imageFile = images[previewIndex];
        const imageUrl = URL.createObjectURL(imageFile);

        const result = await getCroppedImg(imageUrl, croppedAreaPixels, rotate, {
            brightness,
            contrast,
            grayscale,
        });

        // Update image state with cropped file
        const newImages = [...images];
        newImages[previewIndex] = result.file;
        setImages(newImages);

        setPreviewIndex(null); // Close modal
    };

     const onCropComplete = useCallback(
    (_croppedArea: Area, croppedAreaPixels: Area) => {            // _ this symbol Tells TypeScript and linters: “Yes, I know this argument exists, but I’m intentionally not using it.”
      setCroppedAreaPixels(croppedAreaPixels);
    },
    []
  );
    return (
        <div>
            {/* Modal */}
            {previewIndex !== null && (
                <div className="fixed inset-0 z-50 bg-black bg-opacity-80 flex justify-center items-center">
                    <div className='h-[95vh] flex items-cente justify-center max-w-6xl w-full relative p-8'>
                        <button
                            onClick={() => setPreviewIndex(null)}
                            className="absolute top-2 right-2 text-white text-2xl z-10"
                        >
                            <IoMdClose className='text-white dark:text-black' />
                        </button>
                        <div className="relative w-full  h-full bg-white dark:bg-gray-900 p-4 rounded-lg ">
                            <div className="relative h-[50vh]">
                                <Cropper
                                    image={URL.createObjectURL(images[previewIndex])}
                                    crop={crop}
                                    zoom={zoom}
                                    rotation={rotate}
                                    aspect={4 / 3}
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
                                        onChange={(e) => setZoom(Number(e.target.value))}
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
                                        onChange={(e) => setBrightness(Number(e.target.value))}
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
                                        onChange={(e) => setContrast(Number(e.target.value))}
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
                                        onChange={(e) => setGrayscale(Number(e.target.value))}
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
                                        onChange={(e) => setRotate(Number(e.target.value))}
                                        className="w-full"
                                    />
                                </div>
                            </div>

                            {/* Save Button */}
                            <div className="mt-6 text-right">
                                <button className="px-4 py-2 bg-blue-600 text-white rounded" type="button" onClick={handleCropAndSave}>
                                    Crop & Save
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>


    )
}

export default ImgPreviewModal
