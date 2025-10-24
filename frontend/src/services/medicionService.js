import api from './api';

const medicionService = {
  async getAll(filtros = {}) {
    const response = await api.get('/mediciones', { params: filtros });
    return response.data;
  },

  async getById(id) {
    const response = await api.get(`/mediciones/${id}`);
    return response.data;
  },

  async create(medicionData) {
    const response = await api.post('/mediciones', medicionData);
    return response.data;
  },

  async update(id, medicionData) {
    const response = await api.put(`/mediciones/${id}`, medicionData);
    return response.data;
  },

  async delete(id) {
    const response = await api.delete(`/mediciones/${id}`);
    return response.data;
  },

  async getUltimaPorMedidor(medidorId) {
    const response = await api.get(`/mediciones/ultima/${medidorId}`);
    return response.data;
  }
};

export default medicionService;
