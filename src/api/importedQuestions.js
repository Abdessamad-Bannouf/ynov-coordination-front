import { api } from './client'

export const getImportedQuestions = () => api.get('/api/imported-questions')
export const importQuestions = (category) =>
  api.post(
    category
      ? `/api/imported-questions/import?category=${encodeURIComponent(category)}`
      : '/api/imported-questions/import'
  )
