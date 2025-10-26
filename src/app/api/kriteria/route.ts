import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// ✅ Ambil semua data kriteria
export async function GET() {
  try {
    const kriteriaList = await prisma.kriteria.findMany({
      orderBy: { id_kriteria: "asc" },
    });

    return NextResponse.json(kriteriaList, { status: 200 });
  } catch (error) {
    console.error("❌ Gagal mengambil data kriteria:", error);
    return NextResponse.json(
      { error: "Gagal mengambil data kriteria." },
      { status: 500 }
    );
  }
}

// ✅ Tambah data kriteria baru
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { nama_kriteria, bobot, tipe } = body;

    // Validasi input
    if (!nama_kriteria || !bobot || !tipe) {
      return NextResponse.json(
        { error: "Semua field (nama_kriteria, bobot, tipe) wajib diisi." },
        { status: 400 }
      );
    }

    // Validasi tipe (harus 'benefit' atau 'cost')
    if (!["benefit", "cost"].includes(tipe)) {
      return NextResponse.json(
        { error: "Tipe hanya boleh 'benefit' atau 'cost'." },
        { status: 400 }
      );
    }

    // Simpan ke database
    const kriteria = await prisma.kriteria.create({
      data: {
        nama_kriteria,
        bobot: Number(bobot),
        tipe,
      },
    });

    return NextResponse.json(
      { message: "✅ Kriteria berhasil ditambahkan.", data: kriteria },
      { status: 201 }
    );
  } catch (error) {
    console.error("❌ Gagal menambahkan kriteria:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan saat menambahkan kriteria." },
      { status: 500 }
    );
  }
}
