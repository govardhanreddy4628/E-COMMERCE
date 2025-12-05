import { Button, TextField } from "@mui/material";

const MyProfile = () => {
  return (
    <>
      <h1 className="text-xl font-semibold mb-4">My Profile</h1>
        <hr className="my-4" />

        <div className="flex flex-col gap-5 mb-6">
          <TextField label="Full Name" />
          <TextField label="Email" />
          <TextField label="Phone Number" />
        </div>

        <div className="flex gap-4">
          <Button variant="contained" className="!rounded-none !bg-red-400">
            Save
          </Button>
          <Button variant="outlined" className="!rounded-none">
            Cancel
          </Button>
        </div>
    </>
  );
};
export default MyProfile;
