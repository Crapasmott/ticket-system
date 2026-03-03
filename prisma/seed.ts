import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Cargando datos...')

  // Técnicos
  await prisma.tecnico.createMany({
    data: [
      { nombre: "Diego Mauricio Palacios Castro", usuario: "diego.palacios", password: "123456", role: "superadmin" },
      { nombre: "Julian David Ordoñez", usuario: "julian.ordones", password: "123456", role: "tecnico" },
      { nombre: "Javier Orlando Narvaez", usuario: "javier.narvaezt", password: "123456", role: "tecnico" },
    ],
    skipDuplicates: true,
  })

  // Empleados
  await prisma.empleado.createMany({
    data: [
      { nombre: "Sandra Liliana Calderon Montes", cargo: "DIRECTIVO", dependencia: "CONTROL INTERNO", equipo: "1BP2OI-001", ip: "172.16.2.11", tipo: "ESCRITORIO", serial: "8CC23909N8", monitor: "SI", macEthernet: "38-CA-84-B0-7D-7C", macWifi: "04-CF-4B-6F-30-06" },
      { nombre: "Leidy Johanna Bernate Gutierrez", cargo: "Planta", dependencia: "CONTROL PERDIDAS", equipo: "1BP2FR-002", ip: "172.16.2.95", tipo: "PORTATIL", serial: "5CD0146SPD", macEthernet: "38:22:E2:2C:51:86", macWifi: "40:EC:99:6C:83:88" },
      { nombre: "Rafael Mayor Sanchez", cargo: "Planta", dependencia: "CONTROL PERDIDAS", equipo: "1BP2FR-004", ip: "192.9.54.106", tipo: "PORTATIL", serial: "5CD8478ZYW", macEthernet: "E4:E7:49:35:DA:CE", macWifi: "B4:69:21:BB:E7:43" },
      { nombre: "Edgar Cuenca Celis", cargo: "Planta", dependencia: "CONTROL PERDIDAS", equipo: "1BP2FR-005", ip: "172.16.2.93", tipo: "PORTATIL", serial: "5CD0146S7R", macEthernet: "38:22:E2:2C:46:5E", macWifi: "40:EC:99:6B:31:09" },
      { nombre: "Pablo Emilio Parra Díaz", cargo: "DIRECTIVO", dependencia: "DIVISION PERDIDAS", equipo: "1BP2FR-001", ip: "172.16.2.64", tipo: "PORTATIL", serial: "5CD0146SPH", macEthernet: "38:22:E2:2C:51:89", macWifi: "40:EC:99:6C:86:C6" },
      { nombre: "Camilo Ernesto Herrera Castro", cargo: "DIRECTIVO", dependencia: "PLANEACIÓN", equipo: "1BP2OP-001", ip: "192.9.54.18", tipo: "PORTATIL", serial: "5CD21026HB", macEthernet: "A8:B1:3B:7B:02:B6", macWifi: "70:1A:B8:C7:31:ED" },
      { nombre: "Hector Fernando Gallego Gaviria", cargo: "Planta", dependencia: "PLANEACIÓN", equipo: "1BP2OP-002", ip: "172.16.2.107", tipo: "PORTATIL", serial: "5CD1192CLN", macEthernet: "B0:22:7A:EB:F2:C9", macWifi: "84:5C:F3:40:AD:12" },
      { nombre: "Oscar Leandro Cortes Florez", cargo: "Planta", dependencia: "PLANEACIÓN", equipo: "1BP2OP-003", ip: "192.9.54.48", tipo: "PORTATIL", serial: "5CD210275K", macEthernet: "A8:B1:3B:7A:FF:6B", macWifi: "88:D8:2E:73:96:82" },
      { nombre: "Carloina Herrera Ruiz", cargo: "Planta", dependencia: "PLANEACIÓN", equipo: "1BP2OP-004", ip: "192.9.54.59", tipo: "PORTATIL", serial: "5CD0146S85", macEthernet: "38:22:E2:2C:44:B6", macWifi: "40:EC:99:6B:31:54" },
      { nombre: "Eduardo Rodriguez Losada", cargo: "Planta", dependencia: "OFICINA JURIDICA", equipo: "1BP2OJ-001", ip: "172.16.2.132", tipo: "ESCRITORIO", serial: "MXL6060PQ4", monitor: "3CQ5480LL9", macEthernet: "48:0F:CF:43:CD:57" },
      { nombre: "Pedro Maria Rojas Cerquera", cargo: "Planta", dependencia: "OFICINA JURIDICA", equipo: "1BP2OJ-002", ip: "172.16.2.14", tipo: "ESCRITORIO", serial: "MXL6060PP6", monitor: "3CQ548LKB", macEthernet: "48:0F:CF:41:9E:00" },
      { nombre: "Anyi Lorena Zambrano Gonzalez", cargo: "Planta", dependencia: "OFICINA JURIDICA", equipo: "1BP2OJ-003", ip: "172.16.2.81", tipo: "ESCRITORIO", serial: "1CZ22309J5", monitor: "3CM20504P5", macEthernet: "84:69:93:07:52:FE", macWifi: "2C:6D:C1:5E:F3:DF" },
      { nombre: "Jhonatan Mora Amortegui", cargo: "Planta", dependencia: "OFICINA JURIDICA", equipo: "1BP2OJ-004", ip: "172.16.2.9", tipo: "ESCRITORIO", serial: "8CC23909MM", monitor: "3CM2262J7Z", macEthernet: "38:CA:84:B0:7B:64", macWifi: "04:CF:4B:44:03:95" },
      { nombre: "Nury Rocio Amezquita Orozco", cargo: "Planta", dependencia: "OFICINA JURIDICA", equipo: "1BP2OJ-005", ip: "172.16.2.24", tipo: "ESCRITORIO", serial: "MXL8291C2F", monitor: "3CQ1090RPM", macEthernet: "18:60:24:F3:B1:F7" },
      { nombre: "Marcela Rouille Tamayo", cargo: "Planta", dependencia: "OFICINA JURIDICA", equipo: "1BP2OJ-006", ip: "172.16.2.7", tipo: "ESCRITORIO", serial: "MXL6060GGB", monitor: "3CQ5480LLR", macEthernet: "48:0F:CF:43:D2:7B" },
      { nombre: "Edinson Mauricio Salazar Serrano", cargo: "Planta", dependencia: "OFICINA JURIDICA", equipo: "1BP2OJ-007", ip: "172.16.2.20", tipo: "ESCRITORIO", serial: "MXL6060GG2", monitor: "3CQ5480LJ0", macEthernet: "48:0F:CF:3B:6F:13" },
      { nombre: "Omar Andrey Ramos Cabrera", cargo: "Planta", dependencia: "OFICINA JURIDICA", equipo: "1BP2OJ-008", ip: "172.16.2.80", tipo: "ESCRITORIO", serial: "MXL8412BF5", monitor: "3CQ74626GZ", macEthernet: "F4:39:09:00:6A:F7" },
      { nombre: "Xiomara Medina Monje", cargo: "Planta", dependencia: "OFICINA JURIDICA", equipo: "1BP2OJ-009", ip: "172.16.2.5", tipo: "PORTATIL", serial: "5CD847900V", macEthernet: "E4:E7:49:35:E0:8D", macWifi: "B4:69:21:B9:16:B7" },
      { nombre: "Luis Alfredo Carballo", cargo: "DIRECTIVO", dependencia: "SECRETARÍA GENERAL", equipo: "1bp1sg-001", ip: "192.9.54.9", tipo: "PORTATIL", serial: "5CD8478ZNQ", macEthernet: "E4:E7:49:35:DC:31", macWifi: "B4:69:21:BC:7C:21" },
      { nombre: "Yurany Sanchez Calderon", cargo: "Directivo", dependencia: "RECURSOS HUMANOS", equipo: "1bp1dh-001", ip: "192.9.54.32", tipo: "PORTATIL", serial: "5CD8478ZHR", macWifi: "B4:69:21:BA:5D:8D" },
      { nombre: "Maria Soledad Castañeda Vargas", cargo: "Planta", dependencia: "RECURSOS HUMANOS", equipo: "1BP1DH-003", ip: "192.9.54.16", tipo: "PORTATIL" },
      { nombre: "Victor Manuel Heredia Guerrero", cargo: "DIRECTIVO", dependencia: "FINANCIERA", equipo: "1bp1df-001", ip: "192.9.54.53", tipo: "PORTATIL" },
      { nombre: "Yused Tatiana Leiva Ramirez", cargo: "Planta", dependencia: "FINANCIERA", equipo: "1bp1df-002", ip: "172.16.1.36", tipo: "ESCRITORIO" },
      { nombre: "Debora Judith Houghton Triviño", cargo: "Jefe", dependencia: "SERVICIOS ADMINISTRATIVOS", equipo: "1bp1ds-020", ip: "172.16.1.37", tipo: "ESCRITORIO" },
      { nombre: "Luisa Fernanda Castro Bonilla", cargo: "Directivo", dependencia: "SERVICIOS ADMINISTRATIVOS", equipo: "1BP1DS-001", ip: "192.9.54.211", tipo: "PORTATIL" },
      { nombre: "Stefania Cordoba Gonzalez", cargo: "Mision", dependencia: "SERVICIOS ADMINISTRATIVOS", equipo: "1BP1DS-002", ip: "192.9.54.126", tipo: "PORTATIL" },
      { nombre: "Ana Maria Pérez Rojas", cargo: "Mision", dependencia: "SERVICIOS ADMINISTRATIVOS", equipo: "1BP1DS-003", ip: "172.16.1.87", tipo: "ESCRITORIO" },
      { nombre: "Lida Cristina Narvaez Pastrana", cargo: "Funcionario", dependencia: "CAD PROMISION", equipo: "1BP1SA-003", ip: "172.16.1.67", tipo: "ESCRITORIO" },
      { nombre: "Edna Yamile Gutierrez Muñoz", cargo: "Planta", dependencia: "CAD PROMISION", equipo: "1BP1SA-001", ip: "172.16.1.28", tipo: "ESCRITORIO" },
      { nombre: "Fredy Rojas", cargo: "Puesto de Recepción", dependencia: "RECEPCIÓN", equipo: "RECEPCION-001", ip: "172.16.1.48", tipo: "ESCRITORIO" },
      { nombre: "Nestor Orlando Silva Londoño", cargo: "Planta", dependencia: "CARTERA", equipo: "1bp2dp-005", ip: "172.16.1.72", tipo: "PORTATIL", serial: "5CD0146SJ4", macEthernet: "38:22:E2:2C:46:6F", macWifi: "40:EC:99:6C:65:D3" },
    ],
    skipDuplicates: true,
  })

  console.log('✅ Técnicos y empleados cargados correctamente')
}

main()
  .catch((e) => {
    console.error('❌ Error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })