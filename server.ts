/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = parseInt(process.env.PORT || '3005', 10);

// Body parser
app.use(express.json());

// Lazy-initialized Gemini client
let aiClient: GoogleGenAI | null = null;

function getGeminiClient(): GoogleGenAI | null {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      console.warn('GEMINI_API_KEY is not defined. Using highly realistic local Portuguese beekeeping database for Facebook feed.');
      return null;
    }
    aiClient = new GoogleGenAI({
      apiKey: key,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

// Fallback high-quality representational beekeeping posts for AANP (Mirandela/Bragança)
const fallbackPosts = [
  {
    id: 'fb_post_1',
    content: '🐝 REGISTO OBRIGATÓRIO DE EXISTÊNCIAS - SETEMBRO 2026\n\nRelembramos todos os apicultores associados que, de acordo com o Decreto-Lei em vigor, o mês de Setembro é o período oficial para a Declaração de Existências de Apiários.\n\nA entrega da sua declaração é obrigatória para manter a sua atividade regularizada perante a DGAV. A AANP disponibiliza apoio presencial nas nossas instalações em Mirandela, Macedo de Cavaleiros e Bragança para preenchimento e submissão do formulário.\n\nDocumentos necessários: Cartão de Cidadão, NIF e número de apicultor.\n\nNão deixe para os últimos dias! Para marcações, contacte os nossos serviços veterinários ou envie mensagem.',
    date: '2026-07-10T14:30:00Z',
    likes: 42,
    commentsCount: 8,
    shares: 15,
    imageUrl: '/manejo_outono.jpg',
    link: 'https://www.facebook.com/apicultores.norte'
  },
  {
    id: 'fb_post_2',
    content: '⚠️ ALERTA VESPA VELUTINA (VESPA ASIÁTICA)\n\nCom o aumento das temperaturas de verão, verifica-se uma forte pressão de Vespa Velutina nos apiários do Norte de Portugal. Solicitamos a todos os apicultores que monitorizem atentamente as suas colmeias e reforcem as armadilhas de proteção.\n\nA AANP tem disponível para distribuição gratuita aos associados inscritos na associação novas harpas elétricas e atrativo biológico para Vespa Velutina.\n\nSe detetar um ninho, não tente intervir sozinho! Comunique imediatamente à proteção civil local ou através da nossa linha de apoio técnico.\n\nJuntos protegemos as nossas abelhas! 🐝🛡️',
    date: '2026-07-05T09:15:00Z',
    likes: 67,
    commentsCount: 14,
    shares: 31,
    imageUrl: '/melhoramento_rainhas.jpg',
    link: 'https://www.facebook.com/apicultores.norte'
  },
  {
    id: 'fb_post_3',
    content: '🍯 TRATAMENTOS DE VARROOSE E DISTRIBUIÇÃO DE CERA\n\nInformamos que já se encontra disponível a segunda fase de distribuição de tratamentos homologados contra a Varroose (Apivar, Apistan e Oxybee) no âmbito do Programa Apícola Nacional.\n\nPoderá levantar os seus tratamentos e efetuar a troca de cera velha por cera laminada esterilizada na sede da AANP em Mirandela de segunda a sexta-feira, das 09h00 às 13h00 e das 14h00 às 18h00.\n\nA saúde do seu apiário é a garantia de uma excelente colheita de mel da Terra Quente Transmontana!',
    date: '2026-06-28T16:45:00Z',
    likes: 38,
    commentsCount: 5,
    shares: 9,
    imageUrl: '/colheita_sustentavel.jpg',
    link: 'https://www.facebook.com/apicultores.norte'
  },
  {
    id: 'fb_post_4',
    content: '🏆 PARABÉNS AOS VENCEDORES DO CONCURSO DE MEL DOP TRANSMONTANO 2026!\n\nO mel da Terra Quente Transmontana volta a distinguir-se nas provas oficiais. A AANP congratula todos os produtores que participaram neste ano e que mantêm vivo o legado de qualidade apícola do nosso território.\n\nOs prémios foram entregues na cerimónia anual da Associação em Mirandela, com a presença de representantes da Câmara Municipal e da DGAV.',
    date: '2026-06-20T11:00:00Z',
    likes: 95,
    commentsCount: 22,
    shares: 40,
    imageUrl: '/mel_urze.jpg',
    link: 'https://www.facebook.com/apicultores.norte'
  },
  {
    id: 'fb_post_5',
    content: '📋 FORMAÇÃO: MANEIO DE PRIMAVERA E ENXAMEAÇÃO\n\nRealiza-se no próximo sábado, pelas 09h30, na sede da AANP em Mirandela, uma sessão prática gratuita sobre maneio de primavera e técnicas de prevenção de enxameação.\n\nLugares limitados! Inscreva-se através da nossa página ou diretamente nos serviços da associação. A formação é acreditada pela DGAV e conta para o registo de formação profissional apícola.',
    date: '2026-06-12T08:00:00Z',
    likes: 54,
    commentsCount: 11,
    shares: 28,
    imageUrl: '/manejo_outono.jpg',
    link: 'https://www.facebook.com/apicultores.norte'
  },
  {
    id: 'fb_post_6',
    content: '🌿 MELHORAMENTO GENÉTICO E SELEÇÃO DE RAINHAS\n\nA AANP disponibiliza este verão rainhas de linhagem local selecionadas para docilidade, produtividade e resistência à Varroose. Estas rainhas são produzidas por apicultores certificados da nossa rede de multiplicadores.\n\nContacte-nos para saber os preços e condições de entrega. Stock limitado — prioridade para associados em situação regularizada.',
    date: '2026-06-05T09:30:00Z',
    likes: 71,
    commentsCount: 16,
    shares: 19,
    imageUrl: '/melhoramento_rainhas.jpg',
    link: 'https://www.facebook.com/apicultores.norte'
  },
  {
    id: 'fb_post_7',
    content: '📢 ASSEMBLEIA GERAL ORDINÁRIA 2026 — CONVOCATÓRIA\n\nFica convocada a Assembleia Geral Ordinária da AANP para o próximo mês, nas instalações da sede em Mirandela.\n\nOrdem de trabalhos:\n1. Aprovação do relatório de contas 2025\n2. Eleição dos órgãos sociais\n3. Discussão e aprovação do plano de atividades 2026/2027\n\nTodos os sócios com quotas regularizadas têm direito a voto. Consulte o regulamento para mais informações.',
    date: '2026-05-28T15:00:00Z',
    likes: 33,
    commentsCount: 7,
    shares: 12,
    imageUrl: '/colheita_sustentavel.jpg',
    link: 'https://www.facebook.com/apicultores.norte'
  },
  {
    id: 'fb_post_8',
    content: '🛡️ NOVO EQUIPAMENTO DISPONÍVEL NA LOJA AANP\n\nPassámos a disponibilizar novos fatos de apicultor completos, luvas de nitrilo e ferramentas de maneio de qualidade profissional na nossa loja física em Mirandela e também na loja online.\n\nOs associados beneficiam de 10% de desconto na compra de equipamento de proteção individual (EPI) apícola. Consulte o catálogo completo no nosso portal.',
    date: '2026-05-15T10:00:00Z',
    likes: 48,
    commentsCount: 9,
    shares: 14,
    imageUrl: '/fato_apicultor.jpg',
    link: 'https://www.facebook.com/apicultores.norte'
  },
  {
    id: 'fb_post_9',
    content: '🌸 TEMPORADA DE FLORAÇÃO: ACOMPANHE AS COLMEIAS!\n\nCom a chegada da primavera ao Nordeste Transmontano, a floração de rosmaninho, castanheiro e urze está a proporcionar excelentes condições de néctar. É a altura ideal para reforçar alças, verificar o estado das rainhas e preparar as colónias para a grande produção de verão.\n\nLembre-se: uma colónia bem preparada agora é sinónimo de mel de qualidade em Setembro!',
    date: '2026-05-02T08:00:00Z',
    likes: 83,
    commentsCount: 18,
    shares: 35,
    imageUrl: '/melhoramento_rainhas.jpg',
    link: 'https://www.facebook.com/apicultores.norte'
  },
  {
    id: 'fb_post_10',
    content: '📰 NOVA LEGISLAÇÃO APÍCOLA PUBLICADA EM DIÁRIO DA REPÚBLICA\n\nFoi publicado o novo Regulamento de Saúde Animal que altera os requisitos de rastreabilidade apícola em Portugal. A AANP está a preparar um guia resumo e um webinar de esclarecimento para todos os associados.\n\nConsulte a nossa secção de legislação no portal do membro para aceder ao texto integral e às nossas anotações técnicas.',
    date: '2026-04-20T14:00:00Z',
    likes: 29,
    commentsCount: 4,
    shares: 17,
    imageUrl: '/colheita_sustentavel.jpg',
    link: 'https://www.facebook.com/apicultores.norte'
  }
];

/**
 * Fetches real posts from the Facebook Graph API.
 *
 * HOW TO GET A PAGE ACCESS TOKEN:
 * 1. Go to https://developers.facebook.com and create an app (type: Business).
 * 2. Add the "Pages API" product to your app.
 * 3. Go to Graph API Explorer: https://developers.facebook.com/tools/explorer/
 * 4. Select your app and generate a User Access Token with permissions:
 *    - pages_read_engagement
 *    - pages_show_list
 * 5. Use that token to call: GET /me/accounts — find your page and copy its access_token.
 * 6. For a long-lived token, exchange it via:
 *    GET /oauth/access_token?grant_type=fb_exchange_token&client_id=APP_ID&client_secret=APP_SECRET&fb_exchange_token=SHORT_TOKEN
 * 7. Add to .env:
 *    FB_PAGE_ACCESS_TOKEN=your_page_access_token_here
 *    FB_PAGE_ID=apicultores.norte   (or the numeric page ID)
 */
async function fetchFacebookPosts(): Promise<{ posts: any[]; source: string }> {
  const fbToken = process.env.FB_PAGE_ACCESS_TOKEN;
  const fbPageId = process.env.FB_PAGE_ID || 'apicultores.norte';

  if (!fbToken) {
    console.info('ℹ️  FB_PAGE_ACCESS_TOKEN not set. See instructions in server.ts to configure the live Facebook feed.');
    return { posts: [], source: 'none' };
  }

  try {
    const fields = 'id,message,story,created_time,full_picture,permalink_url,reactions.summary(true),comments.summary(true),shares';
    const url = `https://graph.facebook.com/v20.0/${fbPageId}/posts?fields=${encodeURIComponent(fields)}&limit=10&access_token=${fbToken}`;

    const fbResponse = await fetch(url, { signal: AbortSignal.timeout(6000) });

    if (!fbResponse.ok) {
      const errBody = await fbResponse.text();
      console.warn(`Facebook Graph API returned ${fbResponse.status}: ${errBody}`);
      throw new Error(`Facebook API HTTP ${fbResponse.status}`);
    }

    const fbData: any = await fbResponse.json();

    if (fbData.error) {
      console.warn('Facebook Graph API error:', fbData.error.message);
      throw new Error(fbData.error.message);
    }

    const posts = (fbData.data || [])
      .map((post: any) => ({
        id: post.id,
        content: post.message || post.story || '',
        date: post.created_time,
        likes: post.reactions?.summary?.total_count ?? 0,
        commentsCount: post.comments?.summary?.total_count ?? 0,
        shares: post.shares?.count ?? 0,
        imageUrl: post.full_picture || null,
        link: post.permalink_url || 'https://www.facebook.com/apicultores.norte',
      }))
      .filter((p: any) => p.content.trim().length > 0);

    console.log(`✅ Fetched ${posts.length} real posts from Facebook Graph API.`);
    return { posts, source: 'facebook_graph_api' };
  } catch (err: any) {
    console.warn('Facebook Graph API fetch failed, falling back to AI/local:', err.message);
    return { posts: [], source: 'none' };
  }
}

// --- IN-MEMORY DATABASE SCHEMA & INSTANCES ---
let ALERTS_DB = [
  {
    id: "alert-1",
    date: "Out 26",
    time: "10:00",
    message: "Alerta de Vespa Velutina na Regi\xE3o Norte. A\xE7\xE3o imediata necess\xE1ria.",
    type: "danger",
    iconType: "pin"
  },
  {
    id: "alert-2",
    date: "Out 24",
    time: "14:30",
    message: "Risco de Fogo Elevado em \xC1reas Florestais. Seguir protocolos de seguran\xE7a.",
    type: "warning",
    iconType: "fire"
  },
  {
    id: "alert-3",
    date: "Out 20",
    time: "09:15",
    message: "Atualiza\xE7\xE3o sobre Legisla\xE7\xE3o de Uso de Pesticidas.",
    type: "info",
    iconType: "doc"
  }
];
let PRODUCTS_DB = [
  {
    id: "prod-mel-urze",
    name: "Mel de Urze DOP (Terra Quente Transmontana)",
    category: "mel-e-derivados",
    price: 8.5,
    weightOrDetail: "Frasco de 500g",
    description: "Mel biol\xF3gico de cor escura, aroma marcante e textura rica, colhido nas montanhas de Tr\xE1s-os-Montes. Produto com denomina\xE7\xE3o de origem protegida (DOP).",
    imageUrl: "/mel_urze.jpg",
    stockStatus: "em-stock"
  },
  {
    id: "prod-mel-castanheiro",
    name: "Mel de Castanheiro",
    category: "mel-e-derivados",
    price: 7.8,
    weightOrDetail: "Frasco de 500g",
    description: "Mel monovarietal de castanheiro com notas amargas e forte teor em sais minerais. Ideal para acompanhar queijos tradicionais.",
    imageUrl: "/colheita_sustentavel.jpg",
    stockStatus: "em-stock"
  },
  {
    id: "prod-polen",
    name: "P\xF3len Ap\xEDcola Nacional Seco",
    category: "mel-e-derivados",
    price: 6.2,
    weightOrDetail: "Frasco de 200g",
    description: "P\xF3len natural seco recolhido pelos nossos associados na Regi\xE3o Norte. Excelente suplemento vitam\xEDnico e reconstituinte.",
    imageUrl: "/melhoramento_rainhas.jpg",
    stockStatus: "poucas-unidades"
  },
  {
    id: "prod-propolis",
    name: "Extrato de Pr\xF3polis Pura 30%",
    category: "mel-e-derivados",
    price: 9.9,
    weightOrDetail: "Frasco conta-gotas de 30ml",
    description: "Protetor natural produzido pelas abelhas. Ideal para refor\xE7ar o sistema imunit\xE1rio e tratamento de afei\xE7\xF5es buco-far\xEDngeas.",
    imageUrl: "/melhoramento_rainhas.jpg",
    stockStatus: "em-stock"
  },
  {
    id: "prod-sabonete-mel",
    name: "Sabonete Natural de Mel e Pr\xF3polis",
    category: "cosmetica",
    price: 3.5,
    weightOrDetail: "Barra de 100g",
    description: "Produzido artesanalmente com mel de urze e extrato de pr\xF3polis. Hidrata\xE7\xE3o profunda, a\xE7\xE3o antiss\xE9ptica e regeneradora para todo o tipo de pele.",
    imageUrl: "/sabonete_mel.jpg",
    stockStatus: "em-stock"
  },
  {
    id: "prod-creme-cera",
    name: "Creme Hidratante de Cera de Abelha",
    category: "cosmetica",
    price: 12,
    weightOrDetail: "Boiao de 50ml",
    description: "F\xF3rmula tradicional transmontana com \xF3leo de am\xEAndoas doces e cera virgem de abelha. Nutri\xE7\xE3o intensa e barreira protetora contra o frio.",
    imageUrl: "/sabonete_mel.jpg",
    stockStatus: "poucas-unidades"
  },
  {
    id: "prod-balso-labial",
    name: "B\xE1lsamo Labial Protetor de Pr\xF3polis",
    category: "cosmetica",
    price: 2.8,
    weightOrDetail: "Stick de 5g",
    description: "Prote\xE7\xE3o e repara\xE7\xE3o di\xE1ria dos l\xE1bios. Combate cieiro e gretas com as propriedades cicatrizantes da pr\xF3polis pura.",
    imageUrl: "/sabonete_mel.jpg",
    stockStatus: "em-stock"
  },
  {
    id: "prod-fato-completo",
    name: "Fato de Apicultor Profissional com M\xE1scara",
    category: "produtos-apicolas",
    price: 45,
    weightOrDetail: "Tamanho L / XL",
    description: "Fato macaco completo de prote\xE7\xE3o em algod\xE3o grosso com m\xE1scara redonda integrada. El\xE1sticos de seguran\xE7a nos punhos e tornozelos.",
    imageUrl: "/fato_apicultor.jpg",
    stockStatus: "em-stock"
  },
  {
    id: "prod-cera-laminada",
    name: "Cera de Abelha Laminada e Esterilizada",
    category: "produtos-apicolas",
    price: 13.5,
    weightOrDetail: "Pacote de 1kg (10 folhas)",
    description: "Cera de abelha nacional laminada e devidamente esterilizada nos nossos postos sanit\xE1rios para preven\xE7\xE3o de loque e varroose.",
    imageUrl: "/manejo_outono.jpg",
    stockStatus: "em-stock"
  },
  {
    id: "prod-fumador-inox",
    name: "Fumador de Apicultura Inox com Grelha",
    category: "produtos-apicolas",
    price: 22,
    weightOrDetail: "Di\xE2metro 10cm",
    description: "Fumador cl\xE1ssico em a\xE7o inoxid\xE1vel com prote\xE7\xE3o de calor exterior e fole em pele refor\xE7ado. Ideal para acalmar as abelhas nas inspe\xE7\xF5es.",
    imageUrl: "/fato_apicultor.jpg",
    stockStatus: "em-stock"
  }
];
let GUIDES_DB = [
  {
    id: "guide-1",
    title: "Guia Completo de Manejo de Outono",
    shortDesc: "Guia completo de Manejo de Outono commenciaria.",
    fullDesc: "O maneio de outono \xE9 crucial para garantir a sobreviv\xEAncia das col\xF3nias durante o inverno. Este guia aborda a redu\xE7\xE3o do ninho para conservar a temperatura, a alimenta\xE7\xE3o de suporte (xarope de a\xE7\xFAcar 2:1 ou pasta energ\xE9tica), a avalia\xE7\xE3o das reservas de p\xF3len e a coloca\xE7\xE3o de redutores de entrada para evitar a pilhagem por vespas asi\xE1ticas. Realize uma inspe\xE7\xE3o minuciosa para detetar sinais precoces de doen\xE7as antes que as temperaturas des\xE7am abaixo dos 12 graus.",
    imageUrl: "/manejo_outono.jpg",
    badgeType: "doc"
  },
  {
    id: "guide-2",
    title: "Melhoramento Gen\xE9tico de Rainhas",
    shortDesc: "Melhoramento gen\xE9tico de Rainhas como Portugal.",
    fullDesc: "A sele\xE7\xE3o de rainhas adaptadas localmente melhora a resist\xEAncia natural a pragas e aumenta consideravelmente a produtividade de mel. Este manual descreve as t\xE9cnicas de enxertia pelo m\xE9todo de Doolittle, a sele\xE7\xE3o de col\xF3nias dadoras com base na mansid\xE3o, comportamento higi\xE9nico contra a varroose e vigor de postura. Aprenda a gerir as esta\xE7\xF5es de fecunda\xE7\xE3o no Norte de Portugal e a introduzir rainhas selecionadas com seguran\xE7a no api\xE1rio.",
    imageUrl: "/melhoramento_rainhas.jpg",
    badgeType: "hive"
  },
  {
    id: "guide-3",
    title: "T\xE9cnicas Sustent\xE1veis de Colheita",
    shortDesc: "T\xE9cnicas sustent\xE1veis de colheita comnenitais.",
    fullDesc: "Preservar a qualidade do mel desde o favo at\xE9 ao frasco \xE9 a marca da apicultura respons\xE1vel. Discutimos a recolha de al\xE7as usando escapes de abelhas ou sopradores sem stresse, a desopercula\xE7\xE3o com faca a frio para reter compostos vol\xE1teis e a centrifuga\xE7\xE3o radial. O mel deve decantar durante pelo menos 15 dias antes do embalamento para separar todas as impurezas e micro-bolhas de ar de forma natural, assegurando a conformidade com a DOP Terra Quente Transmontana.",
    imageUrl: "/colheita_sustentavel.jpg",
    badgeType: "honey"
  }
];
let LEGISLATION_DB = [
  {
    id: "leg-1",
    title: "Nova Pol\xEDtica Agr\xEDcola Comum (PAC) para Apicultores",
    shortDesc: "Nova Pol\xEDtica Agr\xEDcola Comum (PAC) para Apicultores.",
    fullDesc: "O novo quadro comunit\xE1rio traz altera\xE7\xF5es importantes nos crit\xE9rios de elegibilidade para apoios ap\xEDcolas. Os apicultores registados podem beneficiar de subs\xEDdios diretos para a convers\xE3o biol\xF3gica, aquisi\xE7\xE3o de medicamentos homologados e compensa\xE7\xF5es por perdas causadas por predadores ou altera\xE7\xF5es clim\xE1ticas. Saiba como submeter a candidatura na AANP.",
    badgeType: "doc"
  },
  {
    id: "leg-2",
    title: "Decreto-Lei sobre Rastreabilidade do Mel",
    shortDesc: "Decreto-Lei sobre rastreabilidade do Mel",
    fullDesc: "A nova legisla\xE7\xE3o de comercializa\xE7\xE3o exige controlos rigorosos sobre a origem bot\xE2nica e geogr\xE1fica do mel portugu\xEAs. Todos os lotes comercializados devem possuir um registo de lote associado ao n\xFAmero do apicultor e georreferencia\xE7\xE3o dos api\xE1rios produtores. Frascos de mel artesanal devem cumprir as regras exatas de rotulagem nutricional.",
    badgeType: "hive"
  },
  {
    id: "leg-3",
    title: "Consultoria P\xFAblica: Plano de Controle de Doen\xE7as",
    shortDesc: "Consultoria P\xFAblica: Plano de Controle de Doen\xE7as",
    fullDesc: "A Dire\xE7\xE3o-Geral de Alimenta\xE7\xE3o e Veterin\xE1ria (DGAV) abriu a consulta p\xFAblica para a revis\xE3o do Plano de Controlo da Varroose e Vespa Velutina. A AANP submeteu propostas para a comparticipa\xE7\xE3o de 100% nas harpas el\xE9tricas e a simplifica\xE7\xE3o dos procedimentos de queima e higieniza\xE7\xE3o de ninhos contaminados por Loque Americana.",
    badgeType: "book"
  }
];
let MEMBERS_DB = [
  {
    name: "Manuel Antunes Silva",
    nif: "234567890",
    memberId: "1984-A",
    joinDate: "12/03/1984",
    hivesCount: 145,
    apiariesCount: 4,
    status: "Ativo - Quotas Regularizadas",
    pasJoined: "Sim",
    lastSanitaryInspection: "14/05/2026",
    nextTreatmentDate: "01/09/2026 (Varroa - Apivar)",
    quotas: [
      { year: 2025, paid: true, expiryDate: "31/12/2025", paymentDate: "15/01/2025" },
      { year: 2026, paid: true, expiryDate: "31/12/2026", paymentDate: "10/01/2026" }
    ],
    receipts: [
      { id: "REC-2026-001", name: "Quota Anual 2026", date: "10/01/2026", amount: 25, fileUrl: "/recibos/quota_2026.pdf" },
      { id: "REC-2026-042", name: "Compra Sabonetes e Mel", date: "24/02/2026", amount: 18.5, fileUrl: "/recibos/compra_sabonetes.pdf" }
    ]
  },
  {
    name: "Maria do Carmo Cunha",
    nif: "210987654",
    memberId: "2010-C",
    joinDate: "23/07/2010",
    hivesCount: 65,
    apiariesCount: 2,
    status: "Inativo - Quota Pendente",
    pasJoined: "Sim",
    lastSanitaryInspection: "08/04/2026",
    nextTreatmentDate: "15/09/2026 (Varroa - Apistan)",
    quotas: [
      { year: 2025, paid: true, expiryDate: "31/12/2025", paymentDate: "20/01/2025" },
      { year: 2026, paid: false, expiryDate: "31/12/2026" }
    ],
    receipts: [
      { id: "REC-2025-012", name: "Quota Anual 2025", date: "20/01/2025", amount: 25, fileUrl: "/recibos/quota_2025.pdf" }
    ]
  }
];
app.get("/api/alerts", (req, res) => {
  res.json(ALERTS_DB);
});
app.post("/api/alerts", (req, res) => {
  const { date, time, message, type, iconType } = req.body;
  if (!message || !type) {
    return res.status(400).json({ error: "Mensagem e tipo de perigo obrigat\xF3rios." });
  }
  const newAlert = {
    id: `alert-${Date.now()}`,
    date: date || "Hoje",
    time: time || "12:00",
    message,
    type,
    iconType: iconType || "pin"
  };
  ALERTS_DB.unshift(newAlert);
  res.json({ success: true, alert: newAlert });
});
app.get("/api/products", (req, res) => {
  res.json(PRODUCTS_DB);
});
app.post("/api/products", (req, res) => {
  const { name, category, price, weightOrDetail, description, imageUrl, stockStatus } = req.body;
  if (!name || !category || price === void 0) {
    return res.status(400).json({ error: "Nome, categoria e pre\xE7o s\xE3o obrigat\xF3rios." });
  }
  const newProduct = {
    id: `prod-${Date.now()}`,
    name,
    category,
    price: Number(price),
    weightOrDetail: weightOrDetail || "500g",
    description: description || "",
    imageUrl: imageUrl || "/mel_urze.jpg",
    stockStatus: stockStatus || "em-stock"
  };
  PRODUCTS_DB.push(newProduct);
  res.json({ success: true, product: newProduct });
});
app.get("/api/guides", (req, res) => {
  res.json(GUIDES_DB);
});
app.post("/api/guides", (req, res) => {
  const { title, shortDesc, fullDesc, imageUrl, badgeType } = req.body;
  if (!title || !fullDesc) {
    return res.status(400).json({ error: "T\xEDtulo e descri\xE7\xE3o longa obrigat\xF3rios." });
  }
  const newGuide = {
    id: `guide-${Date.now()}`,
    title,
    shortDesc: shortDesc || title,
    fullDesc,
    imageUrl: imageUrl || "/manejo_outono.jpg",
    badgeType: badgeType || "doc"
  };
  GUIDES_DB.push(newGuide);
  res.json({ success: true, guide: newGuide });
});
app.get("/api/legislation", (req, res) => {
  res.json(LEGISLATION_DB);
});
app.post("/api/legislation", (req, res) => {
  const { title, shortDesc, fullDesc, badgeType } = req.body;
  if (!title || !fullDesc) {
    return res.status(400).json({ error: "T\xEDtulo e descri\xE7\xE3o longa obrigat\xF3rios." });
  }
  const newLeg = {
    id: `leg-${Date.now()}`,
    title,
    shortDesc: shortDesc || title,
    fullDesc,
    badgeType: badgeType || "doc"
  };
  LEGISLATION_DB.push(newLeg);
  res.json({ success: true, legislation: newLeg });
});
app.post("/api/login", (req, res) => {
  const { nif, memberId, role } = req.body;
  if (role === "admin") {
    if (nif === "admin" && memberId === "admin") {
      return res.json({ role: "admin", name: "Administrador AANP" });
    }
    return res.status(401).json({ error: "Credenciais de administrador incorretas." });
  }
  const member = MEMBERS_DB.find((m) => m.nif === nif && m.memberId === memberId);
  if (member) {
    return res.json({ role: "member", member });
  }
  return res.status(401).json({ error: "S\xF3cio n\xE3o encontrado com o NIF e N.\xBA indicados." });
});
app.get("/api/members", (req, res) => {
  res.json(MEMBERS_DB);
});
app.put("/api/members/:memberId/quotas", (req, res) => {
  const { memberId } = req.params;
  const { year, paid, expiryDate, paymentDate } = req.body;
  const member = MEMBERS_DB.find((m) => m.memberId === memberId);
  if (!member) {
    return res.status(404).json({ error: "S\xF3cio n\xE3o encontrado." });
  }
  const existingQuota = member.quotas.find((q) => q.year === Number(year));
  if (existingQuota) {
    existingQuota.paid = paid;
    existingQuota.expiryDate = expiryDate;
    existingQuota.paymentDate = paid ? paymentDate || (/* @__PURE__ */ new Date()).toLocaleDateString("pt-PT") : void 0;
  } else {
    member.quotas.push({
      year: Number(year),
      paid,
      expiryDate,
      paymentDate: paid ? paymentDate || (/* @__PURE__ */ new Date()).toLocaleDateString("pt-PT") : void 0
    });
  }
  const currentYearQuota = member.quotas.find((q) => q.year === 2026);
  if (currentYearQuota) {
    member.status = currentYearQuota.paid ? "Ativo - Quotas Regularizadas" : "Inativo - Quota Pendente";
  }
  res.json({ success: true, member });
});
app.post("/api/members/:memberId/receipts", (req, res) => {
  const { memberId } = req.params;
  const { name, amount, date, fileUrl } = req.body;
  const member = MEMBERS_DB.find((m) => m.memberId === memberId);
  if (!member) {
    return res.status(404).json({ error: "S\xF3cio n\xE3o encontrado." });
  }
  const newReceipt = {
    id: `REC-${Date.now()}`,
    name,
    amount: Number(amount),
    date: date || (/* @__PURE__ */ new Date()).toLocaleDateString("pt-PT"),
    fileUrl: fileUrl || `/recibos/recibo_${Date.now()}.pdf`
  };
  member.receipts.unshift(newReceipt);
  res.json({ success: true, receipt: newReceipt, member });
});

// Facebook feed endpoint — priority: Graph API → Gemini AI → Local fallback
app.get('/api/facebook-feed', async (req, res) => {
  try {
    // 1. Try real Facebook Graph API
    const { posts: fbPosts, source: fbSource } = await fetchFacebookPosts();
    if (fbPosts.length > 0) {
      return res.json({ source: fbSource, posts: fbPosts });
    }

    // 2. Try Gemini AI for fresh, realistic posts
    const ai = getGeminiClient();
    if (!ai) {
      return res.json({ source: 'local_database', posts: fallbackPosts });
    }

    const prompt = `You are the content manager for AANP (Associação dos Apicultores do Norte de Portugal).
Generate exactly 10 extremely realistic and professionally written Facebook posts for the official page "https://www.facebook.com/apicultores.norte".
The language MUST be European Portuguese (Portugal).
The dates should be spread across the last 3 months (April to July 2026), newest first.
Topics should be a diverse mix: Vespa Velutina alerts, Varroose treatments, seasonal management tips, training events, honey DOP certifications, legislation news, queen breeding, equipment shop news, association announcements.
For imageUrl, rotate between: "/manejo_outono.jpg", "/melhoramento_rainhas.jpg", "/colheita_sustentavel.jpg", "/mel_urze.jpg", "/fato_apicultor.jpg", "/sabonete_mel.jpg"
Return strictly a JSON array of 10 objects, no markdown wrapping.
Each object must have exactly: id (string "gemini_post_N"), content (string), date (ISO8601 string), likes (number), commentsCount (number), shares (number), imageUrl (string), link (string "https://www.facebook.com/apicultores.norte")`;

    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => reject(new Error('Gemini API call timed out')), 6000);
    });

    const apiPromise = ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: prompt,
      config: { responseMimeType: 'application/json' }
    });

    const response = await Promise.race([apiPromise, timeoutPromise]);
    const text = response.text;

    if (text) {
      const posts = JSON.parse(text.trim());
      return res.json({ source: 'gemini_ai', posts: Array.isArray(posts) ? posts.slice(0, 10) : fallbackPosts });
    }

    res.json({ source: 'local_database', posts: fallbackPosts });
  } catch (error: any) {
    console.warn('Notice: Feed unavailable. Falling back to local database.');
    res.json({ source: 'local_database_fallback', posts: fallbackPosts });
  }
});

// Member Enquiry Submission endpoint
app.post('/api/contact', (req, res) => {
  const { name, email, phone, nif, beekeepingRegister, subject, message } = req.body;

  if (!name || !email || !phone || !subject || !message) {
    return res.status(400).json({ error: 'Todos os campos obrigatórios devem ser preenchidos.' });
  }

  // Log to server console securely (no risk of exposing sensitive auth keys)
  console.log('--- NOVA SOLICITAÇÃO DE MEMBRO RECEBIDA ---');
  console.log(`Nome: ${name}`);
  console.log(`Email: ${email}`);
  console.log(`Telefone: ${phone}`);
  console.log(`NIF: ${nif || 'Não fornecido'}`);
  console.log(`Registo Apícola: ${beekeepingRegister || 'Não fornecido'}`);
  console.log(`Assunto: ${subject}`);
  console.log(`Mensagem: ${message}`);
  console.log('-------------------------------------------');

  // Securely acknowledge and return simulated success
  res.json({ 
    success: true, 
    message: 'A sua mensagem foi enviada com sucesso! A equipa técnica da AANP entrará em contacto brevemente.' 
  });
});

// Shop Order/Reservation endpoint
app.post('/api/orders', (req, res) => {
  const { name, phone, email, nif, deliveryType, address, items, subtotal, discount, total, memberId } = req.body;

  if (!name || !phone || !email || !deliveryType || !items || !items.length) {
    return res.status(400).json({ error: 'Campos obrigatórios em falta.' });
  }

  // Generate a mock reservation code
  const codeSuffix = Math.floor(1000 + Math.random() * 9000);
  const reservationCode = `AANP-2026-R${codeSuffix}`;

  // Log order securely to server console
  console.log('--- NOVA RESERVA DE LOJA RECEBIDA ---');
  console.log(`Código: ${reservationCode}`);
  console.log(`Cliente: ${name} (${email}, ${phone})`);
  if (memberId) {
    console.log(`Número de Associado: ${memberId} (Desconto de Sócio Aplicado)`);
  }
  console.log(`NIF: ${nif || 'Não indicado'}`);
  console.log(`Entrega: ${deliveryType === 'pickup' ? 'Levantamento na Sede' : `Envio para: ${address}`}`);
  console.log(`Subtotal: ${subtotal.toFixed(2)}€`);
  console.log(`Desconto: ${discount.toFixed(2)}€`);
  console.log(`Total: ${total.toFixed(2)}€`);
  console.log('Artigos reservados:');
  items.forEach((item: any) => {
    console.log(` - ID Artigo: ${item.productId} | Quantidade: ${item.quantity}`);
  });
  console.log('--------------------------------------');

  res.json({
    success: true,
    reservationCode
  });
});

async function startServer() {
  // Vite integration
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`AANP Fullstack Server running on http://localhost:${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
  });
}

startServer();
