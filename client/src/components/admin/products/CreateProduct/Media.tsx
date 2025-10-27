import { Upload } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../../ui/card";
import { IoMdTrash } from "react-icons/io";
import { RiImageEditLine } from "react-icons/ri";
import { useState, useCallback } from "react";
import { ImgEditModal } from './ImgEditModal';
import { Area } from 'react-easy-crop';
import { toast } from "../../../../hooks/use-toast";

interface MediaProps {
  uploadedImages: File[];
  removeImage: (index: number) => void;
  MAX_IMAGES: number;
  setUploadedImages: React.Dispatch<React.SetStateAction<File[]>>;
}


const Media: React.FC<MediaProps> = ({ uploadedImages, setUploadedImages, removeImage, MAX_IMAGES }) => {

    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [previewIndex, setPreviewIndex] = useState<number | null>(null);
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
    const [aspect, setAspect] = useState<number>(4 / 3);

    const handleResetFilters = () => {
        setBrightness(100);
        setContrast(100);
        setGrayscale(0);
        setRotate(0);
        setZoom(1);
    };

    const onCropComplete = useCallback(
        (_croppedArea: Area, croppedAreaPixels: Area) => {            // _ this symbol Tells TypeScript and linters: “Yes, I know this argument exists, but I’m intentionally not using it.”
            setCroppedAreaPixels(croppedAreaPixels);
        },
        []
    );

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
        tempCtx.filter = `brightness(${filters.brightness ?? 100}%) contrast(${filters.contrast ?? 100}%) grayscale(${filters.grayscale ?? 0}%)`;

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
            !uploadedImages[previewIndex]
        ) {
            console.warn("Cannot crop: Missing image or crop area");
            return;
        }

        const imageFile = uploadedImages[previewIndex];
        const imageUrl = URL.createObjectURL(imageFile);

        const result = await getCroppedImg(imageUrl, croppedAreaPixels, rotate, {
            brightness,
            contrast,
            grayscale,
        });

        // Update image state with cropped file
        const newImages = [...uploadedImages];
        newImages[previewIndex] = result.file;
        setUploadedImages(newImages);

        setPreviewIndex(null); // Close modal
    };


    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const validImageTypes = ["image/jpeg", "image/png", "image/webp"];

    if (!files.length) return;

    let validFiles = files.filter((file) => {
      if (!validImageTypes.includes(file.type)) {
        toast({
          title: "Invalid file type",
          description: "Please upload only JPEG, PNG, or WebP images.",
          variant: "destructive",
        });
        return false;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please upload images smaller than 5MB.",
          variant: "destructive",
        });
        return false;
      }
      return true;
    });

    // Remove duplicates by name + size
    validFiles = validFiles.filter(
      (file) =>
        !uploadedImages.some(
          (img) => img.name === file.name && img.size === file.size
        )
    );

    // Enforce max limit
    if (uploadedImages.length + validFiles.length > MAX_IMAGES) {
      toast({
        title: "Image limit reached",
        description: `You can only upload up to ${MAX_IMAGES} images.`,
        variant: "destructive",
      });
      validFiles = validFiles.slice(0, MAX_IMAGES - uploadedImages.length);
    }

    if (validFiles.length) {
      setUploadedImages((prev) => [...prev, ...validFiles]);
    }

    // Reset input so same file can be selected again
    event.target.value = "";
  };


    return (
        <div>
            <Card>
                <CardHeader>
                    <CardTitle>Product Images</CardTitle>
                    <CardDescription>
                        Upload high-quality images of your product (max 10 images, 5MB each)
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="grid grid-cols-4 sm:grid-cols-4 lg:grid-cols-4 xl:grid-cols-4 gap-2 ">
                        {uploadedImages.map((img, index) => (
                            <div
                                key={index}
                                className="group relative rounded-xl border border-gray-200 dark:border-gray-600 p-2 flex grid-cols-1"
                            >
                                <img
                                    src={URL.createObjectURL(img)}
                                    alt={img.name}
                                    className="rounded-lg max-h-[140px] mx-auto max-w-full dark:bg-transparent"
                                />


                                <div className="absolute inset-2 bg-[#000000ba] group-hover:flex hidden text-xl items-center justify-center gap-2">
                                    <span
                                        className="text-gray-100 hover:text-green-500 cursor-pointer p-1.5"
                                        title="Edit"
                                        onClick={() => setPreviewIndex(index)}
                                    >
                                        <RiImageEditLine />

                                    </span>
                                    <span
                                        className="text-gray-100 hover:text-red-500 cursor-pointer p-1.5"
                                        onClick={() => removeImage(index)}
                                        title="Remove"
                                    >
                                        <IoMdTrash />
                                    </span>
                                </div>
                            </div>
                        ))}

                        {/* Modal */}
                        {previewIndex !== null && (
                            <ImgEditModal image={uploadedImages[previewIndex]} onClose={() => setPreviewIndex(null)}
                                crop={crop} zoom={zoom} rotate={rotate} aspect={aspect}
                                brightness={brightness} contrast={contrast} grayscale={grayscale}
                                onCropChange={setCrop} onZoomChange={setZoom} onRotationChange={setRotate} onAspectChange={setAspect}
                                onBrightnessChange={setBrightness} onContrastChange={setContrast} onGrayscaleChange={setGrayscale}
                                onCropComplete={onCropComplete}
                                onResetFilters={handleResetFilters}
                                onCropAndSave={handleCropAndSave} />
                        )}
                        {uploadedImages.length < MAX_IMAGES && (

                            <label className={`"upload upload-draggable hover:border-primary border border-dashed border-gray-300 rounded-lg cursor-pointer flex justify-center items-center px-4 py-2 min-h-[130px]" ${uploadedImages.length ? "lg:col-span-2 h-[160px]" : ""}`}>
                                <input
                                    type="file"
                                    accept="image/*"
                                    multiple
                                    onChange={handleImageUpload}
                                    className="hidden"
                                />
                                <div className="flex flex-col justify-center items-center text-center">
                                    <Upload className="mx-auto h-6 w-6 lg:h-12 lg:w-12 text-muted-foreground lg:mb-4 mb-2" />
                                    <h4 className="lg:text-lg lg:font-medium text-sm">Upload Images</h4>
                                    <p className="text-xs mt-1">
                                        <span className="text-gray-800 dark:text-white">
                                            Drop your image here, or{" "}
                                        </span>
                                        <span className="text-primary font-semibold">Click to browse</span>
                                    </p>
                                </div>
                            </label>
                        )}
                    </div>

                    {/* {uploadedImages.length > 0 && (
                        <div className="space-y-4">
                            <h4 className="font-medium">Uploaded Images ({uploadedImages.length}/10)</h4>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {uploadedImages.map((file, index) => (
                                    <div key={index} className="relative group">
                                        <div className="aspect-square rounded-lg overflow-hidden bg-muted border">
                                            <img
                                                src={URL.createObjectURL(file)}
                                                alt={`Product image ${index + 1}`}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <Button
                                            type="button"
                                            variant="destructive"
                                            size="icon"
                                            className="absolute -top-2 -right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                                            onClick={() => removeImage(index)}
                                        >
                                            <X className="h-3 w-3" />
                                        </Button>
                                        {index === 0 && (
                                            <Badge className="absolute bottom-2 left-2 text-xs">
                                                Main
                                            </Badge>
                                        )}
                                    </div>
                                ))}
                            </div>
                            <p className="text-sm text-muted-foreground">
                                The first image will be used as the main product image
                            </p>
                        </div>
                    )} */}

                    <p className="mt-4 text-sm text-gray-500">
                    Image formats: <strong>.jpg, .jpeg, .png</strong>, preferred size: 1:1, file size
                    is restricted to a maximum of 500kb.
                  </p>
                </CardContent>
            </Card>
        </div>
    )
}

export default Media
