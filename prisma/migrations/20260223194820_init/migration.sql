/*
  Warnings:

  - You are about to drop the `Empleado` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Tecnico` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Ticket` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Ticket" DROP CONSTRAINT "Ticket_empleadoId_fkey";

-- DropForeignKey
ALTER TABLE "Ticket" DROP CONSTRAINT "Ticket_tecnicoId_fkey";

-- DropTable
DROP TABLE "Empleado";

-- DropTable
DROP TABLE "Tecnico";

-- DropTable
DROP TABLE "Ticket";

-- CreateTable
CREATE TABLE "tecnicos" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "usuario" TEXT NOT NULL,
    "password" TEXT NOT NULL DEFAULT '123456',
    "role" TEXT NOT NULL DEFAULT 'tecnico',
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tecnicos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "empleados" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "cargo" TEXT NOT NULL,
    "dependencia" TEXT NOT NULL,
    "equipo" TEXT NOT NULL,
    "ip" TEXT,
    "tipo" TEXT NOT NULL,
    "serial" TEXT,
    "monitor" TEXT,
    "macEthernet" TEXT,
    "macWifi" TEXT,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "empleados_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tickets" (
    "id" SERIAL NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL,
    "edificio" TEXT NOT NULL,
    "tipoEquipo" TEXT NOT NULL,
    "serial" TEXT,
    "observaciones" TEXT,
    "estado" TEXT NOT NULL DEFAULT 'COMPLETADO',
    "componentes" JSONB NOT NULL,
    "firmaTecnico" TEXT,
    "firmaUsuario" TEXT,
    "tecnicoId" INTEGER NOT NULL,
    "empleadoId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tickets_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "tecnicos_usuario_key" ON "tecnicos"("usuario");

-- CreateIndex
CREATE INDEX "tickets_tecnicoId_idx" ON "tickets"("tecnicoId");

-- CreateIndex
CREATE INDEX "tickets_empleadoId_idx" ON "tickets"("empleadoId");

-- CreateIndex
CREATE INDEX "tickets_fecha_idx" ON "tickets"("fecha");

-- AddForeignKey
ALTER TABLE "tickets" ADD CONSTRAINT "tickets_tecnicoId_fkey" FOREIGN KEY ("tecnicoId") REFERENCES "tecnicos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tickets" ADD CONSTRAINT "tickets_empleadoId_fkey" FOREIGN KEY ("empleadoId") REFERENCES "empleados"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
