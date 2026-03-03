import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const q = searchParams.get('q') || ''

  const empleados = await prisma.empleado.findMany({
    where: {
      activo: true,
      OR: [
        { nombre:      { contains: q, mode: 'insensitive' } },
        { dependencia: { contains: q, mode: 'insensitive' } },
        { cargo:       { contains: q, mode: 'insensitive' } },
        { equipo:      { contains: q, mode: 'insensitive' } },
      ],
    },
    orderBy: { nombre: 'asc' },
  })

  return NextResponse.json(empleados)
}