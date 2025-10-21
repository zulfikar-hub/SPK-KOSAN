"use client";
import { useState, ChangeEvent, FormEvent } from "react";

export default function TambahKosan() {
  // 1️⃣ Tentukan tipe form biar TypeScript tahu struktur datanya
  type KosanForm = {
    nama: string;
    harga: string;
    jarak: string;
    fasilitas: string;
    rating: string;
    sistem_keamanan: string;
  };

  // 2️⃣ Gunakan tipe itu di useState
  const [form, setForm] = useState<KosanForm>({
    nama: "",
    harga: "",
    jarak: "",
    fasilitas: "",
    rating: "",
    sistem_keamanan: "",
  });

  // 3️⃣ Ubah handleChange biar pakai tipe event input HTML
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // 4️⃣ Ubah handleSubmit jadi FormEvent<HTMLFormElement>
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const res = await fetch("/api/kosan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const result = await res.json();
      alert(result.message || result.error);
    } catch (error) {
      alert("Terjadi kesalahan saat menyimpan data.");
      console.error(error);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Tambah Kosan</h1>
      <form onSubmit={handleSubmit} className="space-y-3">
        {/* 5️⃣ Hindari any di map */}
        {(Object.keys(form) as (keyof KosanForm)[]).map((key) => (
          <input
            key={key}
            name={key}
            value={form[key]}
            onChange={handleChange}
            placeholder={key.replace("_", " ")} // biar placeholder lebih rapi
            className="border p-2 rounded w-full"
            required
          />
        ))}
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
        >
          Simpan
        </button>
      </form>
    </div>
  );
}
