import { NextResponse } from "next/server";
import { PrismaClient, type HasilTopsis } from "@prisma/client";

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

    type KosanRow = (typeof kosan)[number];

    const matrix: number[][] = kosan.map((k: KosanRow) => [
      Number(k.harga) || 0,
      Number(k.jarak) || 0,
      Number(k.fasilitas) || 0,
      Number(k.rating) || 0,
      Number(k.sistem_keamanan) || 0,
    ]);

    const nCols = matrix[0].length;
    if (nCols !== kriteria.length) {
      return NextResponse.json({
        error: `Jumlah kolom matriks (${nCols}) != jumlah kriteria (${kriteria.length}).`,
      });
    }

    const divisor: number[] = matrix[0].map((_, j: number) =>
      Math.sqrt(matrix.reduce((sum, row) => sum + Math.pow(row[j], 2), 0)) || 1
    );

    const normalized: number[][] = matrix.map((row) =>
      row.map((val, j) => (val || 0) / (divisor[j] || 1))
    );

    const weighted: number[][] = normalized.map((row) =>
      row.map((val, j) => val * (Number(kriteria[j]?.bobot) || 0))
    );

    const idealPos = weighted[0].map((_, j) => {
      const colVals = weighted.map((r) => r[j]);
      return kriteria[j]?.tipe === "benefit"
        ? Math.max(...colVals)
        : Math.min(...colVals);
    });

    const idealNeg = weighted[0].map((_, j) => {
      const colVals = weighted.map((r) => r[j]);
      return kriteria[j]?.tipe === "benefit"
        ? Math.min(...colVals)
        : Math.max(...colVals);
    });

    const distPos = weighted.map((row) =>
      Math.sqrt(row.reduce((sum, val, j) => sum + Math.pow(val - idealPos[j], 2), 0))
    );

    const distNeg = weighted.map((row) =>
      Math.sqrt(row.reduce((sum, val, j) => sum + Math.pow(val - idealNeg[j], 2), 0))
    );

    const preferensi = distPos.map((_, i) => {
      const p = distPos[i] || 0;
      const n = distNeg[i] || 0;
      const denom = p + n;
      return denom === 0 ? 0 : n / denom;
    });

    const hasil: HasilTopsis[] = await Promise.all(
      kosan.map((k: KosanRow, i: number) =>
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

    // 🟢 Cast Decimal ke number agar bisa di-sort
    const hasilWithPref = hasil.map((h, i) => ({
      ...h,
      nilai_preferensi: Number(h.nilai_preferensi ?? preferensi[i]),
    }));

    const sorted = hasilWithPref.sort(
      (a, b) => b.nilai_preferensi - a.nilai_preferensi
    );

    await Promise.all(
      sorted.map((item, idx) =>
        prisma.hasilTopsis.update({
          where: { id_hasil: item.id_hasil },
          data: { ranking: idx + 1 },
        })
      )
    );

    return NextResponse.json({
      message: "Perhitungan TOPSIS selesai",
      hasil: sorted,
    });
  } catch (err) {
    console.error("Error TOPSIS:", err);
    return NextResponse.json({ error: "Terjadi kesalahan server." }, { status: 500 });
  }
}
