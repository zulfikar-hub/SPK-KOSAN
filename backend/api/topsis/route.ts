import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const kriteria = await prisma.kriteria.findMany();
    const kosan = await prisma.kosan.findMany();

    if (!kriteria.length) {
      return NextResponse.json({ message: "Belum ada data kriteria." });
    }
    if (!kosan.length) {
      return NextResponse.json({ message: "Belum ada data kosan." });
    }

    const matrix = kosan.map((k) => [
      Number(k.harga),
      Number(k.jarak),
      Number(k.fasilitas),
      Number(k.rating),
      Number(k.sistem_keamanan),
    ]);

    const divisor = matrix[0].map((_, j) =>
      Math.sqrt(matrix.reduce((sum, row) => sum + Math.pow(row[j], 2), 0)) || 1
    );

    const normalized = matrix.map((row) =>
      row.map((val, j) => val / (divisor[j] || 1))
    );

    const weighted = normalized.map((row) =>
      row.map((val, j) => val * Number(kriteria[j]?.bobot || 0))
    );

    const idealPos = weighted[0].map((_, j) => {
      const col = weighted.map((r) => r[j]);
      return kriteria[j]?.tipe === "benefit"
        ? Math.max(...col)
        : Math.min(...col);
    });

    const idealNeg = weighted[0].map((_, j) => {
      const col = weighted.map((r) => r[j]);
      return kriteria[j]?.tipe === "benefit"
        ? Math.min(...col)
        : Math.max(...col);
    });

    const distPos = weighted.map((row) =>
      Math.sqrt(row.reduce((sum, val, j) => sum + Math.pow(val - idealPos[j], 2), 0))
    );
    const distNeg = weighted.map((row) =>
      Math.sqrt(row.reduce((sum, val, j) => sum + Math.pow(val - idealNeg[j], 2), 0))
    );

    const preferensi = distPos.map((_, i) => {
      const p = distPos[i];
      const n = distNeg[i];
      return p + n === 0 ? 0 : n / (p + n);
    });

    // 🔁 Simpan/update hasil TOPSIS ke database
    const hasil = await Promise.all(
      kosan.map((k, i) =>
        prisma.hasilTopsis.upsert({
          where: { id_kosan: k.id_kosan },
          update: { nilai_preferensi: preferensi[i], ranking: 0 },
          create: {
            id_kosan: k.id_kosan,
            nilai_preferensi: preferensi[i],
            ranking: 0,
          },
        })
      )
    );

    // 🔢 Urutkan berdasarkan nilai preferensi
    const hasilSorted = hasil
      .map((h, i) => ({
        ...h,
        nama_kosan: kosan[i].nama, // ⬅️ Tambahkan nama kosan di sini
        nilai_preferensi: Number(preferensi[i]),
      }))
      .sort((a, b) => b.nilai_preferensi - a.nilai_preferensi);

    // 🏆 Update ranking
    await Promise.all(
      hasilSorted.map((item, idx) =>
        prisma.hasilTopsis.update({
          where: { id_hasil: item.id_hasil },
          data: { ranking: idx + 1 },
        })
      )
    );

    // 🎯 Format hasil agar hanya menampilkan yang dibutuhkan
    const formatted = hasilSorted.map((h) => ({
      ranking: h.ranking,
      nama_kosan: h.nama_kosan,
      nilai_preferensi: h.nilai_preferensi.toFixed(4),
    }));

    return NextResponse.json({
      message: "✅ Perhitungan TOPSIS selesai",
      hasil: formatted,
    });
  } catch (err) {
    console.error("Error TOPSIS:", err);
    return NextResponse.json(
      { error: `Terjadi kesalahan server: ${err}` },
      { status: 500 }
    );
  }
}
