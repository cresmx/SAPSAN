import api from './api';

const userService = {
  async getAll(filtros = {}) {
    const response = await api.get('/users', { params: filtros });
    return response.data;
  },

  async getById(id) {
    const response = await api.get(`/users/${id}`);
    return response.data;
  },

  async create(userData) {
    const response = await api.post('/users', userData);
    return response.data;
  },

  async update(id, userData) {
    const response = await api.put(`/users/${id}`, userData);
    return response.data;
  },

  async delete(id) {
    const response = await api.delete(`/users/${id}`);
    return response.data;
  },

  async search(query) {
    const response = await api.get('/users', { params: { search: query } });
    return response.data;
  }
};

export default userService;
