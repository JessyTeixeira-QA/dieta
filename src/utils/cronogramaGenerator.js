import foodsData from '../data/foods.json'

export class CronogramaGenerator {
  constructor(configuracoes) {
    this.configuracoes = configuracoes
    this.alimentos = foodsData
  }

  // Filtrar alimentos baseado nas restrições do usuário
  filtrarAlimentosPorRestricoes(alimentos) {
    return alimentos.filter(alimento => {
      // Verificar restrições alimentares
      if (this.configuracoes.restricoes.includes('Vegetariano') && 
          ['Proteínas'].includes(alimento.categoria) && 
          ['Frango Grelhado', 'Peixe'].includes(alimento.nome)) {
        return false
      }
      
      if (this.configuracoes.restricoes.includes('Vegano') && 
          ['Probióticos', 'Proteínas'].includes(alimento.categoria) && 
          ['Iogurte Natural', 'Kefir', 'Frango Grelhado', 'Peixe'].includes(alimento.nome)) {
        return false
      }
      
      if (this.configuracoes.restricoes.includes('Glúten') && 
          alimento.nome.toLowerCase().includes('glúten')) {
        return false
      }
      
      if (this.configuracoes.restricoes.includes('Lactose') && 
          ['Iogurte Natural', 'Kefir'].includes(alimento.nome)) {
        return false
      }
      
      return true
    })
  }

  // Selecionar alimentos baseado nos objetivos
  selecionarAlimentosPorObjetivos(alimentos) {
    const alimentosPrioritarios = []
    
    this.configuracoes.objetivos.forEach(objetivo => {
      switch (objetivo) {
        case 'Redução de inchaço':
          alimentosPrioritarios.push(...alimentos.filter(a => 
            a.propriedades?.anti_inflamatorio === 'sim' || 
            a.propriedades?.digestivo === 'sim'
          ))
          break
        case 'Melhora da digestão':
          alimentosPrioritarios.push(...alimentos.filter(a => 
            a.propriedades?.enzimas === 'sim' || 
            a.propriedades?.probioticos === 'sim'
          ))
          break
        case 'Aumento da regularidade':
          alimentosPrioritarios.push(...alimentos.filter(a => 
            a.propriedades?.fibras === 'alta'
          ))
          break
        case 'Mais energia':
          alimentosPrioritarios.push(...alimentos.filter(a => 
            a.propriedades?.proteina === 'alta' || 
            a.propriedades?.carboidratos_complexos === 'sim'
          ))
          break
      }
    })
    
    // Remover duplicatas e retornar lista única
    return [...new Set(alimentosPrioritarios)]
  }

  // Gerar refeição baseada no tipo e horário
  gerarRefeicao(tipoRefeicao, alimentosDisponiveis) {
    const refeicoes = {
      cafeManha: {
        base: alimentosDisponiveis.filter(a => ['Cereais', 'Frutas', 'Probióticos'].includes(a.categoria)),
        complementos: ['com', 'e', 'acompanhado de'],
        exemplos: [
          'Aveia com {fruta} e {semente}',
          '{probiotico} com {fruta} e mel',
          'Smoothie de {fruta} com {probiotico}',
          'Mingau de {cereal} com {fruta}'
        ]
      },
      almoco: {
        base: alimentosDisponiveis.filter(a => ['Proteínas', 'Vegetais', 'Cereais'].includes(a.categoria)),
        exemplos: [
          '{proteina} grelhada com {vegetal} e {cereal}',
          'Salada de {cereal} com {proteina} e {vegetal}',
          '{proteina} assada com {vegetal} refogado',
          'Sopa de {proteina} com {vegetal} e {cereal}'
        ]
      },
      lanche: {
        base: alimentosDisponiveis.filter(a => ['Frutas', 'Probióticos', 'Sementes'].includes(a.categoria)),
        exemplos: [
          '{fruta} com {probiotico}',
          'Mix de {semente} e {fruta}',
          '{probiotico} natural',
          'Smoothie de {fruta}'
        ]
      },
      jantar: {
        base: alimentosDisponiveis.filter(a => ['Proteínas', 'Vegetais'].includes(a.categoria)),
        exemplos: [
          '{proteina} grelhada com {vegetal}',
          'Sopa de {vegetal} com {proteina}',
          'Omelete com {vegetal}',
          '{proteina} refogada com {vegetal}'
        ]
      }
    }

    const config = refeicoes[tipoRefeicao]
    if (!config || config.base.length === 0) {
      return 'Refeição livre (consulte a lista de alimentos recomendados)'
    }

    // Selecionar exemplo aleatório
    const exemplo = config.exemplos[Math.floor(Math.random() * config.exemplos.length)]
    
    // Substituir placeholders por alimentos reais
    let refeicaoFinal = exemplo
    
    // Substituir por categoria
    const categorias = {
      '{fruta}': alimentosDisponiveis.filter(a => a.categoria === 'Frutas'),
      '{vegetal}': alimentosDisponiveis.filter(a => a.categoria === 'Vegetais'),
      '{proteina}': alimentosDisponiveis.filter(a => a.categoria === 'Proteínas'),
      '{cereal}': alimentosDisponiveis.filter(a => a.categoria === 'Cereais'),
      '{probiotico}': alimentosDisponiveis.filter(a => a.categoria === 'Probióticos'),
      '{semente}': alimentosDisponiveis.filter(a => a.categoria === 'Sementes')
    }

    Object.entries(categorias).forEach(([placeholder, alimentos]) => {
      if (refeicaoFinal.includes(placeholder) && alimentos.length > 0) {
        const alimentoEscolhido = alimentos[Math.floor(Math.random() * alimentos.length)]
        refeicaoFinal = refeicaoFinal.replace(placeholder, alimentoEscolhido.nome.toLowerCase())
      }
    })

    return refeicaoFinal
  }

  // Gerar cronograma completo
  gerarCronograma() {
    // Filtrar alimentos baseado nas configurações
    const alimentosFiltrados = this.filtrarAlimentosPorRestricoes(this.alimentos)
    const alimentosPrioritarios = this.selecionarAlimentosPorObjetivos(alimentosFiltrados)
    
    // Usar alimentos prioritários se disponíveis, senão usar todos os filtrados
    const alimentosParaUso = alimentosPrioritarios.length > 0 ? alimentosPrioritarios : alimentosFiltrados

    const dias = ['segunda', 'terca', 'quarta', 'quinta', 'sexta', 'sabado', 'domingo']
    const refeicoes = ['cafeManha', 'almoco', 'lanche', 'jantar']
    
    const cronograma = {}

    dias.forEach(dia => {
      cronograma[dia] = {}
      refeicoes.forEach(refeicao => {
        cronograma[dia][refeicao] = this.gerarRefeicao(refeicao, alimentosParaUso)
      })
    })

    return cronograma
  }

  // Gerar sugestões de substituição para uma refeição específica
  gerarSubstituicoes(tipoRefeicao, refeicaoAtual) {
    const alimentosFiltrados = this.filtrarAlimentosPorRestricoes(this.alimentos)
    const sugestoes = []
    
    for (let i = 0; i < 3; i++) {
      const novaRefeicao = this.gerarRefeicao(tipoRefeicao, alimentosFiltrados)
      if (novaRefeicao !== refeicaoAtual && !sugestoes.includes(novaRefeicao)) {
        sugestoes.push(novaRefeicao)
      }
    }
    
    return sugestoes
  }

  // Analisar cronograma e dar feedback nutricional
  analisarCronograma(cronograma) {
    const analise = {
      fibras: 0,
      probioticos: 0,
      proteinas: 0,
      variedade: 0,
      recomendacoes: []
    }

    const alimentosUsados = new Set()
    
    Object.values(cronograma).forEach(dia => {
      Object.values(dia).forEach(refeicao => {
        if (refeicao && refeicao !== 'Não definido') {
          // Contar alimentos únicos para variedade
          const palavras = refeicao.toLowerCase().split(' ')
          this.alimentos.forEach(alimento => {
            if (palavras.some(palavra => alimento.nome.toLowerCase().includes(palavra))) {
              alimentosUsados.add(alimento.nome)
              
              // Contar propriedades nutricionais
              if (alimento.propriedades?.fibras === 'alta') analise.fibras++
              if (alimento.propriedades?.probioticos === 'sim') analise.probioticos++
              if (alimento.propriedades?.proteina === 'alta') analise.proteinas++
            }
          })
        }
      })
    })

    analise.variedade = alimentosUsados.size

    // Gerar recomendações
    if (analise.fibras < 7) {
      analise.recomendacoes.push('Considere adicionar mais alimentos ricos em fibras como aveia, quinoa e vegetais.')
    }
    
    if (analise.probioticos < 3) {
      analise.recomendacoes.push('Inclua mais alimentos probióticos como iogurte natural e kefir.')
    }
    
    if (analise.proteinas < 5) {
      analise.recomendacoes.push('Certifique-se de incluir proteínas adequadas em cada refeição.')
    }
    
    if (analise.variedade < 10) {
      analise.recomendacoes.push('Tente variar mais os alimentos para obter diferentes nutrientes.')
    }

    return analise
  }
}

// Função auxiliar para criar gerador com configurações padrão
export function criarGeradorPadrao() {
  const configPadrao = {
    objetivos: ['Melhora da digestão', 'Aumento da regularidade'],
    restricoes: [],
    nivelAtividade: 'moderado',
    numeroRefeicoes: 4,
    tempoPreparacao: 'moderado'
  }
  
  return new CronogramaGenerator(configPadrao)
}

