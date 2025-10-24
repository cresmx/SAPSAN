import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

const API_URL = "http://localhost:5000/api";

const ADMIN_TOKEN = process.env.ADMIN_TOKEN;
const CAJERO_TOKEN = process.env.CAJERO_TOKEN;
const CAPTURISTA_TOKEN = process.env.CAPTURISTA_TOKEN;

const api = (token) =>
  axios.create({
    baseURL: API_URL,
    headers: { Authorization: `Bearer ${token}` },
  });

async function main() {
  let usuario, domicilio, medidor;

  try {
    console.log("=== INICIO PRUEBAS EXTENDIDAS ===");

    // 1. Crear usuario consumidor
    const resUser = await api(ADMIN_TOKEN).post("/users", {
      numero_usuario: "TEST002",
      nombres: "Maria",
      apellidos: "Lopez",
      direccion: "Av. Principal 456",
      telefono: "555-5678",
      email: "maria@test.com",
      tipo_usuario: "domestico",
    });
    usuario = resUser.data.data;
    console.log("Usuario creado:", usuario.id);

    // 2. Crear domicilio
    const resDom = await api(ADMIN_TOKEN).post(`/domicilios/usuario/${usuario.id}`, {
      manzana: "norte",
      calle: "Av. Principal",
      numero: "456",
      referencia: "Casa verde",
    });
    domicilio = resDom.data.data;
    console.log("Domicilio creado:", domicilio.id);

    // 3. Asignar medidor con número dinámico
    const medidorNumero = "MED-TEST-" + Date.now();
    const resMed = await api(ADMIN_TOKEN).post(`/medidores/domicilio/${domicilio.id}`, {
      numero_medidor: medidorNumero,
      marca: "TestMarca",
      modelo: "X2",
      lectura_inicial: 0,
    });
    medidor = resMed.data.data;
    console.log("Medidor asignado:", medidor.id);

    // === PERIODO 1: Octubre ===
    console.log("\n=== PERIODO 2025-10 ===");
    const resMedOct = await api(CAPTURISTA_TOKEN).post("/mediciones", {
      domicilio_id: domicilio.id,
      lectura_actual: 20,
      periodo: "2025-10",
      observaciones: "Lectura octubre",
      gps_lat: 20.5,
      gps_lng: -99.2,
    });
    console.log("Medición octubre:", resMedOct.data.data.id);

    const resFactOct = await api(ADMIN_TOKEN).post("/facturas/generar?periodo=2025-10");
    const facturaOct = resFactOct.data.data.find((f) => f.domicilio_id === domicilio.id);
    console.log("Factura octubre:", facturaOct?.id, "Total:", facturaOct?.total);

    await api(CAJERO_TOKEN).post("/pagos", {
      factura_id: facturaOct.id,
      monto: facturaOct.total,
      metodo_pago: "efectivo",
    });
    console.log("Pago octubre registrado");

    // === PERIODO 2: Noviembre ===
    console.log("\n=== PERIODO 2025-11 ===");
    const resMedNov = await api(CAPTURISTA_TOKEN).post("/mediciones", {
      domicilio_id: domicilio.id,
      lectura_actual: 45, // acumulado, 25 m³ más
      periodo: "2025-11",
      observaciones: "Lectura noviembre",
      gps_lat: 20.5,
      gps_lng: -99.2,
    });
    console.log("Medición noviembre:", resMedNov.data.data.id);

    const resFactNov = await api(ADMIN_TOKEN).post("/facturas/generar?periodo=2025-11");
    const facturaNov = resFactNov.data.data.find((f) => f.domicilio_id === domicilio.id);
    console.log("Factura noviembre:", facturaNov?.id, "Total:", facturaNov?.total);

    await api(CAJERO_TOKEN).post("/pagos", {
      factura_id: facturaNov.id,
      monto: facturaNov.total,
      metodo_pago: "efectivo",
    });
    console.log("Pago noviembre registrado");

    // === REPORTES ===
    console.log("\n=== REPORTES ===");
    const resConsumos = await api(ADMIN_TOKEN).get("/reportes/consumos", {
      params: { periodo: "2025-11" },
    });
    console.log("Reporte consumos noviembre:", resConsumos.data.data);
/*
    const resIngresos = await api(ADMIN_TOKEN).get("/reportes/ingresos", {
      params: { periodo: "2025-11" },
    });
    console.log("Reporte ingresos noviembre:", resIngresos.data.data);
*/
    console.log("=== PRUEBAS EXTENDIDAS COMPLETADAS ===");
  } catch (err) {
    console.error("Error en pruebas extendidas:", err.response?.data || err.message);
  } finally {
    // Limpieza de datos de prueba
    try {
      if (usuario) {
        await api(ADMIN_TOKEN).delete(`/users/${usuario.id}`);
        console.log("Usuario de prueba eliminado");
      }
    } catch (cleanupErr) {
      console.error("Error al limpiar datos:", cleanupErr.message);
    }
  }
}

main();
