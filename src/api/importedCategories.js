import { api } from './client'

export const getImportedCategories = () => api.get('/api/imported-categories')
