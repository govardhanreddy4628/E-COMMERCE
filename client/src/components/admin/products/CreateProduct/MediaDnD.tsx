import { Upload } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../../ui/card";
import { IoMdTrash } from "react-icons/io";
import { RiImageEditLine } from "react-icons/ri";
import { useState, useCallback } from "react";
import { ImgEditModal } from './ImgEditModal';
import { Area } from 'react-easy-crop';
import { toast } from "../../../../hooks/use-toast";
import { uploadFileDirect } from "../../utils/cloudinaryUpload";
import { DndContext, closestCenter, DragEndEvent } from "@dnd-kit/core";
import { SortableContext, arrayMove, useSortable, rectSortingStrategy, } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface MediaProps {
    uploadedImages: UploadedImage[];
    setUploadedImages: React.Dispatch<React.SetStateAction<UploadedImage[]>>;
    removeImage: (index: number) => void;
    MAX_IMAGES: number;
}

export interface UploadedImage {
    id: string; // REQUIRED for DnD
    public_id: string;
    url: string;
    width: number;
    height: number;
    format: string;
    size: number;
    originalName: string;
    uploadedAt: Date;
    file?: File;

    progress?: number;
    status?: "uploading" | "done" | "error";
    role?: "cover" | "thumbnail" | "gallery";
}


/* ---------------- HELPERS ---------------- */

const assignRoleByIndex = (index: number): UploadedImage["role"] => {
    if (index === 0 || index === 1) return "thumbnail";
    if (index === 2) return "cover";
    return "gallery";
};


export default function Media({ uploadedImages, setUploadedImages, removeImage, MAX_IMAGES }: MediaProps) {

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

        const current = uploadedImages[previewIndex];

        // Get a usable image URL — from File or Cloudinary
        const imageUrl = current.file
            ? URL.createObjectURL(current.file)
            : current.url;

        const result = await getCroppedImg(imageUrl, croppedAreaPixels, rotate, {
            brightness,
            contrast,
            grayscale,
        });

        // Replace with new cropped file and updated URL
        const newImages = [...uploadedImages];
        newImages[previewIndex] = {
            ...current,
            file: result.file,
            url: result.url,
            uploadedAt: new Date(),
        };

        setUploadedImages(newImages);
        setPreviewIndex(null);
    };

/////////////////////////////////////////////////////////////////////////////
    /* ---------- DRAG END ---------- */

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        if (!over || active.id === over.id) return;

        setUploadedImages((prev) => {
            const oldIndex = prev.findIndex((i) => i.id === active.id);
            const newIndex = prev.findIndex((i) => i.id === over.id);

            const reordered = arrayMove(prev, oldIndex, newIndex);

            return reordered.map((img, idx) => ({
                ...img,
                role: assignRoleByIndex(idx),
            }));
        });
    };


    const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {

        const files = Array.from(event.target.files || []);
        if (!files.length) return;

        const validImageTypes = ["image/jpeg", "image/png", "image/webp"];

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
                    (img) => img.originalName === file.name && img.size === file.size
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

        if (validFiles.length === 0) return;

        const previews: UploadedImage[] = validFiles.map((file, idx) => {
            const position = uploadedImages.length + idx;

            return {
                id: crypto.randomUUID(),
                public_id: "",
                url: URL.createObjectURL(file),
                width: 0,
                height: 0,
                format: file.type,
                size: file.size,
                originalName: file.name,
                uploadedAt: new Date(),
                file,
                status: "uploading",
                role: assignRoleByIndex(position),
            };
        });

        setUploadedImages((prev) => [...prev, ...previews]);


        validFiles.forEach(async (file) => {
            try {
                const res = await uploadFileDirect(file); // Cloudinary upload
                // const finalRes = { ...res, file, originalName: file.name, size: file.size, uploadedAt: new Date() } as UploadedImage;
                setUploadedImages((prev) =>
                    prev.map((img) =>
                        img.originalName === file.name
                            ? { ...img, ...res, url: res?.url || img.url, file, status: "done", originalName: file.name, size: file.size, uploadedAt: new Date(), }
                            : img
                    )
                );
                //remove this toast later as it toasting for every image uploaded
                toast({
                    title: "Upload successful",
                    description: `${validFiles.length} image(s) uploaded.`,
                });

            } catch (err) {
                console.error("Upload error:", err);
                setUploadedImages((prev) =>
                    prev.map((img) =>
                        img.originalName === file.name
                            ? { ...img, status: "error" }
                            : img
                    )
                );
                toast({
                    title: "Upload failed",
                    description: "Something went wrong while uploading images.",
                    variant: "destructive",
                });

                // reset input
                event.target.value = "";
            }
        });
    }


    /* ---------------- MEMORY CLEANUP ---------------- */

    // useEffect(() => {
    //     return () => {
    //         uploadedImages.forEach((img) => {
    //             if (img.file) URL.revokeObjectURL(img.url);
    //         });
    //     };
    // }, [uploadedImages]);


    /* ---------- SORTABLE ITEM ---------- */

    const SortableImage = ({ img, index }: { img: UploadedImage; index: number }) => {
        const { attributes, listeners, setNodeRef, transform, transition } =
            useSortable({ id: img.id });
            console.log(img)

        return (
            <div ref={setNodeRef} style={{ transform: CSS.Transform.toString(transform), transition }} {...attributes}
                className="group relative rounded-xl border p-2">
                <img src={img.url}
                    alt={img.originalName}
                    className="rounded-lg max-h-[140px] mx-auto max-w-full dark:bg-transparent cursor-grab"
                    {...listeners}
                />
                {/* ROLE BADGE */}
                {img.role !== "gallery" && (
                    <span className="absolute top-1 left-1 bg-black text-white text-xs px-2 py-0.5 rounded">
                        {img.role?.toUpperCase()}
                    </span>
                )}

                {img.status === "uploading" && (
                    <div className="absolute bottom-1 left-1 right-1 h-1 bg-gray-300">
                        <div
                            className="h-full bg-blue-600"
                            style={{ width: `${img.progress}%` }}
                        />
                    </div>
                )}

                <div className="absolute top-2 right-2 bg-[#858181ba] group-hover:flex hidden text-xl flex-col gap-1 rounded-full">
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
        );
    };

    return (
        <div>
            <Card>
                <CardHeader>
                    <CardTitle>Product Images</CardTitle>
                    <CardDescription>
                        Upload high-quality images of your product (max 8 images, 5MB each). 1 Cover, up to 2 Thumbnails, drag to reorder
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <DndContext
                        collisionDetection={closestCenter}
                        onDragEnd={handleDragEnd}
                    >
                        <SortableContext
                            items={uploadedImages.map((i) => i.id)}
                            strategy={rectSortingStrategy}
                        >
                            <div className="grid grid-cols-4 sm:grid-cols-4 lg:grid-cols-4 xl:grid-cols-4 gap-2 ">
                                {uploadedImages.map((img, index) => (
                                    <SortableImage
                                        key={img.id}
                                        img={img}
                                        index={index}
                                    >
                                    </SortableImage>
                                ))}


                                {uploadedImages.length < MAX_IMAGES && (
                                    <label className={`upload upload-draggable hover:border-primary border border-dashed border-gray-300 rounded-lg cursor-pointer flex justify-center items-center px-4 py-2 min-h-[130px] ${uploadedImages.length === 0 ? "lg:col-span-2 w-full h-[160px]" : ""}`}>
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

                        </SortableContext>
                    </DndContext>

                    <p className="mt-4 text-sm text-gray-500">
                        Image formats: <strong>.jpg, .jpeg, .png</strong>, preferred size: 1:1, file size
                        is restricted to a maximum of 500kb.
                    </p>

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
                </CardContent>
            </Card>

        </div>
    )
};

