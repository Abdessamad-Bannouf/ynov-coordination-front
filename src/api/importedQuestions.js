import { api } from './client'

export const getImportedQuestions = () => api.get('/api/imported-questions')
export const importQuestions = () => api.post('/api/imported-questions/import')
