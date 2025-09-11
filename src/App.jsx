import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Textarea } from '@/components/ui/textarea.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Checkbox } from '@/components/ui/checkbox.jsx'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.jsx'
import { Heart, Apple, Calendar, Clock, CheckCircle, Plus, Trash2, Edit, Settings, Save, Upload, Download } from 'lucide-react'
import './App.css'
import { DataManager } from './utils/dataManager.js'
import foodsData from './data/foods.json'
import { CronogramaGenerator } from './utils/cronogramaGenerator.js'

function App() {
  const [cronogramasSalvos, setCronogramasSalvos] = useState(DataManager.getCronogramas())
  const [cronogramaAtivoId, setCronogramaAtivoId] = useState(DataManager.getCronogramaAtivo())
  const [cronogramaAtual, setCronogramaAtual] = useState(() => {
    const ativo = DataManager.getCronogramaAtivo()
    const cronos = DataManager.getCronogramas()
    return ativo && cronos[ativo] ? cronos[ativo].cronograma : {
      segunda: { cafeManha: '', almoco: '', lanche: '', jantar: '' },
      terca: { cafeManha: '', almoco: '', lanche: '', jantar: '' },
      quarta: { cafeManha: '', almoco: '', lanche: '', jantar: '' },
      quinta: { cafeManha: '', almoco: '', lanche: '', jantar: '' },
      sexta: { cafeManha: '', almoco: '', lanche: '', jantar: '' },
      sabado: { cafeManha: '', almoco: '', lanche: '', jantar: '' },
      domingo: { cafeManha: '', almoco: '', lanche: '', jantar: '' }
    }
  })

  const [rotinasCompletas, setRotinasCompletas] = useState(DataManager.getRotinas())
  const [editandoCronograma, setEditandoCronograma] = useState(false)
  const [novoCronogramaNome, setNovoCronogramaNome] = useState('')
  const [configuracoes, setConfiguracoes] = useState(DataManager.getConfiguracoes())

  useEffect(() => {
    if (cronogramaAtivoId) {
      DataManager.setCronogramaAtivo(cronogramaAtivoId)
    }
  }, [cronogramaAtivoId])

  useEffect(() => {
    DataManager.salvarRotinas(rotinasCompletas)
  }, [rotinasCompletas])

  const salvarCronograma = () => {
    if (novoCronogramaNome.trim() === '') {
      alert('Por favor, dê um nome ao cronograma antes de salvar.')
      return
    }
    const id = DataManager.salvarCronograma(novoCronogramaNome, cronogramaAtual)
    setCronogramasSalvos(DataManager.getCronogramas())
    setCronogramaAtivoId(id)
    setEditandoCronograma(false)
    setNovoCronogramaNome('')
    alert('Cronograma salvo com sucesso!')
  }

  const carregarCronograma = (id) => {
    const crono = DataManager.getCronograma(id)
    if (crono) {
      setCronogramaAtual(crono.cronograma)
      setCronogramaAtivoId(id)
      setNovoCronogramaNome(crono.nome)
      alert(`Cronograma '${crono.nome}' carregado com sucesso!`)
    }
  }

  const deletarCronograma = (id) => {
    if (window.confirm('Tem certeza que deseja deletar este cronograma?')) {
      DataManager.deletarCronograma(id)
      setCronogramasSalvos(DataManager.getCronogramas())
      if (cronogramaAtivoId === id) {
        setCronogramaAtivoId(null)
        setCronogramaAtual({
          segunda: { cafeManha: '', almoco: '', lanche: '', jantar: '' },
          terca: { cafeManha: '', almoco: '', lanche: '', jantar: '' },
          quarta: { cafeManha: '', almoco: '', lanche: '', jantar: '' },
          quinta: { cafeManha: '', almoco: '', lanche: '', jantar: '' },
          sexta: { cafeManha: '', almoco: '', lanche: '', jantar: '' },
          sabado: { cafeManha: '', almoco: '', lanche: '', jantar: '' },
          domingo: { cafeManha: '', almoco: '', lanche: '', jantar: '' }
        })
      }
      alert('Cronograma deletado com sucesso!')
    }
  }

  const alimentosRecomendados = [
    { categoria: 'Frutas', itens: ['Mamão', 'Pera', 'Ameixa', 'Laranja', 'Abacaxi', 'Pêssego', 'Melão', 'Figo'] },
    { categoria: 'Vegetais', itens: ['Alface', 'Couve', 'Brócolis', 'Abóbora', 'Cenoura', 'Abobrinha', 'Espinafre'] },
    { categoria: 'Cereais', itens: ['Aveia', 'Quinoa', 'Arroz integral', 'Chia', 'Linhaça', 'Tapioca'] },
    { categoria: 'Proteínas', itens: ['Frango grelhado', 'Peixe', 'Ovos', 'Tofu', 'Lentilha', 'Grão-de-bico'] },
    { categoria: 'Probióticos', itens: ['Iogurte natural', 'Kefir', 'Kombucha', 'Chucrute', 'Kimchi'] }
  ]

  const alimentosEvitar = [
    'Alimentos processados', 'Frituras', 'Açúcar refinado', 'Bebidas gaseificadas',
    'Carnes vermelhas em excesso', 'Laticínios em excesso', 'Glúten (se sensível)',
    'Álcool', 'Café em excesso', 'Alimentos muito condimentados'
  ]

  const rotinasRecomendadas = [
    { id: 1, titulo: 'Beber água em jejum', descricao: '1-2 copos de água morna ao acordar' },
    { id: 2, titulo: 'Exercícios leves', descricao: '30 minutos de caminhada ou yoga' },
    { id: 3, titulo: 'Refeições regulares', descricao: 'Comer a cada 3-4 horas' },
    { id: 4, titulo: 'Mastigação consciente', descricao: 'Mastigar bem os alimentos' },
    { id: 5, titulo: 'Hidratação constante', descricao: '2-3 litros de água por dia' },
    { id: 6, titulo: 'Sono adequado', descricao: '7-8 horas de sono por noite' },
    { id: 7, titulo: 'Gerenciar estresse', descricao: 'Meditação ou respiração profunda' },
    { id: 8, titulo: 'Probióticos diários', descricao: 'Consumir alimentos fermentados' }
  ]

  const dias = ['segunda', 'terca', 'quarta', 'quinta', 'sexta', 'sabado', 'domingo']
  const diasNomes = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo']
  const refeicoes = ['cafeManha', 'almoco', 'lanche', 'jantar']
  const refeicoesNomes = ['Café da Manhã', 'Almoço', 'Lanche', 'Jantar']

  const toggleRotina = (id) => {
    const novasRotinas = {
      ...rotinasCompletas,
      [id]: !rotinasCompletas[id]
    }
    setRotinasCompletas(novasRotinas)
  }

  const handleConfigChange = (key, value) => {
    const novasConfigs = { ...configuracoes, [key]: value }
    setConfiguracoes(novasConfigs)
    DataManager.salvarConfiguracoes(novasConfigs)
  }

  const gerarCronogramaInteligente = () => {
    const gerador = new CronogramaGenerator(configuracoes)
    const novoCronograma = gerador.gerarCronograma()
    
    setCronogramaAtual(novoCronograma)
    setNovoCronogramaNome('Cronograma Inteligente ' + new Date().toLocaleDateString())
    
    // Analisar o cronograma gerado
    const analise = gerador.analisarCronograma(novoCronograma)
    
    let mensagem = 'Cronograma inteligente gerado com base nas suas configurações!\n\n'
    mensagem += `Análise nutricional:\n`
    mensagem += `• Alimentos ricos em fibras: ${analise.fibras}\n`
    mensagem += `• Alimentos probióticos: ${analise.probioticos}\n`
    mensagem += `• Fontes de proteína: ${analise.proteinas}\n`
    mensagem += `• Variedade de alimentos: ${analise.variedade}\n\n`
    
    if (analise.recomendacoes.length > 0) {
      mensagem += 'Recomendações:\n'
      analise.recomendacoes.forEach(rec => {
        mensagem += `• ${rec}\n`
      })
    }
    
    alert(mensagem)
  }

  const exportarDados = () => {
    const dataStr = DataManager.exportarDados()
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr)
    const exportFileDefaultName = 'dieta_intestinal_dados.json'

    let linkElement = document.createElement('a')
    linkElement.setAttribute('href', dataUri)
    linkElement.setAttribute('download', exportFileDefaultName)
    linkElement.click()
    alert('Dados exportados com sucesso!')
  }

  const importarDados = (event) => {
    const file = event.target.files[0]
    if (!file) {
      return
    }
    const reader = new FileReader()
    reader.onload = (e) => {
      const content = e.target.result
      if (DataManager.importarDados(content)) {
        setCronogramasSalvos(DataManager.getCronogramas())
        setCronogramaAtivoId(DataManager.getCronogramaAtivo())
        const ativo = DataManager.getCronogramaAtivo()
        const cronos = DataManager.getCronogramas()
        setCronogramaAtual(ativo && cronos[ativo] ? cronos[ativo].cronograma : {
          segunda: { cafeManha: '', almoco: '', lanche: '', jantar: '' },
          terca: { cafeManha: '', almoco: '', lanche: '', jantar: '' },
          quarta: { cafeManha: '', almoco: '', lanche: '', jantar: '' },
          quinta: { cafeManha: '', almoco: '', lanche: '', jantar: '' },
          sexta: { cafeManha: '', almoco: '', lanche: '', jantar: '' },
          sabado: { cafeManha: '', almoco: '', lanche: '', jantar: '' },
          domingo: { cafeManha: '', almoco: '', lanche: '', jantar: '' }
        })
        setRotinasCompletas(DataManager.getRotinas())
        setConfiguracoes(DataManager.getConfiguracoes())
        alert('Dados importados com sucesso!')
      } else {
        alert('Erro ao importar dados. Verifique o formato do arquivo.')
      }
    }
    reader.readAsText(file)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Heart className="h-8 w-8 text-green-600" />
              <h1 className="text-2xl font-bold text-gray-900">Dieta para Intestino Saudável</h1>
            </div>
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              Saúde Digestiva
            </Badge>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="inicio" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="inicio">Início</TabsTrigger>
            <TabsTrigger value="alimentos">Alimentos</TabsTrigger>
            <TabsTrigger value="cronograma">Cronograma</TabsTrigger>
            <TabsTrigger value="rotinas">Rotinas</TabsTrigger>
            <TabsTrigger value="dicas">Dicas</TabsTrigger>
            <TabsTrigger value="configuracoes">Configurações</TabsTrigger>
          </TabsList>

          {/* Página Inicial */}
          <TabsContent value="inicio" className="space-y-6">
            <div className="text-center py-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Cuide da Sua Saúde Intestinal
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
                Um intestino saudável é fundamental para o bem-estar geral. Descubra alimentos, 
                rotinas e cronogramas personalizados para melhorar sua digestão e qualidade de vida.
              </p>
              <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                <Card className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <Apple className="h-12 w-12 text-green-600 mx-auto mb-2" />
                    <CardTitle>Alimentos Certos</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600">
                      Descubra quais alimentos favorecem a saúde intestinal e quais evitar.
                    </p>
                  </CardContent>
                </Card>
                <Card className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <Calendar className="h-12 w-12 text-blue-600 mx-auto mb-2" />
                    <CardTitle>Cronograma Personalizado</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600">
                      Crie e edite seu cronograma semanal de refeições de forma fácil.
                    </p>
                  </CardContent>
                </Card>
                <Card className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <Clock className="h-12 w-12 text-purple-600 mx-auto mb-2" />
                    <CardTitle>Rotinas Saudáveis</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600">
                      Estabeleça rotinas diárias que promovem a saúde digestiva.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Lista de Alimentos */}
          <TabsContent value="alimentos" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-green-700 flex items-center">
                    <CheckCircle className="h-5 w-5 mr-2" />
                    Alimentos Recomendados
                  </CardTitle>
                  <CardDescription>
                    Alimentos que favorecem a saúde intestinal
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {alimentosRecomendados.map((categoria, index) => (
                    <div key={index}>
                      <h4 className="font-semibold text-gray-900 mb-2">{categoria.categoria}</h4>
                      <div className="flex flex-wrap gap-2">
                        {categoria.itens.map((item, itemIndex) => (
                          <Badge key={itemIndex} variant="secondary" className="bg-green-100 text-green-800">
                            {item}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-red-700 flex items-center">
                    <Trash2 className="h-5 w-5 mr-2" />
                    Alimentos a Evitar
                  </CardTitle>
                  <CardDescription>
                    Alimentos que podem prejudicar a saúde intestinal
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {alimentosEvitar.map((item, index) => (
                      <Badge key={index} variant="destructive" className="bg-red-100 text-red-800">
                        {item}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Cronograma */}
          <TabsContent value="cronograma" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Cronograma Semanal de Refeições</CardTitle>
                    <CardDescription>
                      Planeje suas refeições para a semana
                    </CardDescription>
                  </div>
                  <div className="space-x-2 flex items-center">
                    <Input
                      type="text"
                      placeholder="Nome do Cronograma"
                      value={novoCronogramaNome}
                      onChange={(e) => setNovoCronogramaNome(e.target.value)}
                      className="w-48"
                    />
                    <Button onClick={salvarCronograma} className="bg-green-600 hover:bg-green-700">
                      <Save className="h-4 w-4 mr-2" /> Salvar
                    </Button>
                    {editandoCronograma ? (
                      <Button variant="outline" onClick={() => setEditandoCronograma(false)}>
                        Cancelar
                      </Button>
                    ) : (
                      <Button onClick={() => setEditandoCronograma(true)} variant="outline">
                        <Edit className="h-4 w-4 mr-2" /> Editar
                      </Button>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="mb-4 flex items-center space-x-2">
                  <h3 className="font-semibold">Cronogramas Salvos:</h3>
                  <Select onValueChange={carregarCronograma} value={cronogramaAtivoId || ''}>
                    <SelectTrigger className="w-[200px]">
                      <SelectValue placeholder="Selecione um cronograma" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(cronogramasSalvos).map(([id, crono]) => (
                        <SelectItem key={id} value={id}>
                          {crono.nome}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {cronogramaAtivoId && (
                    <Button variant="destructive" size="icon" onClick={() => deletarCronograma(cronogramaAtivoId)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                  <Button onClick={gerarCronogramaInteligente} className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="h-4 w-4 mr-2" /> Gerar Cronograma Inteligente
                  </Button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr>
                        <th className="border p-2 bg-gray-50 text-left">Dia</th>
                        {refeicoesNomes.map((refeicao) => (
                          <th key={refeicao} className="border p-2 bg-gray-50 text-left min-w-[200px]">
                            {refeicao}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {dias.map((dia, diaIndex) => (
                        <tr key={dia}>
                          <td className="border p-2 font-medium bg-gray-50">
                            {diasNomes[diaIndex]}
                          </td>
                          {refeicoes.map((refeicao) => (
                            <td key={refeicao} className="border p-2">
                              {editandoCronograma ? (
                                <Textarea
                                  value={cronogramaAtual[dia][refeicao]}
                                  onChange={(e) => setCronogramaAtual({
                                    ...cronogramaAtual,
                                    [dia]: {
                                      ...cronogramaAtual[dia],
                                      [refeicao]: e.target.value
                                    }
                                  })}
                                  placeholder="Digite sua refeição..."
                                  className="min-h-[60px]"
                                />
                              ) : (
                                <div className="min-h-[60px] p-2 text-sm">
                                  {cronogramaAtual[dia][refeicao] || 'Não definido'}
                                </div>
                              )}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Rotinas */}
          <TabsContent value="rotinas" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Rotinas Diárias para Saúde Intestinal</CardTitle>
                <CardDescription>
                  Marque as rotinas que você já completou hoje
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  {rotinasRecomendadas.map((rotina) => (
                    <div key={rotina.id} className="flex items-start space-x-3 p-4 border rounded-lg hover:bg-gray-50">
                      <Checkbox
                        checked={rotinasCompletas[rotina.id] || false}
                        onCheckedChange={() => toggleRotina(rotina.id)}
                        className="mt-1"
                      />
                      <div className="flex-1">
                        <h4 className={`font-medium ${rotinasCompletas[rotina.id] ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                          {rotina.titulo}
                        </h4>
                        <p className={`text-sm ${rotinasCompletas[rotina.id] ? 'line-through text-gray-400' : 'text-gray-600'}`}>
                          {rotina.descricao}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Dicas */}
          <TabsContent value="dicas" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Dicas Importantes</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <h4 className="font-medium text-blue-900">Hidratação</h4>
                      <p className="text-sm text-blue-700">Beba pelo menos 2 litros de água por dia, preferencialmente entre as refeições.</p>
                    </div>
                    <div className="p-3 bg-green-50 rounded-lg">
                      <h4 className="font-medium text-green-900">Fibras</h4>
                      <p className="text-sm text-green-700">Aumente gradualmente o consumo de fibras para evitar desconforto intestinal.</p>
                    </div>
                    <div className="p-3 bg-purple-50 rounded-lg">
                      <h4 className="font-medium text-purple-900">Exercícios</h4>
                      <p className="text-sm text-purple-700">Atividade física regular estimula o funcionamento intestinal.</p>
                    </div>
                    <div className="p-3 bg-orange-50 rounded-lg">
                      <h4 className="font-medium text-orange-900">Estresse</h4>
                      <p className="text-sm text-orange-700">Gerencie o estresse, pois ele afeta diretamente a saúde intestinal.</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Sinais de Melhora</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm">Evacuações regulares (1-3 vezes por dia)</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm">Redução de gases e inchaço</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm">Melhora na digestão</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm">Aumento da energia</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm">Melhora do humor</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm">Pele mais saudável</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Configurações */}
          <TabsContent value="configuracoes" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Settings className="h-5 w-5 mr-2" />
                  Configurações do Usuário
                </CardTitle>
                <CardDescription>
                  Defina suas preferências para o gerador de cronogramas.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Objetivos de Saúde Intestinal:</h4>
                  <div className="flex flex-wrap gap-2">
                    {['Redução de inchaço', 'Melhora da digestão', 'Aumento da regularidade', 'Mais energia', 'Melhora da pele'].map(obj => (
                      <Badge
                        key={obj}
                        variant={configuracoes.objetivos.includes(obj) ? 'default' : 'outline'}
                        onClick={() => {
                          const novosObjetivos = configuracoes.objetivos.includes(obj)
                            ? configuracoes.objetivos.filter(item => item !== obj)
                            : [...configuracoes.objetivos, obj]
                          handleConfigChange('objetivos', novosObjetivos)
                        }}
                        className="cursor-pointer"
                      >
                        {obj}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Restrições Alimentares:</h4>
                  <div className="flex flex-wrap gap-2">
                    {['Glúten', 'Lactose', 'Vegetariano', 'Vegano', 'Frutos do Mar', 'Nozes'].map(rest => (
                      <Badge
                        key={rest}
                        variant={configuracoes.restricoes.includes(rest) ? 'default' : 'outline'}
                        onClick={() => {
                          const novasRestricoes = configuracoes.restricoes.includes(rest)
                            ? configuracoes.restricoes.filter(item => item !== rest)
                            : [...configuracoes.restricoes, rest]
                          handleConfigChange('restricoes', novasRestricoes)
                        }}
                        className="cursor-pointer"
                      >
                        {rest}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Nível de Atividade Física:</h4>
                  <Select value={configuracoes.nivelAtividade} onValueChange={(value) => handleConfigChange('nivelAtividade', value)}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sedentario">Sedentário</SelectItem>
                      <SelectItem value="levemente_ativo">Levemente Ativo</SelectItem>
                      <SelectItem value="moderado">Moderado</SelectItem>
                      <SelectItem value="muito_ativo">Muito Ativo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Número de Refeições por Dia:</h4>
                  <Input
                    type="number"
                    value={configuracoes.numeroRefeicoes}
                    onChange={(e) => handleConfigChange('numeroRefeicoes', parseInt(e.target.value) || 0)}
                    className="w-24"
                    min="1"
                    max="6"
                  />
                </div>

                <div className="flex space-x-4">
                  <Button onClick={exportarDados} variant="outline">
                    <Download className="h-4 w-4 mr-2" /> Exportar Dados
                  </Button>
                  <Input type="file" accept=".json" onChange={importarDados} className="hidden" id="import-file" />
                  <Button variant="outline" onClick={() => document.getElementById('import-file').click()}>
                    <Upload className="h-4 w-4 mr-2" /> Importar Dados
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-600">
            <p>© 2025 Dieta para Intestino Saudável. Consulte sempre um profissional de saúde.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App


