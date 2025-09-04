import React, { useState } from 'react'
import CloseIcon from '@mui/icons-material/Close';
import { Box, Button, Grid, IconButton, Typography } from '@mui/material';

const UploadImg = () => {
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    const [image, setImg] = useState<File | null>(null);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImg(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleRemoveImage = () => {
        setImg(null as File | null);
        setImagePreview(null);
    };
    return (
        <div>
            {/* ✅ Image Preview      small=================================== */}
            <Grid item xs={4}>
                {imagePreview && (
                    <Box
                        sx={{
                            position: 'relative',
                            width: '100%',
                            height: 200,
                            mb: 2,
                            borderRadius: 2,
                            overflow: 'hidden',
                        }}
                    >
                        <img
                            src={imagePreview}
                            alt="Preview"
                            style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover',
                                borderRadius: 8,
                            }}
                        />
                        <IconButton
                            size="small"
                            onClick={handleRemoveImage}
                            sx={{
                                position: 'absolute',
                                top: 8,
                                right: 8,
                                bgcolor: 'rgba(0,0,0,0.6)',
                                color: '#fff',
                                '&:hover': {
                                    bgcolor: 'rgba(0,0,0,0.8)',
                                },
                            }}
                        >
                            <CloseIcon fontSize="small" />
                        </IconButton>
                    </Box>
                )}

                <Button variant="contained" component="label" fullWidth>
                    Upload Image
                    <input
                        type="file"
                        hidden
                        accept="image/*"
                        onChange={handleImageChange}
                    />
                </Button>
                {image && (
                    <Typography variant="body2" mt={1} >
                        Selected: {image.name}
                    </Typography>
                )}
            </Grid>
            {/* ✅ Image Preview      small=================================== */}
        </div>
    )
}

export default UploadImg
