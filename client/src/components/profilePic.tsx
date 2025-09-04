import { toast } from 'react-toastify';

const ProfilePic = async (file) => {
  const formData = new FormData();
  formData.append('profilePic', file);

  const response = await fetch('/api/user/profile-pic', {
    method: 'PUT',
    body: formData,
    headers: {
      Authorization: `Bearer ${token}`, // token from login
    },
  });

  const result = await response.json();
  if (result.success) {
    toast.success("Profile picture updated!");
  } else {
    toast.error(result.message);
  }
};

export default ProfilePic;
