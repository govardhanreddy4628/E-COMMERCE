import React, { useState } from 'react';
import axios from 'axios';
import { TextField } from '@mui/material';

const AdProductUploadForm: React.FC = () => {
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState<number>(0);
  const [desc, setDesc] = useState('');

  const [thumb, setThumb] = useState<File | null>(null);
  const [thumbPreview, setThumbPreview] = useState<string | null>(null);

  const [gallery, setGallery] = useState<File[]>([]);
  const [galleryPreviews, setGalleryPreviews] = useState<string[]>([]);

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setThumb(file);
      setThumbPreview(URL.createObjectURL(file));
    }
  };

  const handleGalleryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if(files && files.length>5){alert("you can't upload morethan 5 images")}
    if (files) {
      const selectedFiles = Array.from(files).slice(0, 5); // Limit to 5
      setGallery(selectedFiles);
      setGalleryPreviews(selectedFiles.map(f => URL.createObjectURL(f)));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!thumb || !title || !price) {
      return alert('Title, price, and thumbnail are required.');
    }

    const form = new FormData();
    console.log(form)
    form.append('title', title);
    form.append('price', price.toString());
    form.append('description', desc);
    form.append('thumbnail', thumb);
    gallery.forEach(f => form.append('gallery', f));

    try {
        await axios.post('/api/products', form, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      alert('Product uploaded!');
      // Reset form
      setTitle('');
      setPrice(0);
      setDesc('');
      setThumb(null);
      setThumbPreview(null);
      setGallery([]);
      setGalleryPreviews([]);
    } catch (e: unknown) {
      if (axios.isAxiosError(e)) {
        alert(e.response?.data?.message || 'Upload error');
      } else {
        alert('Upload error');
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: 32 }}>
      <div>
        <TextField
          type="text"
          placeholder="Product Title"
          value={title}
          onChange={e => setTitle(e.target.value)}
          required
        />
      </div>
      <div>
        <TextField
          type="number"
          placeholder="Price"
          value={price}
          onChange={e => setPrice(parseFloat(e.target.value))}
          required
        />
      </div>
      <div>
        <textarea
          placeholder="Description"
          value={desc}
          onChange={e => setDesc(e.target.value)}
        />
      </div>

      {/* Thumbnail Upload */}
      <div>
        <label>Thumbnail:</label>
        <input type="file" accept="image/*" onChange={handleThumbnailChange} required />
        {thumbPreview && (
          <div style={{ marginTop: 8 }}>
            <strong>Preview:</strong>
            <img src={thumbPreview} alt="Thumbnail Preview" style={{ width: 120, height: 120, objectFit: 'cover', border: '1px solid #ccc' }} />
          </div>
        )}
      </div>

      {/* Gallery Upload */}
      <div style={{ marginTop: 16 }}>
        <label>Gallery Images (max 5):</label>
        <input type="file" accept="image/*" multiple onChange={handleGalleryChange} />
        <p>{gallery.length} image{gallery.length !== 1 ? 's' : ''} selected</p>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {galleryPreviews.map((src, i) => (
            <img key={i} src={src} alt={`Preview ${i}`} style={{ width: 80, height: 80, objectFit: 'cover', border: '1px solid #ccc' }} />
          ))}
        </div>
      </div>

      <button type="submit" style={{ marginTop: 16 }}>Upload Product</button>
    </form>
  );
};

export default AdProductUploadForm;
