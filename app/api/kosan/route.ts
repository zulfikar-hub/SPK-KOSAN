import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { nama, harga, jarak, fasilitas, rating, keamanan } = body

    const kosan = await prisma.kosan.create({
      data: {
        nama,
        harga,
        jarak,
        fasilitas,
        rating,
        keamanan,
      },
    })

    return NextResponse.json(kosan, { status: 201 })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Gagal menambahkan kosan" }, { status: 500 })
  }
}
