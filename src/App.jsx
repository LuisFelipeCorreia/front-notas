import { useState, useEffect } from 'react'
import './App.css'

const API_URL = 'https://projeto-notas-back.vercel.app/notas'

export default function App() {
  const [notas, setNotas] = useState([])
  const [titulo, setTitulo] = useState('')
  const [conteudo, setConteudo] = useState('')
  const [editandoId, setEditandoId] = useState(null)
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState('')

  const carregarNotas = async () => {
    try {
      setCarregando(true)
      const res = await fetch(API_URL)
      if (!res.ok) throw new Error('Falha ao carregar notas')
      const dados = await res.json()
      setNotas(dados)
      setErro('')
    } catch (e) {
      setErro(e.message)
    } finally {
      setCarregando(false)
    }
  }

  useEffect(() => {
    carregarNotas()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!titulo.trim() || !conteudo.trim()) return

    try {
      const url = editandoId ? `${API_URL}/${editandoId}` : API_URL
      const method = editandoId ? 'PUT' : 'POST'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ titulo, conteudo })
      })

      if (!res.ok) throw new Error('Erro ao salvar nota')

      setTitulo('')
      setConteudo('')
      setEditandoId(null)
      carregarNotas()
    } catch (e) {
      setErro(e.message)
    }
  }

  const iniciarEdicao = (nota) => {
    setEditandoId(nota.id)
    setTitulo(nota.titulo)
    setConteudo(nota.conteudo)
  }

  const cancelarEdicao = () => {
    setEditandoId(null)
    setTitulo('')
    setConteudo('')
  }

  const excluirNota = async (id) => {
    try {
      const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Erro ao excluir nota')
      carregarNotas()
    } catch (e) {
      setErro(e.message)
    }
  }

  return (
    <div className="app">
      <header className="topo">
        <span className="badge">Aula 05 • CRUD Full-Stack</span>
        <h1>Gerenciador de Notas</h1>
        <p>Front-end React integrado à API Express com persistência em JSON.</p>
      </header>

      <form className="formulario" onSubmit={handleSubmit}>
        <h2>{editandoId ? `Editando Nota #${editandoId}` : 'Nova Nota'}</h2>
        <input
          type="text"
          placeholder="Título da nota..."
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          required
        />
        <textarea
          rows="3"
          placeholder="Conteúdo da nota..."
          value={conteudo}
          onChange={(e) => setConteudo(e.target.value)}
          required
        />
        <div className="form-acoes">
          <button type="submit" className="btn-primario">
            {editandoId ? '💾 Salvar Alterações' : '➕ Adicionar Nota'}
          </button>
          {editandoId && (
            <button type="button" className="btn-secundario" onClick={cancelarEdicao}>
              Cancelar
            </button>
          )}
        </div>
      </form>

      {erro && <p className="erro">⚠️ {erro}</p>}

      <section className="lista-secao">
        <h2>Notas Salvas ({notas.length})</h2>
        {carregando ? (
          <p className="vazio">Carregando notas...</p>
        ) : notas.length === 0 ? (
          <p className="vazio">Nenhuma nota cadastrada.</p>
        ) : (
          <div className="grid">
            {notas.map((nota) => (
              <article key={nota.id} className="card">
                <div className="card-header">
                  <span className="id-tag">#{nota.id}</span>
                  <h3>{nota.titulo}</h3>
                </div>
                <p>{nota.conteudo}</p>
                <div className="card-acoes">
                  <button className="btn-editar" onClick={() => iniciarEdicao(nota)}>
                    ✏️ Editar
                  </button>
                  <button className="btn-excluir" onClick={() => excluirNota(nota.id)}>
                    🗑️ Excluir
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}