import { useEffect, useState } from 'react'
import { createCategory, getCategories } from './api/categories'
import { importQuestions } from './api/importedQuestions'
import './App.css'

function ImportQuestionsButton() {
  const [state, setState] = useState({ status: 'idle' })

  const handleImport = async () => {
    setState({ status: 'loading' })
    try {
      const result = await importQuestions()
      setState({ status: 'ok', imported: result.imported })
    } catch (error) {
      setState({ status: 'error', error: error.message })
    }
  }

  return (
    <div className="import-questions">
      <button type="button" onClick={handleImport} disabled={state.status === 'loading'}>
        {state.status === 'loading' ? 'Import en cours...' : 'Importer les questions'}
      </button>
      {state.status === 'ok' && (
        <p className="categories-status">{state.imported} question(s) importée(s).</p>
      )}
      {state.status === 'error' && (
        <p className="categories-status error">Échec de l'import : {state.error}</p>
      )}
    </div>
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
        <ImportQuestionsButton />
      </section>

      <footer className="footer">
        <p>Quizify — projet Ynov M2</p>
      </footer>
    </>
  )
}

export default App
