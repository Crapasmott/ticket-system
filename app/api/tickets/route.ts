import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const {
      tecnicoId,
      empleadoId,
      edificio,
      tipoEquipo,
      nombreEquipo,
      componentes,
      observaciones,
      firmaTecnico,
      firmaUsuario,
      estado,
    } = body

   if (!tecnicoId || !empleadoId || !edificio || !tipoEquipo || !nombreEquipo) {
  return NextResponse.json(
    { error: 'Faltan campos obligatorios', recibido: { tecnicoId, empleadoId, edificio, tipoEquipo, nombreEquipo } },
    { status: 400 }
  )
}
    const ticket = await prisma.ticket.create({
      data: {
        fecha:         new Date(),
        tecnicoId:     Number(tecnicoId),
        empleadoId:    Number(empleadoId),
        edificio,
        tipoEquipo,
        nombreEquipo,
        componentes:   componentes ?? {},
        observaciones: observaciones ?? '',
        firmaTecnico:  firmaTecnico ?? '',
        firmaUsuario:  firmaUsuario ?? '',
        estado:        estado ?? 'COMPLETADO',
      },
    })

    return NextResponse.json({ ok: true, ticket }, { status: 201 })
  } catch (error) {
    console.error('Error creando ticket:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const tickets = await prisma.ticket.findMany({
      include: { tecnico: true, empleado: true },
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json(tickets)
  } catch (error) {
    console.error('Error obteniendo tickets:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}