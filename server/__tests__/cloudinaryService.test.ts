import { uploadToCloudinary } from '../src/services/cloudinaryService';
import { v2 as cloudinary } from 'cloudinary';

// Mock cloudinary's v2 uploader.upload function
jest.mock('cloudinary', () => ({
  v2: {
    uploader: {
      upload: jest.fn(),
    },
  },
}));

const mockUpload = cloudinary.uploader.upload as jest.Mock;

describe('uploadToCloudinary', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should upload image successfully', async () => {
    const fakeResponse = { secure_url: 'http://cloudinary.com/image.jpg' };
    mockUpload.mockResolvedValueOnce(fakeResponse);

    const result = await uploadToCloudinary('test/path/image.jpg', 'test-folder');

    expect(mockUpload).toHaveBeenCalledWith('test/path/image.jpg', { folder: 'test-folder' });
    expect(result.secure_url).toBe(fakeResponse.secure_url);
  });

  it('should throw error if Cloudinary upload fails', async () => {
    mockUpload.mockRejectedValueOnce(new Error('Upload failed'));

    await expect(uploadToCloudinary('bad/path.jpg')).rejects.toThrow('Cloudinary upload failed: Upload failed');
  });
});
