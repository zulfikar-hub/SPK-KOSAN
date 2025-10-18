import { NextResponse } from "next/server";
import prisma from "@/lib/prisma"; // gunakan prisma dari lib, bukan new PrismaClient()

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { nama, harga, jarak, fasilitas, rating, sistem_keamanan } = body;

    // 🔍 Validasi data
    if (!nama || !harga || !jarak || !fasilitas || !rating || !sistem_keamanan) {
      return NextResponse.json(
        { error: "Semua field wajib diisi." },
        { status: 400 }
      );
    }

    // 💾 Simpan ke database
    const kosan = await prisma.kosan.create({
      data: {
        nama,
        harga: Number(harga),
        jarak: Number(jarak),
        fasilitas: Number(fasilitas),
        rating: Number(rating),
        sistem_keamanan: Number(sistem_keamanan),
      },
    });

    return NextResponse.json(kosan, { status: 201 });
  } catch (error) {
    console.error("❌ Gagal menambahkan kosan:", error);
    return NextResponse.json(
      { error: "Gagal menambahkan kosan ke database." },
      { status: 500 }
    );
  }
}
