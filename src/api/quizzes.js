import { api } from './client'

export const getQuizzes = () => api.get('/api/quizz')
export const createQuizz = (data) => api.post('/api/quizz', data)
export const updateQuizz = (id, data) => api.put(`/api/quizz/${id}`, data)
export const deleteQuizz = (id) => api.delete(`/api/quizz/${id}`)
