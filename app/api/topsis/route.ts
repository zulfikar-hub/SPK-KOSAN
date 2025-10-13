import { NextResponse } from "next/server";
import { PrismaClient, type HasilTopsis } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    // Ambil data
    const kriteria = await prisma.kriteria.findMany();
    const kosan = await prisma.kosan.findMany();

    if (!kriteria.length) {
      return NextResponse.json({ message: "Belum ada data kriteria." });
    }
    if (!kosan.length) {
      return NextResponse.json({ message: "Belum ada data kosan." });
    }

    // infer tipe satu elemen kosan (supaya tidak perlu import tipe dari @prisma/client)
    type KosanRow = (typeof kosan)[number];

    // 1) Buat matriks angka (number[][])
    const matrix: number[][] = kosan.map((k: KosanRow) => [
      Number(k.harga) || 0,
      Number(k.jarak) || 0,
      Number(k.fasilitas) || 0,
      Number(k.rating) || 0,
      Number(k.keamanan) || 0,
    ]);

    // validasi: jumlah kolom harus sama dengan jumlah kriteria
    const nCols = matrix[0].length;
    if (nCols !== kriteria.length) {
      return NextResponse.json({
        error: `Jumlah kolom matriks (${nCols}) != jumlah kriteria (${kriteria.length}).`,
      });
    }

    // 2) Hitung divisor per kolom (tipe lengkap di parameter)
    const divisor: number[] = matrix[0].map((_, j: number) =>
      Math.sqrt(
        matrix.reduce((sum: number, row: number[]) => sum + Math.pow(row[j], 2), 0)
      ) || 1 // fallback ke 1 agar tidak dibagi 0
    );

    // 3) Normalisasi
    const normalized: number[][] = matrix.map((row: number[]) =>
      row.map((val: number, j: number) => {
        const d = divisor[j] || 1;
        return (Number(val) || 0) / d;
      })
    );

    // 4) Pembobotan (asumsi bobot sudah berupa angka yang ingin dikalikan)
    const weighted: number[][] = normalized.map((row: number[]) =>
      row.map((val: number, j: number) => {
        const bobot = Number(kriteria[j]?.bobot) || 0;
        return val * bobot;
      })
    );

    // 5) Solusi ideal positif & negatif
    const idealPos: number[] = weighted[0].map((_, j: number) => {
      const colVals = weighted.map((r: number[]) => r[j]);
      return kriteria[j]?.tipe === "benefit" ? Math.max(...colVals) : Math.min(...colVals);
    });

    const idealNeg: number[] = weighted[0].map((_, j: number) => {
      const colVals = weighted.map((r: number[]) => r[j]);
      return kriteria[j]?.tipe === "benefit" ? Math.min(...colVals) : Math.max(...colVals);
    });

    // 6) Jarak ke solusi ideal (tipe lengkap di reduce)
    const distPos: number[] = weighted.map((row: number[]) =>
      Math.sqrt(
        row.reduce((sum: number, val: number, j: number) => sum + Math.pow((val ?? 0) - idealPos[j], 2), 0)
      )
    );

    const distNeg: number[] = weighted.map((row: number[]) =>
      Math.sqrt(
        row.reduce((sum: number, val: number, j: number) => sum + Math.pow((val ?? 0) - idealNeg[j], 2), 0)
      )
    );

    // 7) Preferensi
    const preferensi: number[] = distPos.map((_, i: number) => {
      const p = distPos[i] || 0;
      const n = distNeg[i] || 0;
      const denom = p + n;
      return denom === 0 ? 0 : n / denom;
    });

    // 8) Simpan / upsert hasil ke DB
    // NOTE: prisma.hasilTopsis expects the model name in camelCase
    // and upsert requires a unique field in `where`. Pastikan id_kosan unik
    const hasil: HasilTopsis[] = await Promise.all(
      kosan.map((k: KosanRow, i: number) =>
        prisma.hasilTopsis.upsert({
          where: { id_kosan: k.id_kosan }, // id_kosan harus ada constraint @unique di schema kalau pakai upsert
          update: { nilai_preferensi: preferensi[i], ranking: 0 },
          create: {
            id_kosan: k.id_kosan,
            nilai_preferensi: preferensi[i],
            ranking: 0,
          },
        })
      )
    );

    // 9) Urutkan dan update ranking
    // beri tipenya supaya TypeScript tahu struktur item
    const hasilWithPref = hasil.map((h: HasilTopsis, i: number) => ({
      ...h,
      // override nilai_preferensi supaya konsisten dengan preferensi array (casting ke number)
      nilai_preferensi: preferensi[i] as unknown as any,
    }));

    const sorted = hasilWithPref.sort(
      (a: HasilTopsis & { nilai_preferensi: number }, b: HasilTopsis & { nilai_preferensi: number }) =>
        b.nilai_preferensi - a.nilai_preferensi
    );

    await Promise.all(
      sorted.map((item: HasilTopsis, idx: number) =>
        prisma.hasilTopsis.update({
          where: { id_hasil: item.id_hasil },
          data: { ranking: idx + 1 },
        })
      )
    );

    return NextResponse.json({ message: "Perhitungan TOPSIS selesai", hasil: sorted });
  } catch (err) {
    console.error("Error TOPSIS:", err);
    return NextResponse.json({ error: "Terjadi kesalahan server." }, { status: 500 });
  }
}
