import { useEffect, useState } from "react";
import { getCollectorPendingPlaces, approveCollectorPlace, rejectCollectorPlace, updateCollectorPlace } from "@/services/admin";
import { useSelector } from "react-redux";

const CollectorTab = ({ darkMode, active }) => {
  const [places, setPlaces] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({
    name: "",
    description: "",
    type: "",
    city: "",
    price: "",
    address: "",
    phone: "",
    website: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const token = useSelector((state) => state.user?.token);

  useEffect(() => {
    if (!active || !token) return;

    const loadPendingPlaces = async () => {
      setLoading(true);
      setError(null);

      const result = await getCollectorPendingPlaces(token);
      if (!result.ok) {
        setError(result.message || "Failed to load pending collector places");
      } else {
        setPlaces(result.places || []);
      }
      setLoading(false);
    };

    loadPendingPlaces();
  }, [active, token]);

  const handleApprove = async (id) => {
    if (!token) return;
    const result = await approveCollectorPlace(id, token);
    if (result.ok) {
      setPlaces((current) => current.filter((place) => place.id !== id));
    } else {
      setError(result.message || "Approve failed");
    }
  };

  const handleReject = async (id) => {
    if (!token) return;
    const reason = window.prompt("Reason for rejection (optional):", "");
    const result = await rejectCollectorPlace(id, reason || null, token);
    if (result.ok) {
      setPlaces((current) => current.filter((place) => place.id !== id));
    } else {
      setError(result.message || "Reject failed");
    }
  };

  const handleEditClick = (place) => {
    setEditingId(place.id);
    setEditForm({
      name: place.name || "",
      description: place.description || "",
      type: place.type || "",
      city: place.city || "",
      price: place.subscriptionPrice ?? "",
      address: place.address || "",
      phone: place.phone || "",
      website: place.website || "",
    });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditForm({
      name: "",
      description: "",
      type: "",
      city: "",
      price: "",
      address: "",
      phone: "",
      website: "",
    });
  };

  const handleChange = (field, value) => {
    setEditForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveEdit = async (id) => {
    if (!token) return;

    const payload = {
      name: editForm.name,
      description: editForm.description,
      type: editForm.type,
      city: editForm.city,
      address: editForm.address,
      phone: editForm.phone,
      website: editForm.website,
      price: editForm.price ? Number(editForm.price) : undefined,
    };

    const result = await updateCollectorPlace(id, payload, token);
    if (result.ok) {
      setPlaces((current) =>
        current.map((place) => (place.id === id ? { ...place, ...result.body.shop } : place)),
      );
      setEditingId(null);
      setError(null);
    } else {
      setError(result.message || "Update failed");
    }
  };

  return (
    <div className={`p-6 ${darkMode ? "bg-zinc-950 text-white" : "bg-white text-slate-900"}`}>
      <h2 className="text-2xl font-semibold mb-4">Collector approvals</h2>
      {error && <div className="mb-4 text-sm text-red-600">{error}</div>}
      {loading ? (
        <div>Loading pending places...</div>
      ) : places.length === 0 ? (
        <div>No pending collector places found.</div>
      ) : (
        <div className="space-y-4">
          {places.map((place) => (
            <div
              key={place.id}
              className={`rounded-xl border p-4 shadow-sm ${darkMode ? "border-zinc-700 bg-zinc-900" : "border-slate-200 bg-slate-50"}`}
            >
              {editingId === place.id ? (
                <div className="space-y-4">
                  <div className="grid gap-3 md:grid-cols-2">
                    <label className="block">
                      <div className="text-sm font-medium mb-1">Name</div>
                      <input
                        className="w-full rounded border px-3 py-2 text-sm"
                        value={editForm.name}
                        onChange={(e) => handleChange("name", e.target.value)}
                      />
                    </label>
                    <label className="block">
                      <div className="text-sm font-medium mb-1">Category</div>
                      <input
                        className="w-full rounded border px-3 py-2 text-sm"
                        value={editForm.type}
                        onChange={(e) => handleChange("type", e.target.value)}
                      />
                    </label>
                    <label className="block md:col-span-2">
                      <div className="text-sm font-medium mb-1">Description</div>
                      <textarea
                        className="w-full rounded border px-3 py-2 text-sm"
                        value={editForm.description}
                        onChange={(e) => handleChange("description", e.target.value)}
                        rows={3}
                      />
                    </label>
                    <label className="block">
                      <div className="text-sm font-medium mb-1">City</div>
                      <input
                        className="w-full rounded border px-3 py-2 text-sm"
                        value={editForm.city}
                        onChange={(e) => handleChange("city", e.target.value)}
                      />
                    </label>
                    <label className="block">
                      <div className="text-sm font-medium mb-1">Price</div>
                      <input
                        type="number"
                        className="w-full rounded border px-3 py-2 text-sm"
                        value={editForm.price}
                        onChange={(e) => handleChange("price", e.target.value)}
                      />
                    </label>
                    <label className="block md:col-span-2">
                      <div className="text-sm font-medium mb-1">Address</div>
                      <input
                        className="w-full rounded border px-3 py-2 text-sm"
                        value={editForm.address}
                        onChange={(e) => handleChange("address", e.target.value)}
                      />
                    </label>
                    <label className="block">
                      <div className="text-sm font-medium mb-1">Phone</div>
                      <input
                        className="w-full rounded border px-3 py-2 text-sm"
                        value={editForm.phone}
                        onChange={(e) => handleChange("phone", e.target.value)}
                      />
                    </label>
                    <label className="block">
                      <div className="text-sm font-medium mb-1">Website</div>
                      <input
                        className="w-full rounded border px-3 py-2 text-sm"
                        value={editForm.website}
                        onChange={(e) => handleChange("website", e.target.value)}
                      />
                    </label>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button
                      className="rounded bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-500"
                      onClick={() => handleSaveEdit(place.id)}
                    >
                      Guardar
                    </button>
                    <button
                      className="rounded bg-slate-500 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-400"
                      onClick={handleCancelEdit}
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col gap-2 md:flex-row md:justify-between md:items-start">
                  <div>
                    <div className="text-lg font-semibold">{place.name || place.title || `Place #${place.id}`}</div>
                    <div className="text-sm text-slate-500 dark:text-slate-300">{place.description || place.summary || "No description provided."}</div>
                    {place.address && <div className="text-sm text-slate-500 dark:text-slate-300">{place.address}</div>}
                    {place.city && <div className="text-sm text-slate-500 dark:text-slate-300">City: {place.city}</div>}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button
                      className="rounded bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-500"
                      onClick={() => handleEditClick(place)}
                    >
                      Editar
                    </button>
                    <button
                      className="rounded bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-500"
                      onClick={() => handleApprove(place.id)}
                    >
                      Approve
                    </button>
                    <button
                      className="rounded bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-500"
                      onClick={() => handleReject(place.id)}
                    >
                      Reject
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CollectorTab;
