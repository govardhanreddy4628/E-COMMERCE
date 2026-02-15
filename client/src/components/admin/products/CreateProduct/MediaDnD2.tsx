import { Upload } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../../ui/card";
import { IoMdTrash } from "react-icons/io";
import { RiImageEditLine } from "react-icons/ri";
import { useState } from "react";
import React from "react";

import { toast } from "../../../../hooks/use-toast";
import { uploadFileDirect } from "../../utils/cloudinaryUpload";
import { DndContext, closestCenter, DragEndEvent } from "@dnd-kit/core";
import { SortableContext, arrayMove, useSortable, rectSortingStrategy, } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { ImgEditModal } from "./ImgEditModal2";
//import { deleteCloudinaryImage } from "../../utils/cloudinaryDelete";

// interface MediaProps {
//     uploadedImages: UploadedImage[];
//     setUploadedImages: React.Dispatch<React.SetStateAction<UploadedImage[]>>;
//     removeImage: (index: number) => void;
//     MAX_IMAGES: number;
// }

interface MediaProps {
  uploadedImages: UploadedImage[];
  setUploadedImages: React.Dispatch<React.SetStateAction<UploadedImage[]>>;
  removeImage: (id: string) => void;
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

    const [previewIndex, setPreviewIndex] = useState<number | null>(null);

    /* ---------- DRAG END ---------- */
    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        if (!over || active.id === over.id) return;

        setUploadedImages((prev) => {
            const oldIndex = prev.findIndex((i) => i.id === active.id);
            const newIndex = prev.findIndex((i) => i.id === over.id);

            // const activeImg = prev[oldIndex];

            // // 🚫 Prevent moving cover beyond index 2
            // if (activeImg.role === "cover" && newIndex > 2) {
            //     toast({
            //         title: "Cover image must stay in top positions",
            //         variant: "destructive",
            //     });
            //     return prev;
            // }

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

    const SortableImage = React.memo(({ img, index }: { img: UploadedImage; index: number }) => {
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
                        onClick={() => removeImage(img.id)}
                        title="Remove"
                    >
                        <IoMdTrash />
                    </span>
                </div>
            </div>
        );
    });

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
                    {/* {previewIndex !== null && uploadedImages[previewIndex] &&(
                        <ImgEditModal
                            image={uploadedImages[previewIndex]}
                            onClose={() => setPreviewIndex(null)}
                            onSave={(file, url) => {
                                setUploadedImages(prev => {
                                    const copy = [...prev];
                                    copy[previewIndex] = {
                                        ...copy[previewIndex],
                                        file,
                                        url,
                                        uploadedAt: new Date(),
                                    };
                                    return copy;
                                });
                                setPreviewIndex(null);
                            }}
                        />
                    )} */}


                    {previewIndex !== null && uploadedImages[previewIndex] && (
                        <ImgEditModal
                            image={uploadedImages[previewIndex]}
                            onClose={() => setPreviewIndex(null)}
                            onSave={async (file) => {
                                try {
                                    // 1️⃣ Upload new image FIRST
                                    const res = await uploadFileDirect(file);

                                    if (!res?.url || !res?.public_id) {
                                        throw new Error("Upload failed");
                                    }

                                    // 2️⃣ Update UI
                                    setUploadedImages(prev => {
                                        if (previewIndex === null) return prev;

                                        const copy = [...prev];
                                        const old = copy[previewIndex];
                                        if (!old) return prev;

                                        if (old.file && old.url.startsWith("blob:")) {
                                            URL.revokeObjectURL(old.url);
                                        }

                                        copy[previewIndex] = {
                                            ...old,
                                            file: undefined,
                                            public_id: res.public_id,
                                            url: `${res.url}?v=${Date.now()}`,
                                            width: res.width,
                                            height: res.height,
                                            format: res.format,
                                            size: res.size,
                                            uploadedAt: new Date(),
                                            status: "done",
                                        };

                                        return copy;
                                    });

                                    toast({ title: "Image updated successfully" });
                                } catch (err) {
                                    console.error(err);
                                    toast({
                                        title: "Failed to update image",
                                        variant: "destructive",
                                    });
                                } finally {
                                    setPreviewIndex(null);
                                }
                            }}

                        />
                    )}

                </CardContent>
            </Card>

        </div>
    )
};

