import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    // Ambil hasil topsis dan join dengan nama kosan
    const hasil = await prisma.hasilTopsis.findMany({
      include: {
        kosan: {
          select: { nama: true },
        },
      },
      orderBy: { ranking: "asc" },
    });

    if (!hasil.length) {
      return NextResponse.json({
        message: "Belum ada hasil TOPSIS. Jalankan /api/topsis terlebih dahulu.",
      });
    }

    // Format output
    const formatted = hasil.map((h) => ({
      ranking: h.ranking,
      nama_kosan: h.kosan?.nama,
      nilai_preferensi: Number(h.nilai_preferensi).toFixed(4),
    }));

    return NextResponse.json({
      message: "Hasil perhitungan TOPSIS dari database 📊",
      total_data: hasil.length,
      hasil: formatted,
    });
  } catch (error) {
    console.error("Error mengambil hasil TOPSIS:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan server." },
      { status: 500 }
    );
  }
}
