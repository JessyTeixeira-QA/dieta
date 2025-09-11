// Utilitário para gerenciamento de dados locais
export class DataManager {
  static KEYS = {
    CRONOGRAMAS: 'cronogramas',
    CRONOGRAMA_ATIVO: 'cronograma_ativo',
    ROTINAS: 'rotinas',
    CONFIGURACOES: 'configuracoes_usuario',
    HISTORICO_SINTOMAS: 'historico_sintomas',
    ALIMENTOS_FAVORITOS: 'alimentos_favoritos'
  }

  // Cronogramas
  static salvarCronograma(nome, cronograma) {
    const cronogramas = this.getCronogramas()
    const id = Date.now().toString()
    cronogramas[id] = {
      id,
      nome,
      cronograma,
      dataCriacao: new Date().toISOString(),
      dataModificacao: new Date().toISOString()
    }
    localStorage.setItem(this.KEYS.CRONOGRAMAS, JSON.stringify(cronogramas))
    return id
  }

  static getCronogramas() {
    const cronogramas = localStorage.getItem(this.KEYS.CRONOGRAMAS)
    return cronogramas ? JSON.parse(cronogramas) : {}
  }

  static getCronograma(id) {
    const cronogramas = this.getCronogramas()
    return cronogramas[id] || null
  }

  static deletarCronograma(id) {
    const cronogramas = this.getCronogramas()
    delete cronogramas[id]
    localStorage.setItem(this.KEYS.CRONOGRAMAS, JSON.stringify(cronogramas))
  }

  static setCronogramaAtivo(id) {
    localStorage.setItem(this.KEYS.CRONOGRAMA_ATIVO, id)
  }

  static getCronogramaAtivo() {
    return localStorage.getItem(this.KEYS.CRONOGRAMA_ATIVO)
  }

  // Rotinas
  static salvarRotinas(rotinas) {
    const dados = {
      rotinas,
      data: new Date().toISOString()
    }
    localStorage.setItem(this.KEYS.ROTINAS, JSON.stringify(dados))
  }

  static getRotinas() {
    const dados = localStorage.getItem(this.KEYS.ROTINAS)
    return dados ? JSON.parse(dados).rotinas : {}
  }

  // Configurações do usuário
  static salvarConfiguracoes(configuracoes) {
    const configAtual = this.getConfiguracoes()
    const novaConfig = { ...configAtual, ...configuracoes }
    localStorage.setItem(this.KEYS.CONFIGURACOES, JSON.stringify(novaConfig))
  }

  static getConfiguracoes() {
    const config = localStorage.getItem(this.KEYS.CONFIGURACOES)
    return config ? JSON.parse(config) : {
      objetivos: [],
      restricoes: [],
      preferencias: [],
      nivelAtividade: 'moderado',
      numeroRefeicoes: 4,
      tempoPreparacao: 'moderado'
    }
  }

  // Histórico de sintomas
  static adicionarSintoma(sintoma) {
    const historico = this.getHistoricoSintomas()
    const entrada = {
      id: Date.now().toString(),
      ...sintoma,
      data: new Date().toISOString()
    }
    historico.push(entrada)
    localStorage.setItem(this.KEYS.HISTORICO_SINTOMAS, JSON.stringify(historico))
  }

  static getHistoricoSintomas() {
    const historico = localStorage.getItem(this.KEYS.HISTORICO_SINTOMAS)
    return historico ? JSON.parse(historico) : []
  }

  // Alimentos favoritos
  static adicionarAlimentoFavorito(alimento) {
    const favoritos = this.getAlimentosFavoritos()
    if (!favoritos.includes(alimento)) {
      favoritos.push(alimento)
      localStorage.setItem(this.KEYS.ALIMENTOS_FAVORITOS, JSON.stringify(favoritos))
    }
  }

  static removerAlimentoFavorito(alimento) {
    const favoritos = this.getAlimentosFavoritos()
    const novosFavoritos = favoritos.filter(f => f !== alimento)
    localStorage.setItem(this.KEYS.ALIMENTOS_FAVORITOS, JSON.stringify(novosFavoritos))
  }

  static getAlimentosFavoritos() {
    const favoritos = localStorage.getItem(this.KEYS.ALIMENTOS_FAVORITOS)
    return favoritos ? JSON.parse(favoritos) : []
  }

  // Exportar todos os dados
  static exportarDados() {
    const dados = {
      cronogramas: this.getCronogramas(),
      cronogramaAtivo: this.getCronogramaAtivo(),
      rotinas: this.getRotinas(),
      configuracoes: this.getConfiguracoes(),
      historicoSintomas: this.getHistoricoSintomas(),
      alimentosFavoritos: this.getAlimentosFavoritos(),
      dataExportacao: new Date().toISOString()
    }
    return JSON.stringify(dados, null, 2)
  }

  // Importar dados
  static importarDados(dadosJson) {
    try {
      const dados = JSON.parse(dadosJson)
      
      if (dados.cronogramas) {
        localStorage.setItem(this.KEYS.CRONOGRAMAS, JSON.stringify(dados.cronogramas))
      }
      if (dados.cronogramaAtivo) {
        localStorage.setItem(this.KEYS.CRONOGRAMA_ATIVO, dados.cronogramaAtivo)
      }
      if (dados.rotinas) {
        this.salvarRotinas(dados.rotinas)
      }
      if (dados.configuracoes) {
        localStorage.setItem(this.KEYS.CONFIGURACOES, JSON.stringify(dados.configuracoes))
      }
      if (dados.historicoSintomas) {
        localStorage.setItem(this.KEYS.HISTORICO_SINTOMAS, JSON.stringify(dados.historicoSintomas))
      }
      if (dados.alimentosFavoritos) {
        localStorage.setItem(this.KEYS.ALIMENTOS_FAVORITOS, JSON.stringify(dados.alimentosFavoritos))
      }
      
      return true
    } catch (error) {
      console.error('Erro ao importar dados:', error)
      return false
    }
  }

  // Limpar todos os dados
  static limparTodosDados() {
    Object.values(this.KEYS).forEach(key => {
      localStorage.removeItem(key)
    })
  }
}

