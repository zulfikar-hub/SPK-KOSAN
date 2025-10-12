import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  const data = await req.json();
  const kosan = await prisma.kosan.create({ data });
  return NextResponse.json(kosan);
}

export async function GET() {
  const kosan = await prisma.kosan.findMany();
  return NextResponse.json(kosan);
}
