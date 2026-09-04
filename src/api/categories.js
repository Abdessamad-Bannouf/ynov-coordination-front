import { api } from './client'

export const getCategories = () => api.get('/api/category')
export const createCategory = (name) => api.post('/api/category', { name })
export const updateCategory = (id, name) => api.put(`/api/category/${id}`, { name })
export const deleteCategory = (id) => api.delete(`/api/category/${id}`)
