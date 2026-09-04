import { useEffect, useState } from 'react'
import { getCategories } from './api/categories'
import './App.css'

function CategoryList() {
  const [state, setState] = useState({ status: 'loading', categories: [] })

  useEffect(() => {
    getCategories()
      .then((categories) => setState({ status: 'ok', categories }))
      .catch((error) => setState({ status: 'error', error: error.message }))
  }, [])

  if (state.status === 'loading') {
    return <p className="categories-status">Chargement des catégories...</p>
  }

  if (state.status === 'error') {
    return <p className="categories-status error">Impossible de charger les catégories : {state.error}</p>
  }

  if (state.categories.length === 0) {
    return <p className="categories-status">Aucune catégorie pour l'instant.</p>
  }

  return (
    <ul className="category-grid">
      {state.categories.map((category) => (
        <li key={category.id} className="category-card">
          {category.name}
        </li>
      ))}
    </ul>
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
        <CategoryList />
      </section>

      <footer className="footer">
        <p>Quizify — projet Ynov M2</p>
      </footer>
    </>
  )
}

export default App
