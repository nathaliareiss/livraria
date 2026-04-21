
import api from './api'


//aqui vamos buscar livros do google
async function buscarLivrosExternos(termo){
    const response = await api.get(`/books/search?q=${termo}`)
    return response.data
}

//adicionar livros na estante
async function adicionarLivro(livro){
    const response = await api.post('/livros',{
        googleBookId:livro.googleId,
        titulo:livro.titulo,
        autores:livro.autores || [],
        editora: livro.editora,
        descricao:livro.descricao,
        thumbnail:livro.thumbnail
    })
    return response.data
}

//listar toda a estante
async function getEstante(){
    const response = await api.get('/estante')
    return response.data
}

//alternar favorito
async function alternarFavorito(livroId){
    const response = await api.patch(`/livros/${livroId}/favorito`)
    return response.data
}
//alternar quero ler
async function alternarQueroLer(livroId){
    const response = await api.patch(`/livros/${livroId}/quero-ler`)
    return response.data
}
//aqui iniciamos a leitura
async function iniciarLeitura(livroId){
    const response= await api.post(`/leitura/iniciar/${livroId}`)
    return response.data
}
//aqui finalizamos a leitura
async function finalizarLeitura(livroId){
    const response = await api.post(`/leitura/finalizar/${livroId}`)
    return response.data
}

export{
    buscarLivrosExternos,
    adicionarLivro,
    getEstante,
    alternarFavorito,
    alternarQueroLer,
    iniciarLeitura,
    finalizarLeitura
}