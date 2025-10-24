import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

const API_URL = "http://localhost:5000/api";

const ADMIN_TOKEN = process.env.ADMIN_TOKEN;
const CAJERO_TOKEN = process.env.CAJERO_TOKEN;
const SUPERVISOR_TOKEN = process.env.SUPERVISOR_TOKEN;
const CAPTURISTA_TOKEN = process.env.CAPTURISTA_TOKEN;

// Helper para requests
const api = (token) =>
  axios.create({
    baseURL: API_URL,
    headers: { Authorization: `Bearer ${token}` },
  });

async function main() {
  let usuario, domicilio, medidor, medicion, factura, pago;

  try {
    console.log("=== INICIO PRUEBAS ===");

    // 1. Crear usuario consumidor
    const resUser = await api(ADMIN_TOKEN).post("/users", {
      numero_usuario: "TEST001",
      nombres: "Juan",
      apellidos: "Perez",
      direccion: "Calle Falsa 123",
      telefono: "555-1234",
      email: "juan@test.com",
      tipo_usuario: "domestico",
    });
    usuario = resUser.data.data;
    console.log("Usuario creado:", usuario.id);

    // 2. Crear domicilio
    console.log("Llamando a:", "/api/domicilios/usuario/" + usuario.id);
    const resDom = await api(ADMIN_TOKEN).post(`/domicilios/usuario/${usuario.id}`, {
      manzana: "centro",
      calle: "Calle Falsa",
      numero: "123",
      referencia: "Casa azul",
    });
    domicilio = resDom.data.data;
    console.log("Domicilio creado:", domicilio.id);

    // 3. Asignar medidor con número dinámico
    const medidorNumero = "MED-TEST-" + Date.now();
    console.log("Llamando a:", "/api/medidores/domicilio/" + domicilio.id);
    const resMed = await api(ADMIN_TOKEN).post(`/medidores/domicilio/${domicilio.id}`, {
      numero_medidor: medidorNumero,
      marca: "TestMarca",
      modelo: "X1",
      lectura_inicial: 0,
    });
    medidor = resMed.data.data;
    console.log("Medidor asignado:", medidor.id, "Número:", medidor.numero_medidor);

    // 4. Capturista registra medición
    console.log("Llamando a:", "/api/mediciones/" + usuario.id);
    const resMedicion = await api(CAPTURISTA_TOKEN).post("/mediciones", {
      domicilio_id: domicilio.id,
      lectura_actual: 25, // 25 m³
      periodo: "2025-10",
      observaciones: "Lectura de prueba",
      gps_lat: 20.5,
      gps_lng: -99.2,
    });
    medicion = resMedicion.data.data;
    console.log("Medición registrada:", medicion.id);

    // 5. Generar facturas del periodo
    console.log("Llamando a:", "/api/facturas/" + usuario.id);
    const resFact = await api(ADMIN_TOKEN).post("/facturas/generar?periodo=2025-10");
    factura = resFact.data.data.find((f) => f.domicilio_id === domicilio.id);
    console.log("Factura generada:", factura?.id, "Total:", factura?.total);

    // 6. Registrar pago
    console.log("Llamando a:", "/api/pagos/" + usuario.id);
    const resPago = await api(CAJERO_TOKEN).post("/pagos", {
      factura_id: factura.id,
      monto: factura.total,
      metodo_pago: "efectivo",
    });
    pago = resPago.data.data;
    console.log("Pago registrado:", pago.id);

    // 7. Consultar reportes
//original    
console.log("Llamando a:", "/api/reportes/consumos/" + usuario.id);
//    console.log("Llamando a:", "/api/reportes/consumos/");  //quitandole el usuario.id
    const resConsumos = await api(ADMIN_TOKEN).get("/reportes/consumos", {
      params: { periodo: "2025-10" },
    });
    console.log("Reporte consumos:", resConsumos.data.data);

    //const resIngresos = await api(ADMIN_TOKEN).get("/reportes/ingresos", {
    //  params: { periodo: "2025-10" },
    //});
    //console.log("Reporte ingresos:", resIngresos.data.data);

    //const resAcciones = await api(ADMIN_TOKEN).get("/reportes/acciones");
    //console.log("Reporte acciones (últimas):", resAcciones.data.data.slice(0, 5));

    console.log("=== PRUEBAS COMPLETADAS ===");
  } catch (err) {
    console.error("Error en pruebas:", err.response?.data || err.message);
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
