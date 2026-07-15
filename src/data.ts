/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Product } from './types';

export interface PracticalGuide {
  id: string;
  title: string;
  shortDesc: string;
  fullDesc: string;
  imageUrl: string;
  badgeType: 'doc' | 'hive' | 'honey';
}

export interface LegislationUpdate {
  id: string;
  title: string;
  shortDesc: string;
  fullDesc: string;
  badgeType: 'doc' | 'hive' | 'book';
}

export interface ApiculturaAlert {
  id: string;
  date: string;
  time: string;
  message: string;
  type: 'danger' | 'warning' | 'info';
  iconType: 'pin' | 'fire' | 'doc';
}

export const PRACTICAL_GUIDES: PracticalGuide[] = [
  {
    id: 'guide-1',
    title: 'Guia Completo de Manejo de Outono',
    shortDesc: 'Guia completo de Manejo de Outono commenciaria.',
    fullDesc: 'O maneio de outono é crucial para garantir a sobrevivência das colónias durante o inverno. Este guia aborda a redução do ninho para conservar a temperatura, a alimentação de suporte (xarope de açúcar 2:1 ou pasta energética), a avaliação das reservas de pólen e a colocação de redutores de entrada para evitar a pilhagem por vespas asiáticas. Realize uma inspeção minuciosa para detetar sinais precoces de doenças antes que as temperaturas desçam abaixo dos 12 graus.',
    imageUrl: '/manejo_outono.jpg',
    badgeType: 'doc'
  },
  {
    id: 'guide-2',
    title: 'Melhoramento Genético de Rainhas',
    shortDesc: 'Melhoramento genético de Rainhas como Portugal.',
    fullDesc: 'A seleção de rainhas adaptadas localmente melhora a resistência natural a pragas e aumenta consideravelmente a produtividade de mel. Este manual descreve as técnicas de enxertia pelo método de Doolittle, a seleção de colónias dadoras com base na mansidão, comportamento higiénico contra a varroose e vigor de postura. Aprenda a gerir as estações de fecundação no Norte de Portugal e a introduzir rainhas selecionadas com segurança no apiário.',
    imageUrl: '/melhoramento_rainhas.jpg',
    badgeType: 'hive'
  },
  {
    id: 'guide-3',
    title: 'Técnicas Sustentáveis de Colheita',
    shortDesc: 'Técnicas sustentáveis de colheita comnenitais.',
    fullDesc: 'Preservar a qualidade do mel desde o favo até ao frasco é a marca da apicultura responsável. Discutimos a recolha de alças usando escapes de abelhas ou sopradores sem stresse, a desoperculação com faca a frio para reter compostos voláteis e a centrifugação radial. O mel deve decantar durante pelo menos 15 dias antes do embalamento para separar todas as impurezas e micro-bolhas de ar de forma natural, assegurando a conformidade com a DOP Terra Quente Transmontana.',
    imageUrl: '/colheita_sustentavel.jpg',
    badgeType: 'honey'
  }
];

export const LEGISLATION_UPDATES: LegislationUpdate[] = [
  {
    id: 'leg-1',
    title: 'Nova Política Agrícola Comum (PAC) para Apicultores',
    shortDesc: 'Nova Política Agrícola Comum (PAC) para Apicultores.',
    fullDesc: 'O novo quadro comunitário traz alterações importantes nos critérios de elegibilidade para apoios apícolas. Os apicultores registados podem beneficiar de subsídios diretos para a conversão biológica, aquisição de de medicamentos homologados pelo PAS e compensações por perdas causadas por predadores ou alterações climáticas. Saiba como submeter a candidatura na AANP.',
    badgeType: 'doc'
  },
  {
    id: 'leg-2',
    title: 'Decreto-Lei sobre Rastreabilidade do Mel',
    shortDesc: 'Decreto-Lei sobre rastreabilidade do Mel',
    fullDesc: 'A nova legislação de comercialização exige controlos rigorosos sobre a origem botânica e geográfica do mel português. Todos os lotes comercializados devem possuir um registo de lote associado ao número do apicultor e georreferenciação dos apiários produtores. Frascos de mel artesanal devem cumprir as regras exatas de rotulagem nutricional.',
    badgeType: 'hive'
  },
  {
    id: 'leg-3',
    title: 'Consultoria Pública: Plano de Controle de Doenças',
    shortDesc: 'Consultoria Pública: Plano de Controle de Doenças',
    fullDesc: 'A Direção-Geral de Alimentação e Veterinária (DGAV) abriu a consulta pública para a revisão do Plano de Controlo da Varroose e Vespa Velutina. A AANP submeteu propostas para a comparticipação de 100% nas harpas elétricas e a simplificação dos procedimentos de queima e higienização de ninhos contaminados por Loque Americana.',
    badgeType: 'book'
  }
];

export const APICULTURA_ALERTS: ApiculturaAlert[] = [
  {
    id: 'alert-1',
    date: 'Out 26',
    time: '10:00',
    message: 'Alerta de Vespa Velutina na Região Norte. Ação imediata necessária.',
    type: 'danger',
    iconType: 'pin'
  },
  {
    id: 'alert-2',
    date: 'Out 24',
    time: '14:30',
    message: 'Risco de Fogo Elevado em Áreas Florestais. Seguir protocolos de segurança.',
    type: 'warning',
    iconType: 'fire'
  },
  {
    id: 'alert-3',
    date: 'Out 20',
    time: '09:15',
    message: 'Atualização sobre Legislação de Uso de Pesticidas.',
    type: 'info',
    iconType: 'doc'
  }
];

export const SHOP_PRODUCTS: Product[] = [
  {
    id: 'prod-mel-urze',
    name: 'Mel de Urze DOP (Terra Quente Transmontana)',
    category: 'mel-e-derivados',
    price: 8.50,
    weightOrDetail: 'Frasco de 500g',
    description: 'Mel biológico de cor escura, aroma marcante e textura rica, colhido nas montanhas de Trás-os-Montes. Produto com denominação de origem protegida (DOP).',
    imageUrl: '/mel_urze.jpg',
    stockStatus: 'em-stock'
  },
  {
    id: 'prod-mel-castanheiro',
    name: 'Mel de Castanheiro',
    category: 'mel-e-derivados',
    price: 7.80,
    weightOrDetail: 'Frasco de 500g',
    description: 'Mel monovarietal de castanheiro com notas amargas e forte teor em sais minerais. Ideal para acompanhar queijos tradicionais.',
    imageUrl: '/colheita_sustentavel.jpg',
    stockStatus: 'em-stock'
  },
  {
    id: 'prod-polen',
    name: 'Pólen Apícola Nacional Seco',
    category: 'mel-e-derivados',
    price: 6.20,
    weightOrDetail: 'Frasco de 200g',
    description: 'Pólen natural seco recolhido pelos nossos associados na Região Norte. Excelente suplemento vitamínico e reconstituinte.',
    imageUrl: '/melhoramento_rainhas.jpg',
    stockStatus: 'poucas-unidades'
  },
  {
    id: 'prod-propolis',
    name: 'Extrato de Própolis Pura 30%',
    category: 'mel-e-derivados',
    price: 9.90,
    weightOrDetail: 'Frasco conta-gotas de 30ml',
    description: 'Protetor natural produzido pelas abelhas. Ideal para reforçar o sistema imunitário e tratamento de afeições buco-faríngeas.',
    imageUrl: '/melhoramento_rainhas.jpg',
    stockStatus: 'em-stock'
  },
  {
    id: 'prod-sabonete-mel',
    name: 'Sabonete Natural de Mel e Própolis',
    category: 'cosmetica',
    price: 3.50,
    weightOrDetail: 'Barra de 100g',
    description: 'Produzido artesanalmente com mel de urze e extrato de própolis. Hidratação profunda, ação antisséptica e regeneradora para todo o tipo de pele.',
    imageUrl: '/sabonete_mel.jpg',
    stockStatus: 'em-stock'
  },
  {
    id: 'prod-creme-cera',
    name: 'Creme Hidratante de Cera de Abelha',
    category: 'cosmetica',
    price: 12.00,
    weightOrDetail: 'Boiao de 50ml',
    description: 'Fórmula tradicional transmontana com óleo de amêndoas doces e cera virgem de abelha. Nutrição intensa e barreira protetora contra o frio.',
    imageUrl: '/sabonete_mel.jpg',
    stockStatus: 'poucas-unidades'
  },
  {
    id: 'prod-balso-labial',
    name: 'Bálsamo Labial Protetor de Própolis',
    category: 'cosmetica',
    price: 2.80,
    weightOrDetail: 'Stick de 5g',
    description: 'Proteção e reparação diária dos lábios. Combate cieiro e gretas com as propriedades cicatrizantes da própolis pura.',
    imageUrl: '/sabonete_mel.jpg',
    stockStatus: 'em-stock'
  },
  {
    id: 'prod-fato-completo',
    name: 'Fato de Apicultor Profissional com Máscara',
    category: 'produtos-apicolas',
    price: 45.00,
    weightOrDetail: 'Tamanho L / XL',
    description: 'Fato macaco completo de proteção em algodão grosso com máscara redonda integrada. Elásticos de segurança nos punhos e tornozelos.',
    imageUrl: '/fato_apicultor.jpg',
    stockStatus: 'em-stock'
  },
  {
    id: 'prod-cera-laminada',
    name: 'Cera de Abelha Laminada e Esterilizada',
    category: 'produtos-apicolas',
    price: 13.50,
    weightOrDetail: 'Pacote de 1kg (10 folhas)',
    description: 'Cera de abelha nacional laminada e devidamente esterilizada nos nossos postos sanitários para prevenção de loque e varroose.',
    imageUrl: '/manejo_outono.jpg',
    stockStatus: 'em-stock'
  },
  {
    id: 'prod-fumador-inox',
    name: 'Fumador de Apicultura Inox com Grelha',
    category: 'produtos-apicolas',
    price: 22.00,
    weightOrDetail: 'Diâmetro 10cm',
    description: 'Fumador clássico em aço inoxidável com proteção de calor exterior e fole em pele reforçado. Ideal para acalmar as abelhas nas inspeções.',
    imageUrl: '/fato_apicultor.jpg',
    stockStatus: 'em-stock'
  }
];

