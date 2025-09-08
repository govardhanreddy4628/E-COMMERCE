import { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import { Area } from 'react-easy-crop';

import {
  Box, Button, TextField, Typography, MenuItem,
  Paper, Grid, InputLabel, Select, FormControl,
} from '@mui/material';
import ReactQuill from '../../ReactQuillWrapper';
import 'react-quill/dist/quill.snow.css';
import { useTheme } from '../../../../context/themeContext';
import { IoMdEye, IoMdTrash } from "react-icons/io";
import { FiUploadCloud } from "react-icons/fi";
import { SelectChangeEvent } from '@mui/material';
import { IoMdClose } from "react-icons/io";


const categories = ['Electronics', 'Fassion', 'Groceries', 'Bags', 'Footware', 'wellness', 'jewellery'];
const MAX_IMAGES = 8;

const CreateProduct: React.FC = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [product, setProduct] = useState({
    name: '',
    id: '',
    description: '',
    price: '',
    category: '',
    stock: '',
    image: null as File | null,
  });



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

  const [images, setImages] = useState<File[]>([]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const newImages = files.slice(0, MAX_IMAGES - images.length);
    setImages((prev) => [...prev, ...newImages]);
  };

  const handleRemoveImage2 = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };



  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setProduct({ ...product, [e.target.name]: e.target.value });
  };

  const handleCategoryChange = (e: SelectChangeEvent<string>) => {
    setProduct({ ...product, category: e.target.value });
  };


  const handleDescriptionChange = (value: string) => {
    setProduct({ ...product, description: value });
  };


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Product Submitted:', product);
    // TODO: Submit to backend
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



  return (
    <>
      <Paper
        sx={{
          mx: 'auto',
          p: 4,
          bgcolor: isDark ? '#121212' : '#fff',
          color: isDark ? '#fff' : '#000',
          minHeight: '100vh',
        }}
      >
        <Typography variant="h6" mb={2}>Add New Product</Typography>

        <Box component="form" onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <TextField
                label="Product Name"
                name="name"
                fullWidth
                required
                value={product.name}
                onChange={handleChange}
                variant="outlined"
                InputProps={{
                  sx: {
                    backgroundColor: isDark ? '#1e1e1e' : '#fff',
                    color: isDark ? '#fff' : '#000',
                  },
                }}
                InputLabelProps={{
                  sx: { color: isDark ? '#ccc' : '#555' },
                }}
              />
            </Grid>



            <Grid item xs={12}>
              <div className="card card-border " role="presentation">
                <div className="card-body">
                  <h4 className="mb-2 font-semibold text-lg">Product Image</h4>
                  <p>Choose a product photo or simply drag and drop up to 5 photos here.</p>

                  <div className="mt-4">
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-2 ">
                      {images.map((img, index) => (
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
                              className="text-gray-100 hover:text-gray-300 cursor-pointer p-1.5"
                              title="Preview"
                              onClick={() => setPreviewIndex(index)}
                            >
                              <IoMdEye />
                            </span>
                            <span
                              className="text-gray-100 hover:text-gray-300 cursor-pointer p-1.5"
                              onClick={() => handleRemoveImage2(index)}
                              title="Remove"
                            >
                              <IoMdTrash />
                            </span>
                          </div>
                        </div>
                      ))}

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

                      {/* Upload Input */}
                      {images.length < MAX_IMAGES && (
                        <label className={`"upload upload-draggable hover:border-primary border border-dashed border-gray-300 rounded-lg cursor-pointer flex justify-center items-center px-4 py-2 min-h-[130px]" ${images.length === 0 ? "lg:col-span-2 h-[160px]" : ""}`}>
                          <input
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={handleImageUpload}
                            className="hidden"
                          />
                          <div className="flex flex-col justify-center items-center text-center">
                            <div className="text-[50px] text-gray-600">
                              <FiUploadCloud />
                            </div>
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
                  </div>

                  <p className="mt-4 text-sm text-gray-500">
                    Image formats: <strong>.jpg, .jpeg, .png</strong>, preferred size: 1:1, file size
                    is restricted to a maximum of 500kb.
                  </p>
                </div>
              </div>
            </Grid>

            <Grid item xs={12}>
              <Typography variant="subtitle1" gutterBottom>
                Description
              </Typography>
              <ReactQuill
                theme="snow"
                value={product.description}
                onChange={handleDescriptionChange}
                style={{
                  backgroundColor: isDark ? '#1e1e1e' : '#fff',
                  color: isDark ? '#fff' : '#000',
                  border: isDark ? '1px solid #444' : '1px solid #ccc',
                  borderRadius: '4px',
                }}
              />
            </Grid>     

          
            <Grid item xs={6}>
              <FormControl fullWidth variant="outlined">
                <InputLabel sx={{ color: isDark ? '#ccc' : '#555' }}>Category</InputLabel>
                <Select
                  value={product.category}
                  label="Category"
                  onChange={handleCategoryChange}
                  sx={{
                    backgroundColor: isDark ? '#1e1e1e' : '#fff',
                    color: isDark ? '#fff' : '#000',
                  }}
                >
                  {categories.map((cat) => (
                    <MenuItem key={cat} value={cat}>
                      {cat}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>


            <Grid item xs={6}>
              <TextField
                label="Category Id"
                name="CID"
                fullWidth
                required
                value={product.id}
                onChange={handleChange}
                variant="outlined"
                InputProps={{
                  sx: {
                    backgroundColor: isDark ? '#1e1e1e' : '#fff',
                    color: isDark ? '#fff' : '#000',
                  },
                }}
                InputLabelProps={{
                  sx: { color: isDark ? '#ccc' : '#555' },
                }}
              />
            </Grid>


            <Grid item xs={6}>
              <FormControl fullWidth variant="outlined">
                <InputLabel sx={{ color: isDark ? '#ccc' : '#555' }}>Sizes</InputLabel>
                <Select
                  value={product.category}
                  label="Category"
                  onChange={handleCategoryChange}
                  sx={{
                    backgroundColor: isDark ? '#1e1e1e' : '#fff',
                    color: isDark ? '#fff' : '#000',
                  }}
                >
                  {categories.map((cat) => (
                    <MenuItem key={cat} value={cat}>
                      {cat}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>


            <Grid item xs={6}>
              <TextField
                label="Color"
                name="Color"
                fullWidth
                required
                value={product.id}
                onChange={handleChange}
                variant="outlined"
                InputProps={{
                  sx: {
                    backgroundColor: isDark ? '#1e1e1e' : '#fff',
                    color: isDark ? '#fff' : '#000',
                  },
                }}
                InputLabelProps={{
                  sx: { color: isDark ? '#ccc' : '#555' },
                }}
              />
            </Grid>


            <Grid item xs={6}>
              <Button type="submit" variant="contained" color="primary" fullWidth >
                Add Product
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </>
  );
};

export default CreateProduct;
