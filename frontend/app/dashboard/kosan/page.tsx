"use client";
import { useEffect, useState, ChangeEvent, FormEvent } from "react";

interface Kosan {
  id_kosan: number;
  nama: string;
  harga: number;
  jarak: number;
  fasilitas: number;
  rating: number;
  sistem_keamanan: number;
}

interface FormData {
  nama: string;
  harga: string;
  jarak: string;
  fasilitas: string;
  rating: string;
  sistem_keamanan: string;
}

export default function KosanPage() {
  const [data, setData] = useState<Kosan[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<FormData>({
    nama: "",
    harga: "",
    jarak: "",
    fasilitas: "",
    rating: "",
    sistem_keamanan: "",
  });

  // 🔹 Ambil data dari API
  async function fetchKosan(): Promise<void> {
    setLoading(true);
    const res = await fetch("/api/kosan");
    const result: Kosan[] = await res.json();
    setData(result);
    setLoading(false);
  }

  useEffect(() => {
    fetchKosan();
  }, []);

  // 🔹 Hapus data
  async function handleDelete(id: number): Promise<void> {
    if (!confirm("Yakin ingin menghapus kosan ini?")) return;
    const res = await fetch(`/api/kosan/${id}`, { method: "DELETE" });
    const result = await res.json();
    alert(result.message || result.error);
    fetchKosan();
  }

  // 🔹 Mulai edit
  function handleEdit(k: Kosan): void {
    setEditingId(k.id_kosan);
    setForm({
      nama: k.nama,
      harga: String(k.harga),
      jarak: String(k.jarak),
      fasilitas: String(k.fasilitas),
      rating: String(k.rating),
      sistem_keamanan: String(k.sistem_keamanan),
    });
  }

  // 🔹 Simpan perubahan
  async function handleUpdate(e: FormEvent<HTMLFormElement>): Promise<void> {
    e.preventDefault();
    if (!editingId) return;

    const res = await fetch(`/api/kosan/${editingId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const result = await res.json();
    alert(result.message || result.error);
    setEditingId(null);
    fetchKosan();
  }

  // 🔹 Handle perubahan input
  function handleChange(e: ChangeEvent<HTMLInputElement>): void {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  if (loading) return <p className="p-6 text-center">Loading...</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Daftar Kosan</h1>
      <table className="min-w-full border text-sm border-gray-300">
        <thead className="bg-gray-100">
          <tr>
            <th className="border px-3 py-2">Nama</th>
            <th className="border px-3 py-2">Harga</th>
            <th className="border px-3 py-2">Jarak</th>
            <th className="border px-3 py-2">Fasilitas</th>
            <th className="border px-3 py-2">Rating</th>
            <th className="border px-3 py-2">Sistem Keamanan</th>
            <th className="border px-3 py-2">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {data.map((k) => (
            <tr key={k.id_kosan}>
              <td className="border px-3 py-2">{k.nama}</td>
              <td className="border px-3 py-2">{k.harga}</td>
              <td className="border px-3 py-2">{k.jarak}</td>
              <td className="border px-3 py-2">{k.fasilitas}</td>
              <td className="border px-3 py-2">{k.rating}</td>
              <td className="border px-3 py-2">{k.sistem_keamanan}</td>
              <td className="border px-3 py-2 space-x-2">
                <button
                  onClick={() => handleEdit(k)}
                  className="bg-yellow-400 text-white px-3 py-1 rounded hover:bg-yellow-500"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(k.id_kosan)}
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                >
                  Hapus
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* 🔹 Form Edit */}
      {editingId && (
  <div className="mt-6 p-4 border rounded-md bg-gray-50">
    <h2 className="text-lg font-bold mb-2">Edit Kosan</h2>
    <form onSubmit={handleUpdate} className="space-y-2">
      {(Object.keys(form) as (keyof typeof form)[]).map((key) => (
        <input
          key={key}
          name={key}
          value={form[key]}
          onChange={handleChange}
          placeholder={key}
          className="border p-2 rounded w-full"
          required
        />
      ))}
            <div className="space-x-2">
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
              >
                Simpan Perubahan
              </button>
              <button
                onClick={() => setEditingId(null)}
                type="button"
                className="bg-gray-400 text-white px-4 py-2 rounded"
              >
                Batal
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
