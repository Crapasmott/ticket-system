-- CreateTable
CREATE TABLE "Tecnico" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "usuario" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Tecnico_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Empleado" (
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
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Empleado_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Ticket" (
    "id" SERIAL NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL,
    "edificio" TEXT NOT NULL,
    "nombreEquipo" TEXT,
    "serial" TEXT,
    "observaciones" TEXT,
    "componentes" JSONB NOT NULL,
    "firmaTecnico" TEXT,
    "firmaUsuario" TEXT,
    "tecnicoId" INTEGER NOT NULL,
    "empleadoId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Ticket_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Tecnico_usuario_key" ON "Tecnico"("usuario");

-- CreateIndex
CREATE INDEX "Ticket_tecnicoId_idx" ON "Ticket"("tecnicoId");

-- CreateIndex
CREATE INDEX "Ticket_empleadoId_idx" ON "Ticket"("empleadoId");

-- CreateIndex
CREATE INDEX "Ticket_fecha_idx" ON "Ticket"("fecha");

-- AddForeignKey
ALTER TABLE "Ticket" ADD CONSTRAINT "Ticket_tecnicoId_fkey" FOREIGN KEY ("tecnicoId") REFERENCES "Tecnico"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ticket" ADD CONSTRAINT "Ticket_empleadoId_fkey" FOREIGN KEY ("empleadoId") REFERENCES "Empleado"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
