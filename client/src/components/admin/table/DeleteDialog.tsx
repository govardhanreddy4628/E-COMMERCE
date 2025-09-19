import { useState } from "react";
import { toast } from "../../../hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../../../ui/alert-dialog";

interface DeleteDialogProps {
  trigger: React.ReactNode;
  selectedIds: (string | number)[];
  resourceName?: string; // "customer(s)" by default
  deleteUrl: string; // API endpoint
  onDeleted?: () => void; // callback after delete
}

const DeleteDialog: React.FC<DeleteDialogProps> = ({
  trigger,
  selectedIds,
  resourceName = "customer(s)",
  deleteUrl,
  onDeleted,
}) => {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (selectedIds.length === 0) {
      toast({
        title: "Nothing selected",
        description: `Please select at least one ${resourceName} before deleting.`,
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(deleteUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: selectedIds }),
      });

      if (!res.ok) throw new Error("Failed to delete");

      toast({
        title: "Deleted successfully",
        description: `Removed ${selectedIds.length} ${resourceName}.`,
      });

      onDeleted?.();
    } catch (err) {
      toast({
        title: "Delete failed",
        description: (err as Error).message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete{" "}
            <span className="font-semibold">{selectedIds.length}</span>{" "}
            {resourceName}? This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={loading}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={loading}
            className="bg-red-600 text-white hover:bg-red-700"
          >
            {loading ? "Deleting..." : "Confirm"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteDialog;
