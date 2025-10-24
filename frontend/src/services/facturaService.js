import api from './api';

const facturaService = {
  async getAll(filtros = {}) {
    const response = await api.get('/facturas', { params: filtros });
    return response.data;
  },

  async getById(id) {
    const response = await api.get(`/facturas/${id}`);
    return response.data;
  },

  async create(facturaData) {
    const response = await api.post('/facturas', facturaData);
    return response.data;
  },

  async update(id, facturaData) {
    const response = await api.put(`/facturas/${id}`, facturaData);
    return response.data;
  },

  async delete(id) {
    const response = await api.delete(`/facturas/${id}`);
    return response.data;
  },

  async registrarPago(id, pagoData) {
    const response = await api.post(`/facturas/${id}/pagar`, pagoData);
    return response.data;
  },

  async getVencidas() {
    const response = await api.get('/facturas/vencidas');
    return response.data;
  },

  async getEstadisticas(periodo = null) {
    const response = await api.get('/facturas/estadisticas', { params: { periodo } });
    return response.data;
  }
};

export default facturaService;
