import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Avatar, Button, TextField, Typography, Switch,
  Dialog, DialogTitle, DialogContent, DialogActions, List, ListItem
} from "@mui/material";
import { RootState, AppDispatch } from "../../redux/store";
import {fetchAdmin, updateProfile, uploadAvatar /* add other thunks */} from "../../redux/slices/adminSlice";
import { useForm } from "react-hook-form";
import { useDropzone } from "react-dropzone";

type FormData = { name: string; email: string };

const AdminProfile: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { admin, activityLog, loading } = useSelector((s: RootState) => s.admin);

  const [editOpen, setEditOpen] = useState(false);
  const { register, handleSubmit, reset } = useForm<FormData>();

  useEffect(() => {
    dispatch(fetchAdmin());
  }, [dispatch]);

  useEffect(() => {
    if (admin) reset({ name: admin.name, email: admin.email });
  }, [admin, reset]);

  const onSubmit = (data: FormData) => {
    dispatch(updateProfile(data)).then(() => setEditOpen(false));
  };

  const onDrop = (files: File[]) => {
    dispatch(uploadAvatar(files[0]));
  };
  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  if (loading || !admin) return <Typography>Loading...</Typography>;

  return (
    <div style={{ maxWidth: 600, margin: "auto", padding: 20 }}>
      <Typography variant="h4">Admin Profile</Typography>
      <Avatar src={admin.avatarUrl} sx={{ width: 100, height: 100, mt: 2 }} />
      <div {...getRootProps()} style={{ marginTop: 10, cursor: "pointer" }}>
        <input {...getInputProps()} />
        <Button variant="outlined">Change Avatar</Button>
      </div>

      <Typography>Name: {admin.name}</Typography>
      <Typography>Email: {admin.email}</Typography>
      <Typography>Role: {admin.role}</Typography>

      <div style={{ marginTop: 20 }}>
        <Button variant="contained" onClick={() => setEditOpen(true)}>Edit Profile</Button>
      </div>

      {/* 2FA toggle */}
      <div style={{ marginTop: 20 }}>
        <Typography component="span">Two-Factor Auth </Typography>
        <Switch
          checked={admin.twoFAEnabled}
          onChange={() =>
            dispatch(updateProfile({ twoFAEnabled: !admin.twoFAEnabled }))
          }
        />
      </div>

      {/* Password Change & Activity Log */}
      <ChangePasswordDialog />
      <ActivityLogList logs={activityLog} />

      {/* Edit Profile Dialog */}
      <Dialog open={editOpen} onClose={() => setEditOpen(false)}>
        <DialogTitle>Edit Profile</DialogTitle>
        <DialogContent>
          <form id="editForm" onSubmit={handleSubmit(onSubmit)}>
            <TextField {...register("name")} label="Name" fullWidth margin="normal" />
            <TextField {...register("email")} label="Email" fullWidth margin="normal" />
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditOpen(false)}>Cancel</Button>
          <Button type="submit" form="editForm">Save</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

// Placeholder for password change dialog
const ChangePasswordDialog = () => {
  /* similar form/dialog logic for old/new passwords */
  return null;
};

// Activity log list
const ActivityLogList: React.FC<{ logs: { timestamp: string; action: string }[] }> = ({ logs }) => (
  <>
    <Typography variant="h6" style={{ marginTop: 20 }}>Activity Log</Typography>
    <List dense>
      {logs.map((log, i) => (
        <ListItem key={i}>
          <Typography variant="body2">
            {new Date(log.timestamp).toLocaleString()}: {log.action}
          </Typography>
        </ListItem>
      ))}
    </List>
  </>
);

export default AdminProfile;
