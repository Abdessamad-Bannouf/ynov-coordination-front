import { useEffect, useState } from 'react'
import { createCategory, getCategories } from './api/categories'
import { getImportedCategories } from './api/importedCategories'
import { getImportedQuestions, importQuestions } from './api/importedQuestions'
import './App.css'

function QuizQuestions({ questions }) {
  const [selected, setSelected] = useState({})
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    setSelected({})
    setSubmitted(false)
  }, [questions])

  const handleSelect = (questionId, answerId) => {
    if (submitted) return
    setSelected((s) => ({ ...s, [questionId]: answerId }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    setSubmitted(true)
  }

  const score = questions.reduce((total, question) => {
    const correctAnswer = question.answers.find((answer) => answer.is_correct)
    return total + (selected[question.id] === correctAnswer?.id ? 1 : 0)
  }, 0)

  const allAnswered = questions.every((question) => selected[question.id])

  return (
    <form className="quiz-form" onSubmit={handleSubmit}>
      <ul className="question-list">
        {questions.map((question) => (
          <li key={question.id} className="question-card">
            <div className="question-meta">
              {question.category && <span className="question-tag">{question.category.name}</span>}
              {question.difficulty && <span className="question-tag">{question.difficulty}</span>}
            </div>
            <p className="question-text">{question.text}</p>
            <ul className="answer-list">
              {question.answers.map((answer) => {
                const isSelected = selected[question.id] === answer.id
                let className = ''
                if (submitted) {
                  if (answer.is_correct) className = 'correct'
                  else if (isSelected) className = 'incorrect'
                } else if (isSelected) {
                  className = 'selected'
                }

                return (
                  <li key={answer.id} className={className}>
                    <label>
                      <input
                        type="radio"
                        name={`question-${question.id}`}
                        checked={isSelected}
                        onChange={() => handleSelect(question.id, answer.id)}
                        disabled={submitted}
                      />
                      {answer.text}
                    </label>
                  </li>
                )
              })}
            </ul>
          </li>
        ))}
      </ul>

      {!submitted && (
        <button type="submit" disabled={!allAnswered}>
          Valider mes réponses
        </button>
      )}
      {submitted && (
        <p className="quiz-score">
          Score : {score} / {questions.length}
        </p>
      )}
    </form>
  )
}

function ImportedQuestionsSection() {
  const [importState, setImportState] = useState({ status: 'idle' })
  const [categoriesState, setCategoriesState] = useState({ status: 'loading', categories: [] })
  const [questionsState, setQuestionsState] = useState({ status: 'loading', questions: [] })

  const refreshCategories = () => {
    setCategoriesState((s) => ({ ...s, status: 'loading' }))
    getImportedCategories()
      .then((categories) => setCategoriesState({ status: 'ok', categories }))
      .catch((error) => setCategoriesState({ status: 'error', error: error.message }))
  }

  const refreshQuestions = () => {
    setQuestionsState((s) => ({ ...s, status: 'loading' }))
    getImportedQuestions()
      .then((questions) => setQuestionsState({ status: 'ok', questions }))
      .catch((error) => setQuestionsState({ status: 'error', error: error.message }))
  }

  useEffect(refreshCategories, [])
  useEffect(refreshQuestions, [])

  const handleImport = async () => {
    setImportState({ status: 'loading' })
    try {
      const result = await importQuestions()
      setImportState({ status: 'ok', imported: result.imported })
      refreshCategories()
      refreshQuestions()
    } catch (error) {
      setImportState({ status: 'error', error: error.message })
    }
  }

  return (
    <>
      <div className="import-questions">
        <button type="button" onClick={handleImport} disabled={importState.status === 'loading'}>
          {importState.status === 'loading' ? 'Import en cours...' : 'Importer les questions'}
        </button>
        {importState.status === 'ok' && (
          <p className="categories-status">{importState.imported} question(s) importée(s).</p>
        )}
        {importState.status === 'error' && (
          <p className="categories-status error">Échec de l'import : {importState.error}</p>
        )}
      </div>

      {categoriesState.status === 'loading' && (
        <p className="categories-status">Chargement des catégories importées...</p>
      )}
      {categoriesState.status === 'error' && (
        <p className="categories-status error">
          Impossible de charger les catégories importées : {categoriesState.error}
        </p>
      )}
      {categoriesState.status === 'ok' && categoriesState.categories.length === 0 && (
        <p className="categories-status">Aucune catégorie importée pour l'instant.</p>
      )}
      {categoriesState.status === 'ok' && categoriesState.categories.length > 0 && (
        <ul className="category-grid">
          {categoriesState.categories.map((category) => (
            <li key={category.id} className="category-card">
              {category.name} ({category.questions_count})
            </li>
          ))}
        </ul>
      )}

      {questionsState.status === 'loading' && (
        <p className="categories-status">Chargement des questions importées...</p>
      )}
      {questionsState.status === 'error' && (
        <p className="categories-status error">
          Impossible de charger les questions importées : {questionsState.error}
        </p>
      )}
      {questionsState.status === 'ok' && questionsState.questions.length === 0 && (
        <p className="categories-status">Aucune question importée pour l'instant.</p>
      )}
      {questionsState.status === 'ok' && questionsState.questions.length > 0 && (
        <QuizQuestions questions={questionsState.questions} />
      )}
    </>
  )
}

function CategoriesSection() {
  const [state, setState] = useState({ status: 'loading', categories: [] })
  const [name, setName] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [formError, setFormError] = useState(null)

  const refresh = () => {
    setState((s) => ({ ...s, status: 'loading' }))
    getCategories()
      .then((categories) => setState({ status: 'ok', categories }))
      .catch((error) => setState({ status: 'error', error: error.message }))
  }

  useEffect(refresh, [])

  const handleSubmit = async (event) => {
    event.preventDefault()
    const trimmed = name.trim()
    if (!trimmed) return

    setSubmitting(true)
    setFormError(null)
    try {
      await createCategory(trimmed)
      setName('')
      refresh()
    } catch (error) {
      setFormError(error.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <>
      <form className="category-form" onSubmit={handleSubmit}>
        <input
          type="text"
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="Nom de la catégorie"
          aria-label="Nom de la catégorie"
        />
        <button type="submit" disabled={submitting || !name.trim()}>
          Ajouter
        </button>
      </form>
      {formError && <p className="categories-status error">{formError}</p>}

      {state.status === 'loading' && (
        <p className="categories-status">Chargement des catégories...</p>
      )}
      {state.status === 'error' && (
        <p className="categories-status error">
          Impossible de charger les catégories : {state.error}
        </p>
      )}
      {state.status === 'ok' && state.categories.length === 0 && (
        <p className="categories-status">Aucune catégorie pour l'instant.</p>
      )}
      {state.status === 'ok' && state.categories.length > 0 && (
        <ul className="category-grid">
          {state.categories.map((category) => (
            <li key={category.id} className="category-card">
              {category.name}
            </li>
          ))}
        </ul>
      )}
    </>
  )
}

function App() {
  return (
    <>
      <header className="topbar">
        <span className="brand">Quizify</span>
      </header>

      <section className="hero">
        <h1>Teste tes connaissances avec Quizify</h1>
        <p className="tagline">
          Crée, organise et joue à des quiz classés par catégorie.
        </p>
      </section>

      <section className="categories">
        <h2>Catégories</h2>
        <CategoriesSection />
      </section>

      <section className="categories">
        <h2>Questions</h2>
        <ImportedQuestionsSection />
      </section>

      <footer className="footer">
        <p>Quizify — projet Ynov M2</p>
      </footer>
    </>
  )
}

export default App
