import { useState } from "react";
import api from "../../api/api_utility";
import toast from "react-hot-toast";

const InviteAdmin = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleInvite = async () => {
    if (!email) {
      toast.error("Email required");
      return;
    }

    setLoading(true);
    try {
      await api.post("/api/v1/admin/invite", { email });
      toast.success("Admin invite sent");
      setEmail("");
    } catch (err: any) {
      toast.error(
        err?.response?.data?.message || "Failed to send invite"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md bg-white p-6 rounded-xl shadow">
      <h2 className="text-xl font-bold mb-4">Invite Admin</h2>

      <input
        type="email"
        placeholder="Admin email"
        className="w-full border p-2 rounded mb-4"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <button
        onClick={handleInvite}
        disabled={loading}
        className="w-full bg-black text-white py-2 rounded"
      >
        {loading ? "Sending..." : "Send Invite"}
      </button>
    </div>
  );
};

export default InviteAdmin;
