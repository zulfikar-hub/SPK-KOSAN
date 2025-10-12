import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  const kriteria = await prisma.kriteria.findMany();
  const kosan = await prisma.kosan.findMany();

  if (kosan.length === 0) return NextResponse.json({ message: "Belum ada data kosan." });

  const matrix = kosan.map(k => [k.harga, k.jarak, k.fasilitas, k.rating, k.keamanan]);

  // 1. Normalisasi
  const divisor = matrix[0].map((_, j) => Math.sqrt(matrix.reduce((sum, row) => sum + row[j] ** 2, 0)));
  const normalized = matrix.map(row => row.map((val, j) => val / divisor[j]));

  // 2. Bobotkan
  const weighted = normalized.map(row =>
    row.map((val, j) => val * (kriteria[j].bobot ?? 0))
  );

  // 3. Solusi ideal positif & negatif
  const idealPos = weighted[0].map((_, j) =>
    kriteria[j].tipe === "benefit" ? Math.max(...weighted.map(r => r[j])) : Math.min(...weighted.map(r => r[j]))
  );

  const idealNeg = weighted[0].map((_, j) =>
    kriteria[j].tipe === "benefit" ? Math.min(...weighted.map(r => r[j])) : Math.max(...weighted.map(r => r[j]))
  );

  // 4. Jarak ke solusi ideal
  const distPos = weighted.map(row => Math.sqrt(row.reduce((sum, val, j) => sum + (val - idealPos[j]) ** 2, 0)));
  const distNeg = weighted.map(row => Math.sqrt(row.reduce((sum, val, j) => sum + (val - idealNeg[j]) ** 2, 0)));

  // 5. Nilai preferensi (Vi)
  const preferensi = distPos.map((_, i) => distNeg[i] / (distPos[i] + distNeg[i]));

  // 6. Simpan hasil ranking
  const hasil = await Promise.all(
    kosan.map((k, i) =>
      prisma.hasilTopsis.upsert({
        where: { kosanId: k.id_kosan },
        update: { nilai_preferensi: preferensi[i], ranking: 0 },
        create: { kosanId: k.id_kosan, nilai_preferensi: preferensi[i], ranking: 0 },
      })
    )
  );

  // 7. Update ranking
  const sorted = hasil
    .map((h, i) => ({ ...h, nilai_preferensi: preferensi[i] }))
    .sort((a, b) => b.nilai_preferensi - a.nilai_preferensi);

  for (let i = 0; i < sorted.length; i++) {
    await prisma.hasilTopsis.update({
      where: { id_hasil: sorted[i].id_hasil },
      data: { ranking: i + 1 },
    });
  }

  return NextResponse.json({ message: "Perhitungan TOPSIS selesai", hasil: sorted });
}
