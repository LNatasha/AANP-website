/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  Home, HelpCircle, Shield, FileText, Phone, Facebook, 
  MessageCircle, MessageSquare, AlertTriangle, ArrowRight, 
  MapPin, Clock, Mail, ChevronRight, CheckCircle2, Volume2, 
  RotateCcw, VolumeX, Printer, ShieldCheck, FileCheck, 
  Download, BookOpen, AlertCircle, Building, Check, FileCode,
  Plus, Minus, Trash2, Search, ShoppingBag, Store, Truck, ShoppingCart
} from 'lucide-react';

import { AccessibilitySettings, FacebookPost, ContactInquiry, Product, CartItem, OrderSubmission } from './types';
import Header from './components/Header';
import Hero from './components/Hero';
import Logo from './components/Logo';
import { speakText, stopSpeaking } from './utils';
import { 
  PracticalGuide, 
  LegislationUpdate, 
  ApiculturaAlert
} from './data';

export default function App() {
  // 1. Accessibility State
  const [accessibility, setAccessibility] = React.useState<AccessibilitySettings>(() => {
    const saved = localStorage.getItem('aanp_accessibility');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return {
      fontSize: 'normal',
      contrast: 'normal',
      lineSpacing: 'normal',
      dyslexicFont: false,
      ttsEnabled: false
    };
  });

  React.useEffect(() => {
    localStorage.setItem('aanp_accessibility', JSON.stringify(accessibility));
    
    const root = document.documentElement;
    if (accessibility.contrast === 'dark' || accessibility.contrast === 'high') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [accessibility]);

  // 2. Navigation State
  const [activeTab, setActiveTab] = React.useState<string>('inicio');

  // 3. Facebook Feed State
  const [fbPosts, setFbPosts] = React.useState<FacebookPost[]>([]);
  const [fbSource, setFbSource] = React.useState<string>('local_database');
  const [fbLoading, setFbLoading] = React.useState<boolean>(true);
  const [fbError, setFbError] = React.useState<string | null>(null);

  // 4. Contact Form State
  const [contactForm, setContactForm] = React.useState<ContactInquiry>({
    name: '',
    email: '',
    phone: '',
    nif: '',
    beekeepingRegister: '',
    subject: 'Geral',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = React.useState<boolean>(false);
  const [submitSuccess, setSubmitSuccess] = React.useState<string | null>(null);
  const [submitError, setSubmitError] = React.useState<string | null>(null);

  // 5. Selected item state for detail modals
  const [selectedGuide, setSelectedGuide] = React.useState<PracticalGuide | null>(null);
  const [selectedLegislation, setSelectedLegislation] = React.useState<LegislationUpdate | null>(null);
  const [isPortalOpen, setIsPortalOpen] = React.useState<boolean>(false);

  // 6. Portal Login simulation
  const [portalNif, setPortalNif] = React.useState<string>('');
  const [portalMemberId, setPortalMemberId] = React.useState<string>('');
  const [isPortalLoggedIn, setIsPortalLoggedIn] = React.useState<boolean>(false);
  const [portalMemberData, setPortalMemberData] = React.useState<any>(null);

  // 7. Loja (Shop) State
  const [shopCategory, setShopCategory] = React.useState<string>('todos');
  const [shopSearch, setShopSearch] = React.useState<string>('');
  const [cart, setCart] = React.useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = React.useState<boolean>(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = React.useState<boolean>(false);
  const [checkoutForm, setCheckoutForm] = React.useState({
    name: '',
    phone: '',
    email: '',
    nif: '',
    deliveryType: 'pickup' as 'pickup' | 'delivery',
    address: ''
  });
  const [isCheckoutSubmitting, setIsCheckoutSubmitting] = React.useState<boolean>(false);
  const [checkoutSuccessData, setCheckoutSuccessData] = React.useState<{
    reservationCode: string;
    subtotal: number;
    discount: number;
    total: number;
    deliveryType: 'pickup' | 'delivery';
  } | null>(null);
  const [checkoutError, setCheckoutError] = React.useState<string | null>(null);

  // 8. Dynamic Collections Loaded from Server
  const [alerts, setAlerts] = React.useState<ApiculturaAlert[]>([]);
  const [products, setProducts] = React.useState<Product[]>([]);
  const [guides, setGuides] = React.useState<PracticalGuide[]>([]);
  const [legislation, setLegislation] = React.useState<LegislationUpdate[]>([]);
  const [members, setMembers] = React.useState<PortalMember[]>([]);

  // 9. Admin State
  const [isAdminLoggedIn, setIsAdminLoggedIn] = React.useState<boolean>(false);
  const [adminName, setAdminName] = React.useState<string>('');

  const fetchCollections = React.useCallback(async () => {
    try {
      const [alertsRes, productsRes, guidesRes, legislationRes] = await Promise.all([
        fetch('/api/alerts'),
        fetch('/api/products'),
        fetch('/api/guides'),
        fetch('/api/legislation')
      ]);
      
      if (alertsRes.ok) setAlerts(await alertsRes.json());
      if (productsRes.ok) setProducts(await productsRes.json());
      if (guidesRes.ok) setGuides(await guidesRes.json());
      if (legislationRes.ok) setLegislation(await legislationRes.json());
    } catch (e) {
      console.error('Error fetching database collections', e);
    }
  }, []);

  const fetchMembers = React.useCallback(async () => {
    try {
      const res = await fetch('/api/members');
      if (res.ok) {
        setMembers(await res.json());
      }
    } catch (e) {
      console.error('Error fetching members list', e);
    }
  }, []);

  React.useEffect(() => {
    fetchCollections();
  }, [fetchCollections]);

  // 10. Admin Dashboard State Hooks
  const [adminSubTab, setAdminSubTab] = React.useState<'members' | 'content'>('members');
  const [selectedMemberId, setSelectedMemberId] = React.useState<string>('1984-A');
  const [quotaYear, setQuotaYear] = React.useState<number>(2026);
  const [quotaPaid, setQuotaPaid] = React.useState<boolean>(true);
  const [quotaExpiry, setQuotaExpiry] = React.useState<string>('31/12/2026');
  const [quotaStatusMessage, setQuotaStatusMessage] = React.useState<string | null>(null);

  const [receiptName, setReceiptName] = React.useState<string>('Quota Anual 2026');
  const [receiptAmount, setReceiptAmount] = React.useState<number>(25.00);
  const [receiptDate, setReceiptDate] = React.useState<string>(new Date().toLocaleDateString('pt-PT'));
  const [receiptStatusMessage, setReceiptStatusMessage] = React.useState<string | null>(null);

  const [contentType, setContentType] = React.useState<'alert' | 'product' | 'guide' | 'leg'>('alert');
  const [contentStatusMessage, setContentStatusMessage] = React.useState<string | null>(null);

  const [alertMsg, setAlertMsg] = React.useState<string>('');
  const [alertType, setAlertType] = React.useState<'danger' | 'warning' | 'info'>('warning');

  const [prodName, setProdName] = React.useState<string>('');
  const [prodCat, setProdCat] = React.useState<'mel-e-derivados' | 'cosmetica' | 'produtos-apicolas'>('mel-e-derivados');
  const [prodPrice, setProdPrice] = React.useState<number>(5.00);
  const [prodWeight, setProdWeight] = React.useState<string>('Frasco de 500g');
  const [prodDesc, setProdDesc] = React.useState<string>('');
  const [prodImage, setProdImage] = React.useState<string>('/mel_urze.jpg');
  const [prodStock, setProdStock] = React.useState<'em-stock' | 'poucas-unidades' | 'indisponivel'>('em-stock');

  const [guideTitle, setGuideTitle] = React.useState<string>('');
  const [guideShort, setGuideShort] = React.useState<string>('');
  const [guideFull, setGuideFull] = React.useState<string>('');
  const [guideImage, setGuideImage] = React.useState<string>('/manejo_outono.jpg');
  const [guideBadge, setGuideBadge] = React.useState<'doc' | 'hive' | 'honey'>('doc');

  const [legTitle, setLegTitle] = React.useState<string>('');
  const [legShort, setLegShort] = React.useState<string>('');
  const [legFull, setLegFull] = React.useState<string>('');
  const [legBadge, setLegBadge] = React.useState<'doc' | 'hive' | 'book'>('doc');

  // 11. Admin Action Handlers
  const handleUpdateQuotas = async (e: React.FormEvent) => {
    e.preventDefault();
    setQuotaStatusMessage(null);
    try {
      const res = await fetch(`/api/members/${selectedMemberId}/quotas`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          year: quotaYear,
          paid: quotaPaid,
          expiryDate: quotaExpiry
        })
      });
      if (res.ok) {
        setQuotaStatusMessage('Quota atualizada com sucesso!');
        await fetchMembers();
      } else {
        throw new Error('Falha ao atualizar quotas.');
      }
    } catch (err: any) {
      setQuotaStatusMessage(err.message || 'Erro ao comunicar quotas.');
    }
  };

  const handleUploadReceipt = async (e: React.FormEvent) => {
    e.preventDefault();
    setReceiptStatusMessage(null);
    try {
      const res = await fetch(`/api/members/${selectedMemberId}/receipts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: receiptName,
          amount: receiptAmount,
          date: receiptDate
        })
      });
      if (res.ok) {
        setReceiptStatusMessage('Recibo adicionado com sucesso!');
        await fetchMembers();
        setReceiptName('Quota Anual 2026');
        setReceiptAmount(25.00);
      } else {
        throw new Error('Falha ao registar recibo.');
      }
    } catch (err: any) {
      setReceiptStatusMessage(err.message || 'Erro ao comunicar recibo.');
    }
  };

  const handleAddContent = async (e: React.FormEvent) => {
    e.preventDefault();
    setContentStatusMessage(null);
    let url = '';
    let bodyPayload = {};

    if (contentType === 'alert') {
      url = '/api/alerts';
      bodyPayload = { message: alertMsg, type: alertType, date: 'Hoje', time: '12:00' };
    } else if (contentType === 'product') {
      url = '/api/products';
      bodyPayload = {
        name: prodName,
        category: prodCat,
        price: prodPrice,
        weightOrDetail: prodWeight,
        description: prodDesc,
        imageUrl: prodImage,
        stockStatus: prodStock
      };
    } else if (contentType === 'guide') {
      url = '/api/guides';
      bodyPayload = {
        title: guideTitle,
        shortDesc: guideShort,
        fullDesc: guideFull,
        imageUrl: guideImage,
        badgeType: guideBadge
      };
    } else if (contentType === 'leg') {
      url = '/api/legislation';
      bodyPayload = {
        title: legTitle,
        shortDesc: legShort,
        fullDesc: legFull,
        badgeType: legBadge
      };
    }

    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bodyPayload)
      });

      if (res.ok) {
        setContentStatusMessage('Conteúdo adicionado com sucesso ao portal!');
        await fetchCollections(); // reload collections
        // reset inputs
        setAlertMsg('');
        setProdName('');
        setProdDesc('');
        setGuideTitle('');
        setGuideFull('');
        setLegTitle('');
        setLegFull('');
      } else {
        throw new Error('Erro ao adicionar conteúdo.');
      }
    } catch (err: any) {
      setContentStatusMessage(err.message || 'Erro de ligação.');
    }
  };

  const selectedMember = members.find(m => m.memberId === selectedMemberId);

  // Fetch Facebook feed on mount
  React.useEffect(() => {
    const fetchFeed = async () => {
      setFbLoading(true);
      setFbError(null);
      try {
        const response = await fetch('/api/facebook-feed');
        if (!response.ok) {
          throw new Error('Falha ao comunicar com o servidor da AANP.');
        }
        const data = await response.json();
        setFbPosts(data.posts || []);
        setFbSource(data.source || 'local_database');
      } catch (err: any) {
        console.error('Error fetching Facebook feed:', err);
        setFbError('Não foi possível obter as atualizações do Facebook em tempo real. Consulte diretamente a nossa página.');
      } finally {
        setFbLoading(false);
      }
    };

    fetchFeed();
  }, []);

  // TTS on active tab change
  React.useEffect(() => {
    if (accessibility.ttsEnabled) {
      stopSpeaking();
      const tabNames: Record<string, string> = {
        inicio: 'Página inicial da Associação Nacional de Apicultores de Portugal. Sobre e Recursos Gerais.',
        membros: 'Secção de Membros, inscrição de associados e Portal de login.',
        recursos: 'Guias práticos, Apoio Veterinário e Declaração de Setembro.',
        noticias: 'Notícias oficiais sincronizadas com a nossa página de Facebook.',
        contactos: 'Contactos da nossa sede regional e formulário de mensagem.'
      };
      if (tabNames[activeTab]) {
        speakText(`Carregou a secção: ${tabNames[activeTab]}`, true);
      }
    }
  }, [activeTab, accessibility.ttsEnabled]);

  // Form submit handler
  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitSuccess(null);
    setSubmitError(null);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(contactForm)
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Erro ao enviar a mensagem.');
      }

      setSubmitSuccess(data.message || 'Mensagem enviada com sucesso! Entraremos em contacto brevemente.');
      setContactForm({
        name: '',
        email: '',
        phone: '',
        nif: '',
        beekeepingRegister: '',
        subject: 'Geral',
        message: ''
      });
    } catch (err: any) {
      setSubmitError(err.message || 'Ocorreu um erro ao submeter o formulário. Ligue (+351) 225 098 976.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setContactForm(prev => ({ ...prev, [name]: value }));
  };

  // Reset Accessibility
  const resetAccessibility = () => {
    setAccessibility({
      fontSize: 'normal',
      contrast: 'normal',
      lineSpacing: 'normal',
      dyslexicFont: false,
      ttsEnabled: false
    });
    stopSpeaking();
  };

  // Simulated portal login & Roles State
  const [loginRole, setLoginRole] = React.useState<'member' | 'admin'>('member');
  const [loginError, setLoginError] = React.useState<string | null>(null);

  const handlePortalLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);

    if (!portalNif || !portalMemberId) {
      setLoginError('Por favor, introduza as credenciais.');
      return;
    }

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nif: portalNif,
          memberId: portalMemberId,
          role: loginRole
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erro na autenticação.');
      }

      const data = await response.json();
      if (data.role === 'admin') {
        setIsAdminLoggedIn(true);
        setAdminName(data.name);
        setIsPortalLoggedIn(true); // Treated as logged into portal
        await fetchMembers(); // Fetch all members
      } else {
        setIsPortalLoggedIn(true);
        setPortalMemberData(data.member);
      }
    } catch (err: any) {
      setLoginError(err.message || 'Erro ao comunicar com o servidor.');
    }
  };

  const handleDemoPortalLogin = async () => {
    setLoginRole('member');
    setPortalNif('234567890');
    setPortalMemberId('1984-A');
    setLoginError(null);
    
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nif: '234567890',
          memberId: '1984-A',
          role: 'member'
        })
      });

      if (response.ok) {
        const data = await response.json();
        setIsPortalLoggedIn(true);
        setPortalMemberData(data.member);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handlePortalLogout = () => {
    setIsPortalLoggedIn(false);
    setIsAdminLoggedIn(false);
    setPortalMemberData(null);
    setAdminName('');
    setPortalNif('');
    setPortalMemberId('');
    setLoginError(null);
    setActiveTab('inicio');
  };

  const isHighContrast = accessibility.contrast === 'high';
  const isDarkMode = accessibility.contrast === 'dark' || accessibility.contrast === 'high';

  const fontClass = accessibility.dyslexicFont ? 'font-sans' : 'font-sans';
  const headingFontClass = 'font-sans font-bold';
  
  const sizeClasses = {
    normal: 'text-sm md:text-base',
    large: 'text-base md:text-lg leading-relaxed',
    'extra-large': 'text-lg md:text-xl leading-loose tracking-wide'
  };

  const spacingClasses = {
    normal: 'space-y-4',
    wide: 'space-y-8 md:space-y-10'
  };

  const bgThemeClass = isHighContrast
    ? 'bg-black text-yellow-400 font-bold'
    : 'bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100';

  const cardThemeClass = isHighContrast
    ? 'border-2 border-yellow-500 bg-black text-yellow-400 p-6 rounded-none'
    : 'bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-850 p-6 rounded-2xl shadow-xs';

  const cartItemsCount = cart.reduce((total, item) => total + item.quantity, 0);

  return (
    <div 
      className={`min-h-screen flex flex-col transition-colors duration-200 ${fontClass} ${sizeClasses[accessibility.fontSize]} ${bgThemeClass}`}
    >
      {/* 1. HEADER */}
      <Header 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        accessibility={accessibility} 
        setAccessibility={setAccessibility}
        isPortalLoggedIn={isPortalLoggedIn}
        isAdminLoggedIn={isAdminLoggedIn}
        portalMemberName={portalMemberData?.name}
        adminName={adminName}
        onLogout={handlePortalLogout}
        cartItemsCount={cartItemsCount}
        onOpenCart={() => setIsCartOpen(true)}
      />



      {/* 3. HERO (Always shown above the main content of Inicio / Sobre page) */}
      {activeTab === 'inicio' && (
        <Hero onNavigate={setActiveTab} accessibility={accessibility} />
      )}

      {/* 4. MAIN CONTAINER */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className={spacingClasses[accessibility.lineSpacing]}>
          
          {/* TAB 1: INÍCIO (SOBRE & RESOURCE HUB GRID - MATCHING THE SCREENSHOT EXACTLY) */}
          {activeTab === 'inicio' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* LEFT COLUMN: ALERTAS DE APICULTURA CARD */}
              <div className="lg:col-span-4 space-y-6">
                <div className={`overflow-hidden rounded-2xl border ${
                  isHighContrast
                    ? 'border-yellow-500 bg-black text-yellow-400'
                    : 'border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm'
                }`}>
                  {/* Alert Header Box matching the deep blue header in screenshot */}
                  <div className={`p-4 flex items-center gap-2.5 ${
                    isHighContrast 
                      ? 'bg-black border-b border-yellow-500 text-yellow-400' 
                      : 'bg-[#103a5c] text-white'
                  }`}>
                    <AlertTriangle className="h-5 w-5 text-red-500 fill-current shrink-0" />
                    <span className="font-bold text-xs uppercase tracking-wider">
                      Alertas de Apicultura
                    </span>
                  </div>

                  {/* Alerts List */}
                  <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
                    {alerts.map((alert) => (
                      <div key={alert.id} className="p-4 space-y-2">
                        {/* Date and Custom Icon */}
                        <div className="flex items-center gap-2 text-xs">
                          {alert.iconType === 'pin' && (
                            <MapPin className="h-4 w-4 text-emerald-600 shrink-0" />
                          )}
                          {alert.iconType === 'fire' && (
                            <svg className="h-4 w-4 text-red-500 shrink-0" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              <path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                          )}
                          {alert.iconType === 'doc' && (
                            <FileText className="h-4 w-4 text-[#0e5c94] shrink-0" />
                          )}
                          <span className={`font-bold ${isHighContrast ? 'text-yellow-300' : 'text-zinc-500 dark:text-zinc-400'}`}>
                            {alert.date}, {alert.time}
                          </span>
                        </div>
                        {/* Alert message */}
                        <p className={`text-xs leading-relaxed ${isHighContrast ? 'text-yellow-400' : 'text-zinc-700 dark:text-zinc-300'}`}>
                          {alert.message}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Ver Todos button */}
                  <div className="p-4 bg-zinc-50/50 dark:bg-zinc-950/20 text-center border-t border-zinc-100 dark:border-zinc-800">
                    <button
                      onClick={() => setActiveTab('noticias')}
                      className={`text-xs font-bold hover:underline cursor-pointer flex items-center justify-center gap-1 w-full py-1.5 ${
                        isHighContrast ? 'text-yellow-400' : 'text-[#0e5c94] dark:text-amber-400'
                      }`}
                    >
                      <span>Ver Todos os Alertas</span>
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* DIGIPORTAL AD BLOCK IN SIDEBAR */}
                <div className={`p-5 rounded-2xl border ${
                  isHighContrast
                    ? 'border-yellow-500 bg-black text-yellow-400'
                    : 'bg-gradient-to-br from-[#0e5c94] to-[#0b2c4c] text-white border-transparent'
                }`}>
                  <h4 className="font-bold text-sm mb-2 flex items-center gap-2">
                    <ShieldCheck className="h-5 w-5 text-blue-200" />
                    <span>Portal do Associado</span>
                  </h4>
                  <p className="text-xs text-zinc-100 dark:text-zinc-300 leading-relaxed mb-4">
                    Já é sócio da AANP? Faça login com o seu NIF para descarregar o seu cartão digital, consultar o estado sanitário e faturas de tratamento.
                  </p>
                  <button
                    onClick={() => setIsPortalOpen(true)}
                    className={`w-full py-2.5 rounded-xl text-xs font-bold cursor-pointer transition-colors text-center block ${
                      isHighContrast
                        ? 'bg-yellow-400 text-black font-extrabold hover:bg-yellow-500'
                        : 'bg-white text-[#0e5c94] hover:bg-zinc-100'
                    }`}
                  >
                    Entrar no Portal
                  </button>
                </div>
              </div>

              {/* RIGHT COLUMN: RECURSOS EDUCACIONAIS E ATUALIZAÇÕES LEGISLATIVAS */}
              <div className="lg:col-span-8 space-y-8">
                
                <div className="space-y-6">
                  {/* Section Title */}
                  <h2 className="text-xl sm:text-2xl font-black text-[#0b2c4c] dark:text-zinc-100 tracking-tight">
                    Recursos Educacionais e Atualizações Legislativas
                  </h2>

                  {/* 1. Guias Práticos Subsection */}
                  <div className="space-y-4">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 border-b pb-1">
                      Guias Práticos
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                      {guides.map((guide) => (
                        <div 
                          key={guide.id}
                          className={`flex flex-col justify-between overflow-hidden rounded-2xl border transition-all duration-200 ${
                            isHighContrast
                              ? 'border-yellow-500 bg-black text-yellow-400'
                              : 'border-zinc-150 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-2xs hover:shadow-xs'
                          }`}
                        >
                          <div>
                            {/* Image with referrerPolicy */}
                            <img 
                              src={guide.imageUrl} 
                              alt={guide.title}
                              className="w-full h-36 object-cover"
                              referrerPolicy="no-referrer"
                              loading="lazy"
                            />
                            
                            <div className="p-4 space-y-2">
                              <h4 className="font-bold text-xs sm:text-[13px] leading-snug text-[#0b2c4c] dark:text-zinc-150">
                                {guide.title}
                              </h4>
                              <p className={`text-[11px] leading-relaxed ${isHighContrast ? 'text-yellow-300' : 'text-zinc-500 dark:text-zinc-400'}`}>
                                {guide.shortDesc}
                              </p>
                            </div>
                          </div>

                          {/* Footer action and badge */}
                          <div className="p-4 pt-0 flex items-center justify-between">
                            <button
                              onClick={() => setSelectedGuide(guide)}
                              className={`px-3 py-1.5 text-[11px] font-bold rounded-lg cursor-pointer ${
                                isHighContrast
                                  ? 'bg-yellow-400 text-black font-black'
                                  : 'bg-[#0e5c94] text-white hover:bg-opacity-95'
                              }`}
                            >
                              Ler Mais
                            </button>

                            {/* Badge icon at bottom right */}
                            <div className={`p-1.5 rounded-full ${
                              isHighContrast ? 'bg-yellow-400/20 text-yellow-400' : 'bg-amber-50 dark:bg-zinc-800 text-amber-700 dark:text-amber-400'
                            }`}>
                              {guide.badgeType === 'doc' && <FileText className="h-3.5 w-3.5" />}
                              {guide.badgeType === 'hive' && <Shield className="h-3.5 w-3.5" />}
                              {guide.badgeType === 'honey' && <HelpCircle className="h-3.5 w-3.5" />}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* 2. Atualizações Legislativas Subsection */}
                  <div className="space-y-4 pt-4">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 border-b pb-1">
                      Atualizações Legislativas
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                      {legislation.map((leg) => (
                        <div 
                          key={leg.id}
                          className={`flex flex-col justify-between p-4 rounded-2xl border transition-all duration-200 ${
                            isHighContrast
                              ? 'border-yellow-500 bg-black text-yellow-400'
                              : 'border-zinc-150 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-2xs hover:shadow-xs'
                          }`}
                        >
                          <div className="space-y-2">
                            <h4 className="font-bold text-xs sm:text-[13px] leading-snug text-[#0b2c4c] dark:text-zinc-150">
                              {leg.title}
                            </h4>
                            <p className={`text-[11px] leading-relaxed ${isHighContrast ? 'text-yellow-300' : 'text-zinc-500 dark:text-zinc-400'}`}>
                              {leg.shortDesc}
                            </p>
                          </div>

                          {/* Footer action and badge */}
                          <div className="pt-4 flex items-center justify-between">
                            <button
                              onClick={() => setSelectedLegislation(leg)}
                              className={`px-3 py-1.5 text-[11px] font-bold rounded-lg cursor-pointer ${
                                isHighContrast
                                  ? 'bg-yellow-400 text-black font-black'
                                  : 'bg-[#0e5c94] text-white hover:bg-opacity-95'
                              }`}
                            >
                              Ler Mais
                            </button>

                            {/* Badge icon */}
                            <div className={`p-1.5 rounded-full ${
                              isHighContrast ? 'bg-yellow-400/20 text-yellow-400' : 'bg-amber-50 dark:bg-zinc-800 text-amber-700 dark:text-amber-400'
                            }`}>
                              {leg.badgeType === 'doc' && <FileText className="h-3.5 w-3.5" />}
                              {leg.badgeType === 'hive' && <Shield className="h-3.5 w-3.5" />}
                              {leg.badgeType === 'book' && <BookOpen className="h-3.5 w-3.5" />}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>

                {/* ACCESSIBILITY STATEMENT FOR OLDER BEKEEPER POPULATION */}
                <div className="p-6 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl flex flex-col sm:flex-row items-center gap-6">
                  <div className="text-center sm:text-left space-y-2">
                    <h4 className="font-sans font-bold text-base flex items-center justify-center sm:justify-start gap-1.5 text-[#0b2c4c] dark:text-amber-400">
                      <span>Declaração de Acessibilidade Sénior</span>
                    </h4>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                      Mais de 65% dos nossos apicultores associados têm idade superior a 60 anos. Este portal foi desenhado com letras de alta legibilidade, contraste reforçado para vista cansada e suporte para síntese de voz (TTS) nativa em todos os sistemas operativos modernos e desatualizados. Use o painel de Acessibilidade no topo para configurar a sua experiência ideal.
                    </p>
                  </div>
                </div>

                {/* REGIONAL LOGO AND SINCE 1959 STAMP */}
                <div className="py-8 border-t border-zinc-200 dark:border-zinc-850 flex flex-col items-center">
                  <Logo size={140} variant="full" />
                  <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-3 font-serif italic text-center">
                    Entidade de Utilidade Pública Colectiva • Representando e protegendo as abelhas no Norte desde 1959.
                  </p>
                </div>

              </div>

            </div>
          )}

          {/* TAB 2: MEMBROS (MEMBERSHIP & SIMULATED PORTAL VIEW) */}
          {activeTab === 'membros' && (
            <div className="space-y-8">
              <div className="border-b pb-4">
                <h2 className={`${headingFontClass} text-2xl md:text-3xl font-extrabold text-[#0b2c4c] dark:text-zinc-100`}>
                  Registo e Vantagens de Associado
                </h2>
                <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-1">
                  Una-se a mais de 4.250 apicultores em Portugal. Defendemos a sanidade apícola e valorizamos o Mel da Terra Quente.
                </p>
              </div>

              {/* Membership Benefits Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className={cardThemeClass}>
                  <h3 className="font-bold text-base text-[#0e5c94] dark:text-amber-400 mb-3 flex items-center gap-2">
                    <ShieldCheck className="h-5 w-5" />
                    <span>Apoio Veterinário Integral</span>
                  </h3>
                  <p className="text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed">
                    Acesso permanente à equipa de médicos veterinários da AANP para emissão das receitas oficiais de tratamento e orientação clínica contra doenças do apiário.
                  </p>
                </div>

                <div className={cardThemeClass}>
                  <h3 className="font-bold text-base text-[#0e5c94] dark:text-amber-400 mb-3 flex items-center gap-2">
                    <FileCheck className="h-5 w-5" />
                    <span>Candidatura a Subsídios (PEPAC)</span>
                  </h3>
                  <p className="text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed">
                    Candidatamos o seu efetivo apícola a apoios financeiros de modernização comunitária, financiamento de novos enxames, harpas e despesas de apoio sanitário.
                  </p>
                </div>

                <div className={cardThemeClass}>
                  <h3 className="font-bold text-base text-[#0e5c94] dark:text-amber-400 mb-3 flex items-center gap-2">
                    <RotateCcw className="h-5 w-5" />
                    <span>Laboratório de Cera Próprio</span>
                  </h3>
                  <p className="text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed">
                    Troque as suas placas de cera velha por cera laminada de excelente qualidade, devidamente higienizada e livre de fungos ou esporos de loques americanas.
                  </p>
                </div>

                <div className={cardThemeClass}>
                  <h3 className="font-bold text-base text-[#0e5c94] dark:text-amber-400 mb-3 flex items-center gap-2">
                    <Volume2 className="h-5 w-5" />
                    <span>Aulas Práticas e Workshops</span>
                  </h3>
                  <p className="text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed">
                    Formações mensais de iniciação à apicultura, maneio ecológico e controlo seletivo da vespa velutina, com certificado oficial reconhecido.
                  </p>
                </div>
              </div>

              {/* Portal Simulation Trigger Box */}
              <div className="p-6 bg-blue-50/50 dark:bg-zinc-900/40 rounded-2xl border border-blue-100 dark:border-zinc-800 flex flex-col md:flex-row items-center justify-between gap-4">
                <div>
                  <h4 className="font-bold text-base text-blue-900 dark:text-blue-300">Já possui uma inscrição de associado?</h4>
                  <p className="text-xs text-zinc-600 dark:text-zinc-300 mt-1">
                    Aceda ao Portal do Membro para descarregar o seu cartão digital e imprimir o certificado oficial de apoio sanitário.
                  </p>
                </div>
                <button
                  onClick={() => setIsPortalOpen(true)}
                  className="bg-[#0e5c94] text-white font-bold px-5 py-2.5 rounded-xl text-xs hover:bg-[#0b2c4c] transition-colors cursor-pointer shrink-0"
                >
                  Entrar no Portal Digital
                </button>
              </div>

              {/* Membership Application Form */}
              <div className={cardThemeClass}>
                <h3 className="font-bold text-lg text-[#0b2c4c] dark:text-zinc-150 mb-4 border-b pb-2">
                  Formulário Digital de Pedido de Inscrição na AANP
                </h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-6">
                  Preencha os seus dados de contacto e NIF. A equipa administrativa analisará o pedido e enviará a fatura da joia de sócio por correio eletrónico de forma assíncrona.
                </p>

                <form onSubmit={handleContactSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold mb-1">Nome Completo *</label>
                      <input 
                        type="text" 
                        name="name" 
                        required 
                        value={contactForm.name}
                        onChange={handleInputChange}
                        className="w-full p-2 border border-zinc-300 dark:border-zinc-700 rounded-lg text-xs" 
                        placeholder="Nome do Apicultor"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold mb-1">E-mail *</label>
                      <input 
                        type="email" 
                        name="email" 
                        required 
                        value={contactForm.email}
                        onChange={handleInputChange}
                        className="w-full p-2 border border-zinc-300 dark:border-zinc-700 rounded-lg text-xs" 
                        placeholder="exemplo@gmail.com"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-bold mb-1">Telemóvel *</label>
                      <input 
                        type="tel" 
                        name="phone" 
                        required 
                        value={contactForm.phone}
                        onChange={handleInputChange}
                        className="w-full p-2 border border-zinc-300 dark:border-zinc-700 rounded-lg text-xs" 
                        placeholder="961234567"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold mb-1">NIF (Obrigatório para faturas) *</label>
                      <input 
                        type="text" 
                        name="nif" 
                        required 
                        value={contactForm.nif}
                        onChange={handleInputChange}
                        className="w-full p-2 border border-zinc-300 dark:border-zinc-700 rounded-lg text-xs" 
                        placeholder="234567890"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold mb-1">N.º de Registo Apícola (DGAV) se tiver</label>
                      <input 
                        type="text" 
                        name="beekeepingRegister" 
                        value={contactForm.beekeepingRegister}
                        onChange={handleInputChange}
                        className="w-full p-2 border border-zinc-300 dark:border-zinc-700 rounded-lg text-xs" 
                        placeholder="1234-AP"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold mb-1">Mensagem ou Localização do Apiário</label>
                    <textarea 
                      name="message" 
                      rows={3} 
                      required
                      value={contactForm.message}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-zinc-300 dark:border-zinc-700 rounded-lg text-xs" 
                      placeholder="Indique o concelho onde pretende colocar as colmeias e o número estimado..."
                    />
                  </div>

                  {submitSuccess && (
                    <div className="p-3 bg-green-100 dark:bg-green-950 text-green-700 dark:text-green-300 rounded-xl text-xs font-bold">
                      {submitSuccess}
                    </div>
                  )}

                  {submitError && (
                    <div className="p-3 bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-300 rounded-xl text-xs font-bold">
                      {submitError}
                    </div>
                  )}

                  <button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="px-6 py-2.5 bg-[#0e5c94] hover:bg-[#0b2c4c] text-white rounded-xl text-xs font-bold cursor-pointer"
                  >
                    {isSubmitting ? 'A processar...' : 'Submeter Pedido de Sócio'}
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* TAB 3: RECURSOS COMPREENSIVOS HUB */}
          {activeTab === 'recursos' && (
            <div className="space-y-8">
              <div className="border-b pb-4">
                <h2 className={`${headingFontClass} text-2xl md:text-3xl font-extrabold text-[#0b2c4c] dark:text-zinc-100`}>
                  Serviços Técnicos e Regulamentares
                </h2>
                <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-1">
                  Central de atendimento sanitário e conformidade apícola sob coordenação veterinária da AANP.
                </p>
              </div>

              {/* Sub-tabs list */}
              <div className="grid grid-cols-1 gap-8 max-w-2xl">

                {/* Sub-tab 2: September Reg */}
                <div className={cardThemeClass}>
                  <div className="flex justify-between items-start mb-3">
                    <span className="px-2 py-0.5 bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-300 text-[10px] font-bold rounded-md uppercase">
                      Setembro
                    </span>
                    <FileText className="h-5 w-5 text-red-500" />
                  </div>
                  <h3 className="font-bold text-base text-[#0b2c4c] dark:text-zinc-200 mb-2">Declaração Anual de Existências</h3>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed mb-4">
                    Todo apicultor em Portugal deve reportar as colmeias ocupadas no mês de Setembro. A não submissão resulta em multas estatais da DGAV e perda imediata de estatuto sanitário associado.
                  </p>
                  <p className="text-xs text-zinc-500 mb-4">
                    <strong>Nós ajudamos:</strong> Traga a identificação dos apiários e o número de colmeias povoadas à nossa sede em Porto ou preencha o formulário online.
                  </p>
                  <button 
                    onClick={() => setActiveTab('contactos')}
                    className="px-4 py-2 bg-[#0e5c94] hover:bg-[#0b2c4c] text-white rounded-lg text-xs font-bold cursor-pointer"
                  >
                    Agendar Apoio Obrigatório
                  </button>
                </div>

              </div>
            </div>
          )}

          {/* TAB 4: NOTÍCIAS FACEBOOK GRID */}
          {activeTab === 'noticias' && (
            <div className="space-y-8">
              <div className="border-b pb-4">
                <h2 className={`${headingFontClass} text-2xl md:text-3xl font-extrabold flex items-center gap-2 text-[#0e5c94] dark:text-amber-400`}>
                  <Facebook className="h-7 w-7 text-[#0e5c94]" />
                  <span>Notícias e Comunicados Oficiais</span>
                </h2>
                <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-1">
                  Alertas, datas limite e novidades sanitárias sincronizadas de forma segura e assíncrona a partir da nossa página oficial de Facebook.
                </p>
              </div>

              {fbLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="p-6 bg-zinc-100 dark:bg-zinc-900 rounded-2xl h-72 space-y-4">
                      <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded w-1/4"></div>
                      <div className="h-3 bg-zinc-200 dark:bg-zinc-800 rounded w-3/4"></div>
                      <div className="h-3 bg-zinc-200 dark:bg-zinc-800 rounded w-5/6"></div>
                      <div className="h-32 bg-zinc-200 dark:bg-zinc-800 rounded"></div>
                    </div>
                  ))}
                </div>
              ) : fbError ? (
                <div className="p-8 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl text-center space-y-4">
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed max-w-lg mx-auto">
                    {fbError}
                  </p>
                  <a
                    href="https://www.facebook.com/apicultores.norte"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-xs"
                  >
                    <Facebook className="h-4.5 w-4.5" />
                    <span>Visitar Facebook Oficial da AANP</span>
                  </a>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {fbPosts.map((post) => (
                      <article 
                        key={post.id} 
                        className={`${cardThemeClass} flex flex-col justify-between`}
                      >
                        <div className="space-y-4">
                          <div className="flex justify-between items-center text-xs">
                            <span className="font-semibold text-blue-600 dark:text-blue-400">Publicado</span>
                            <span className="text-zinc-500 dark:text-zinc-400">
                              {new Date(post.date).toLocaleDateString('pt-PT')}
                            </span>
                          </div>

                          {post.imageUrl && (
                            <img 
                              src={post.imageUrl} 
                              alt="Post Media" 
                              className="w-full h-40 object-cover rounded-xl"
                              loading="lazy"
                              referrerPolicy="no-referrer"
                            />
                          )}

                          <p className="text-xs sm:text-sm leading-relaxed text-zinc-700 dark:text-zinc-300 whitespace-pre-line">
                            {post.content}
                          </p>
                        </div>

                        <div className="pt-4 mt-4 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
                          <div className="flex gap-4 text-xs text-zinc-500 dark:text-zinc-400">
                            <span>👍 {post.likes}</span>
                            <span>💬 {post.commentsCount}</span>
                            <span>🔄 {post.shares}</span>
                          </div>
                          
                          <a
                            href={post.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                          >
                            <span>Ver Completo</span>
                            <ArrowRight className="h-3 w-3" />
                          </a>
                        </div>
                      </article>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 5: CONTACTOS & MESSAGE FORM */}
          {activeTab === 'contactos' && (
            <div className="space-y-8">
              <div className="border-b pb-4">
                <h2 className={`${headingFontClass} text-2xl md:text-3xl font-extrabold text-[#0b2c4c] dark:text-zinc-100`}>
                  Contactos AANP
                </h2>
                <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-1">
                  Fale com a nossa equipa administrativa ou envie-nos uma mensagem.
                </p>
              </div>

              {/* Map embed */}
              <div className="w-full rounded-2xl overflow-hidden border border-zinc-200 dark:border-zinc-800 shadow-sm" style={{height: '280px'}}>
                <iframe
                  title="Localização AANP — Rua Damião de Góis, Porto"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3004.1!2d-8.6315!3d41.1496!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd2464f5f6f8f8f9%3A0x0!2sRua+Dami%C3%A3o+de+G%C3%B3is+93%2C+Porto!5e0!3m2!1spt!2spt!4v1720000000000!5m2!1spt!2spt&q=Rua+Dami%C3%A3o+de+G%C3%B3is,93,Porto,Portugal"
                  width="100%"
                  height="100%"
                  style={{border: 0}}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* Contact Coordinates */}
                <div className="lg:col-span-4 space-y-6">
                  <div className={cardThemeClass}>
                    <h3 className="font-bold text-sm text-[#0b2c4c] dark:text-amber-400 mb-3 uppercase">AANP — Sede</h3>
                    <p className="text-xs text-zinc-600 dark:text-zinc-300 mb-3 leading-relaxed">
                      📍 Rua Damião de Góis, 93, 1º<br />
                      4050-225 Porto, Portugal
                    </p>
                    <div className="text-xs text-zinc-600 dark:text-zinc-300 space-y-1 mb-3">
                      <p>📞 <a href="tel:+351225098976" className="underline font-bold hover:text-[#0e5c94]">+351 225 098 976</a></p>
                      <p>📱 <a href="tel:+351939702495" className="underline font-bold hover:text-[#0e5c94]">+351 939 702 495</a></p>
                      <p>📧 <a href="mailto:geral@aanp.pt" className="underline hover:text-[#0e5c94]">geral@aanp.pt</a></p>
                    </div>
                    <p className="text-xs text-zinc-600 dark:text-zinc-300 mb-3">
                      🌐 <a href="https://www.facebook.com/apicultores.norte" target="_blank" rel="noopener noreferrer" className="underline hover:text-[#0e5c94]">facebook.com/apicultores.norte</a>
                    </p>
                  </div>

                  {/* Quick contact buttons */}
                  <div className={cardThemeClass}>
                    <h3 className="font-bold text-sm text-[#0b2c4c] dark:text-amber-400 mb-3 uppercase">Contacto Rápido</h3>
                    <div className="space-y-2 text-xs">
                      <a 
                        href="https://wa.me/351939702495" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 p-2.5 bg-green-50 dark:bg-green-950/20 text-green-700 dark:text-green-300 rounded-xl font-bold hover:bg-green-100 dark:hover:bg-green-950/40 transition-colors"
                      >
                        <MessageCircle className="h-4 w-4 fill-current flex-shrink-0" />
                        <span>WhatsApp: +351 939 702 495</span>
                      </a>
                      <a 
                        href="https://m.me/apicultores.norte" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 p-2.5 bg-blue-50 dark:bg-blue-950/20 text-blue-700 dark:text-blue-300 rounded-xl font-bold hover:bg-blue-100 dark:hover:bg-blue-950/40 transition-colors"
                      >
                        <MessageSquare className="h-4 w-4 fill-current flex-shrink-0" />
                        <span>Messenger: apicultores.norte</span>
                      </a>
                      <a 
                        href="mailto:geral@aanp.pt"
                        className="flex items-center gap-2 p-2.5 bg-amber-50 dark:bg-amber-950/20 text-amber-700 dark:text-amber-300 rounded-xl font-bold hover:bg-amber-100 dark:hover:bg-amber-950/40 transition-colors"
                      >
                        <span className="text-base leading-none">✉️</span>
                        <span>geral@aanp.pt</span>
                      </a>
                    </div>
                  </div>

                  {/* GPS coords */}
                  <div className={`p-4 rounded-xl border text-xs ${
                    isHighContrast ? 'border-yellow-500 text-yellow-400' : 'bg-zinc-50 dark:bg-zinc-900 border-zinc-200'
                  }`}>
                    <span className="font-bold block mb-1">📍 Coordenadas GPS Sede:</span>
                    <span className="text-zinc-500 font-mono">41.1496° N, 8.6315° W</span><br />
                    <a
                      href="https://maps.google.com/?q=Rua+Dami%C3%A3o+de+G%C3%B3is,93,Porto"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#0e5c94] dark:text-amber-400 underline font-bold mt-1 inline-block"
                    >Abrir no Google Maps →</a>
                  </div>
                </div>

                {/* Inquiry Form */}
                <div className="lg:col-span-8">
                  <div className={cardThemeClass}>
                    <h3 className="font-bold text-base text-[#0b2c4c] dark:text-zinc-150 mb-3 border-b pb-2">
                      Enviar Mensagem Administrativa ou Dúvida Técnica
                    </h3>

                    <form onSubmit={handleContactSubmit} className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold mb-1">Nome *</label>
                          <input 
                            type="text" 
                            name="name" 
                            required 
                            value={contactForm.name}
                            onChange={handleInputChange}
                            className="w-full p-2 border border-zinc-300 dark:border-zinc-700 rounded-lg text-xs" 
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold mb-1">E-mail *</label>
                          <input 
                            type="email" 
                            name="email" 
                            required 
                            value={contactForm.email}
                            onChange={handleInputChange}
                            className="w-full p-2 border border-zinc-300 dark:border-zinc-700 rounded-lg text-xs" 
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-xs font-bold mb-1">Telemóvel *</label>
                          <input 
                            type="tel" 
                            name="phone" 
                            required 
                            value={contactForm.phone}
                            onChange={handleInputChange}
                            className="w-full p-2 border border-zinc-300 dark:border-zinc-700 rounded-lg text-xs" 
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold mb-1">NIF (Opcional)</label>
                          <input 
                            type="text" 
                            name="nif" 
                            value={contactForm.nif}
                            onChange={handleInputChange}
                            className="w-full p-2 border border-zinc-300 dark:border-zinc-700 rounded-lg text-xs" 
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold mb-1">Assunto *</label>
                          <select 
                            name="subject" 
                            value={contactForm.subject}
                            onChange={handleInputChange}
                            className="w-full p-2 border border-zinc-300 dark:border-zinc-700 rounded-lg text-xs bg-white dark:bg-zinc-800"
                          >
                            <option value="Geral">Questão Geral</option>
                            <option value="Veterinária">Apoio Sanitário / Veterinário</option>
                            <option value="Existências">Declaração de Existências</option>
                            <option value="Quotas">Inscrição de Sócio e Quotas</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold mb-1">Mensagem *</label>
                        <textarea 
                          name="message" 
                          rows={4} 
                          required 
                          value={contactForm.message}
                          onChange={handleInputChange}
                          className="w-full p-2 border border-zinc-300 dark:border-zinc-700 rounded-lg text-xs" 
                          placeholder="Escreva aqui a sua dúvida ou solicitação técnica..."
                        />
                      </div>

                      {submitSuccess && (
                        <div className="p-3 bg-green-100 dark:bg-green-950 text-green-700 dark:text-green-300 rounded-xl text-xs font-bold animate-in fade-in">
                          {submitSuccess}
                        </div>
                      )}

                      {submitError && (
                        <div className="p-3 bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-300 rounded-xl text-xs font-bold animate-in fade-in">
                          {submitError}
                        </div>
                      )}

                      <button 
                        type="submit" 
                        disabled={isSubmitting}
                        className="px-6 py-2.5 bg-[#0e5c94] text-white hover:bg-[#0b2c4c] rounded-xl text-xs font-bold cursor-pointer disabled:opacity-50"
                      >
                        {isSubmitting ? 'A enviar...' : 'Enviar Mensagem'}
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: LOJA (SHOP CATALOG & CATEGORIES) */}
          {activeTab === 'loja' && (
            <div className="space-y-8 animate-in fade-in duration-200">
              <div className="border-b pb-4 flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                  <h2 className={`${headingFontClass} text-2xl md:text-3xl font-extrabold text-[#0b2c4c] dark:text-zinc-100`}>
                    Mel e Artigos Apícolas
                  </h2>
                  <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-1">
                    Compre o autêntico mel da Terra Quente DOP, cosméticos da colmeia ou materiais apícolas oficiais da AANP.
                  </p>
                </div>
                {/* Search Bar */}
                <div className="relative max-w-md w-full">
                  <input
                    type="text"
                    placeholder="Procurar artigos..."
                    value={shopSearch}
                    onChange={(e) => setShopSearch(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-xl text-xs bg-white dark:bg-zinc-900 text-zinc-800 dark:text-zinc-100 placeholder-zinc-400"
                  />
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400" />
                </div>
              </div>

              {/* Category selector & member alert */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex flex-wrap gap-2">
                  {[
                    { id: 'todos', label: 'Todos os Artigos' },
                    { id: 'mel-e-derivados', label: 'Mel e Derivados' },
                    { id: 'cosmetica', label: 'Cosmética Natural' },
                    { id: 'produtos-apicolas', label: 'Produtos Apícolas' }
                  ].map(cat => (
                    <button
                      key={cat.id}
                      onClick={() => setShopCategory(cat.id)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        shopCategory === cat.id
                          ? isHighContrast
                            ? 'bg-yellow-400 text-black border-2 border-yellow-500'
                            : 'bg-[#0e5c94] text-white'
                          : isHighContrast
                            ? 'bg-black text-yellow-400 border border-yellow-500/50 hover:border-yellow-500'
                            : 'bg-zinc-100 dark:bg-zinc-900 hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-200'
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>

                {isPortalLoggedIn && (
                  <div className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 ${
                    isHighContrast ? 'border-2 border-yellow-500 text-yellow-400 bg-black' : 'bg-amber-50 dark:bg-amber-950/20 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-900/30'
                  }`}>
                    <CheckCircle2 className="h-4 w-4 shrink-0" />
                    <span>Benefício de Sócio Ativo: 10% de desconto imediato em toda a loja!</span>
                  </div>
                )}
              </div>

              {/* Product Grid */}
              {(() => {
                const filteredProducts = products.filter(p => {
                  const matchesCategory = shopCategory === 'todos' || p.category === shopCategory;
                  const matchesSearch = p.name.toLowerCase().includes(shopSearch.toLowerCase()) || 
                                        p.description.toLowerCase().includes(shopSearch.toLowerCase());
                  return matchesCategory && matchesSearch;
                });

                if (filteredProducts.length === 0) {
                  return (
                    <div className="text-center py-16">
                      <ShoppingBag className="mx-auto h-12 w-12 text-zinc-350 dark:text-zinc-650 mb-3" />
                      <p className="text-sm font-semibold text-zinc-500 dark:text-zinc-400">Nenhum produto encontrado para os filtros selecionados.</p>
                    </div>
                  );
                }

                return (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredProducts.map(p => {
                      // Apply member discount if logged in
                      const hasDiscount = isPortalLoggedIn;
                      const finalPrice = hasDiscount ? p.price * 0.9 : p.price;

                      return (
                        <div key={p.id} className={cardThemeClass + ' flex flex-col justify-between'}>
                          <div>
                            <div className="relative aspect-square w-full rounded-xl overflow-hidden mb-4 bg-zinc-50 dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-800">
                              <img
                                src={p.imageUrl}
                                alt={p.name}
                                className="object-cover w-full h-full hover:scale-105 transition-transform duration-300"
                              />
                              {hasDiscount && (
                                <span className="absolute top-2.5 right-2.5 bg-amber-500 text-white text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider">
                                  Sócio -10%
                                </span>
                              )}
                            </div>

                            <div className="space-y-1.5">
                              <div className="flex items-center justify-between gap-2">
                                <span className="text-[11px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
                                  {p.weightOrDetail}
                                </span>
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                  p.stockStatus === 'em-stock'
                                    ? 'bg-green-50 dark:bg-green-950/20 text-green-700 dark:text-green-400'
                                    : p.stockStatus === 'poucas-unidades'
                                      ? 'bg-orange-50 dark:bg-orange-950/20 text-orange-700 dark:text-orange-400'
                                      : 'bg-red-50 dark:bg-red-950/20 text-red-700 dark:text-red-400'
                                }`}>
                                  {p.stockStatus === 'em-stock' ? 'Em stock' : p.stockStatus === 'poucas-unidades' ? 'Poucas unid.' : 'Indisponível'}
                                </span>
                              </div>
                              <h3 className="font-bold text-sm text-[#0b2c4c] dark:text-zinc-100 line-clamp-1">
                                {p.name}
                              </h3>
                              <p className="text-xs text-zinc-500 dark:text-zinc-400 line-clamp-2 leading-relaxed">
                                {p.description}
                              </p>
                            </div>
                          </div>

                          <div className="mt-4 pt-4 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between gap-4">
                            <div>
                              {hasDiscount ? (
                                <div className="space-y-0.5">
                                  <span className="text-xs text-zinc-400 line-through block">
                                    {p.price.toFixed(2)}€
                                  </span>
                                  <span className="text-base font-extrabold text-amber-500">
                                    {finalPrice.toFixed(2)}€
                                  </span>
                                </div>
                              ) : (
                                <span className="text-base font-extrabold text-[#0e5c94] dark:text-[#38bdf8]">
                                  {p.price.toFixed(2)}€
                                </span>
                              )}
                            </div>

                            <button
                              onClick={() => {
                                setCart(prev => {
                                  const existing = prev.find(item => item.product.id === p.id);
                                  if (existing) {
                                    return prev.map(item => item.product.id === p.id ? { ...item, quantity: item.quantity + 1 } : item);
                                  }
                                  return [...prev, { product: p, quantity: 1 }];
                                });
                                // Speak TTS feedback
                                if (accessibility.ttsEnabled) {
                                  speakText(`Adicionou ${p.name} ao carrinho.`, true);
                                }
                              }}
                              disabled={p.stockStatus === 'indisponivel'}
                              className={`px-4 py-2 text-xs font-bold rounded-xl cursor-pointer transition-colors ${
                                isHighContrast
                                  ? 'bg-yellow-400 text-black hover:bg-yellow-500 font-extrabold border-2 border-yellow-500'
                                  : 'bg-[#0e5c94] text-white hover:bg-opacity-95'
                              } disabled:opacity-50 disabled:cursor-not-allowed`}
                            >
                              Adicionar
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                );
              })()}
            </div>
          )}

          {/* TAB 7: PORTAL DIGITAL DO MEMBRO / ADMIN PANEL (FULL PAGE) */}
          {activeTab === 'portal' && (
            <div className="space-y-8 animate-in fade-in duration-200">
              <div className="border-b pb-4 flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                  <h2 className={`${headingFontClass} text-2xl md:text-3xl font-extrabold text-[#0b2c4c] dark:text-zinc-100`}>
                    Portal Digital AANP
                  </h2>
                  <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-1">
                    {isPortalLoggedIn 
                      ? (isAdminLoggedIn ? 'Painel de Coordenação Administrativa e Publicações' : 'Caderneta Sanitária e Quotas de Associado')
                      : 'Aceda à sua área reservada de apicultor ou coordenação.'
                    }
                  </p>
                </div>
              </div>

              {!isPortalLoggedIn ? (
                /* Login Screen: Split Layout */
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start animate-in fade-in duration-200">
                  {/* Left Column: Info Card */}
                  <div className="lg:col-span-5 space-y-6">
                    <div className="p-6 bg-[#0e5c94]/5 dark:bg-zinc-800/40 border border-[#0e5c94]/20 rounded-2xl space-y-4">
                      <h3 className="font-bold text-[#0e5c94] dark:text-amber-400 text-base">Benefícios da Área Digital</h3>
                      <ul className="space-y-3 text-xs text-zinc-650 dark:text-zinc-355">
                        <li className="flex items-start gap-2">
                          <span className="text-[#0e5c94] dark:text-amber-400 font-extrabold">✓</span>
                          <span><strong>Caderneta Sanitária:</strong> Acompanhamento de tratamentos contra a Varroa e inspeções sanitárias da AANP.</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-[#0e5c94] dark:text-amber-400 font-extrabold">✓</span>
                          <span><strong>Quota Anual:</strong> Verifique o estado de pagamentos e prazos de validade da sua anuidade.</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-[#0e5c94] dark:text-amber-400 font-extrabold">✓</span>
                          <span><strong>Download de Recibos:</strong> Obtenha faturas e recibos emitidos pela associação em formato PDF.</span>
                        </li>
                      </ul>
                    </div>
                  </div>

                  {/* Right Column: Login Form */}
                  <div className="lg:col-span-7">
                    <div className="p-6 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-sm space-y-4">
                      <form onSubmit={handlePortalLogin} className="space-y-4">
                        {/* Role Switch Tabs */}
                        <div className="flex border-b border-zinc-150 dark:border-zinc-800">
                          <button
                            type="button"
                            onClick={() => {
                              setLoginRole('member');
                              setLoginError(null);
                              setPortalNif('');
                              setPortalMemberId('');
                            }}
                            className={`flex-1 pb-2 text-xs font-bold text-center border-b-2 cursor-pointer ${
                              loginRole === 'member'
                                ? 'border-[#0e5c94] text-[#0e5c94] dark:border-amber-400 dark:text-amber-400 font-extrabold'
                                : 'border-transparent text-zinc-450 hover:text-zinc-650'
                            }`}
                          >
                            Área de Sócio
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setLoginRole('admin');
                              setLoginError(null);
                              setPortalNif('');
                              setPortalMemberId('');
                            }}
                            className={`flex-1 pb-2 text-xs font-bold text-center border-b-2 cursor-pointer ${
                              loginRole === 'admin'
                                ? 'border-[#0e5c94] text-[#0e5c94] dark:border-amber-400 dark:text-amber-400 font-extrabold'
                                : 'border-transparent text-zinc-450 hover:text-zinc-655'
                            }`}
                          >
                            Coordenador Admin
                          </button>
                        </div>

                        <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                          {loginRole === 'member' 
                            ? 'Introduza o seu NIF e n.º de associado para aceder à sua caderneta sanitária apícola e descarregar faturas de tratamentos.'
                            : 'Introduza o código de administração da AANP para gerir sócios, quotas, recibos, alertas, produtos, e atualizações do portal.'
                          }
                        </p>

                        {loginRole === 'member' ? (
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-xs font-bold mb-1">NIF do Apicultor *</label>
                              <input 
                                type="text" 
                                required
                                placeholder="Ex: 234567890"
                                value={portalNif}
                                onChange={(e) => setPortalNif(e.target.value)}
                                className="w-full p-2.5 border border-zinc-300 dark:border-zinc-700 rounded-xl text-xs bg-zinc-50 dark:bg-zinc-850 text-zinc-800 dark:text-zinc-100"
                              />
                            </div>

                            <div>
                              <label className="block text-xs font-bold mb-1">Número de Sócio *</label>
                              <input 
                                type="text" 
                                required
                                placeholder="Ex: 1984-A"
                                value={portalMemberId}
                                onChange={(e) => setPortalMemberId(e.target.value)}
                                className="w-full p-2.5 border border-zinc-300 dark:border-zinc-700 rounded-xl text-xs bg-zinc-50 dark:bg-zinc-850 text-zinc-800 dark:text-zinc-100"
                              />
                            </div>
                          </div>
                        ) : (
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-xs font-bold mb-1">Código de Admin *</label>
                              <input 
                                type="text" 
                                required
                                placeholder="Ex: admin"
                                value={portalNif}
                                onChange={(e) => setPortalNif(e.target.value)}
                                className="w-full p-2.5 border border-zinc-300 dark:border-zinc-700 rounded-xl text-xs bg-zinc-50 dark:bg-zinc-850 text-zinc-800 dark:text-zinc-100"
                              />
                            </div>

                            <div>
                              <label className="block text-xs font-bold mb-1">Palavra-passe *</label>
                              <input 
                                type="password" 
                                required
                                placeholder="••••••••"
                                value={portalMemberId}
                                onChange={(e) => setPortalMemberId(e.target.value)}
                                className="w-full p-2.5 border border-zinc-300 dark:border-zinc-700 rounded-xl text-xs bg-zinc-50 dark:bg-zinc-850 text-zinc-800 dark:text-zinc-100"
                              />
                            </div>
                          </div>
                        )}

                        {loginError && (
                          <div className="p-2.5 bg-red-50 dark:bg-red-950/20 text-red-600 rounded-xl text-xs font-bold">
                            {loginError}
                          </div>
                        )}

                        <div className="flex gap-2 pt-2">
                          {loginRole === 'member' && (
                            <button
                              type="button"
                              onClick={handleDemoPortalLogin}
                              className="flex-1 py-2 px-3 border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-650 dark:text-zinc-350 rounded-xl text-[11px] font-bold cursor-pointer"
                            >
                              💡 Testar com Demo
                            </button>
                          )}

                          <button
                            type="submit"
                            className="flex-1 py-2 px-3 bg-[#0e5c94] hover:bg-[#0b2c4c] text-white rounded-xl text-xs font-bold cursor-pointer"
                          >
                            Entrar no Portal
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              ) : isAdminLoggedIn ? (
                /* Admin Dashboard: Full Page Grid */
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start animate-in fade-in duration-200">
                  
                  {/* Left Sidebar: Controls & Selector */}
                  <div className="lg:col-span-4 space-y-6">
                    <div className="p-5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-sm space-y-4">
                      <div className="flex border-b border-zinc-200 dark:border-zinc-800 pb-2">
                        <button
                          type="button"
                          onClick={() => setAdminSubTab('members')}
                          className={`flex-1 pb-1.5 text-center font-bold text-xs cursor-pointer ${
                            adminSubTab === 'members'
                              ? 'text-[#0e5c94] dark:text-amber-400 font-extrabold border-b-2 border-[#0e5c94] dark:border-amber-400'
                              : 'text-zinc-450 hover:text-zinc-650'
                          }`}
                        >
                          Gerir Sócios
                        </button>
                        <button
                          type="button"
                          onClick={() => setAdminSubTab('content')}
                          className={`flex-1 pb-1.5 text-center font-bold text-xs cursor-pointer ${
                            adminSubTab === 'content'
                              ? 'text-[#0e5c94] dark:text-amber-400 font-extrabold border-b-2 border-[#0e5c94] dark:border-amber-400'
                              : 'text-zinc-455 hover:text-zinc-655'
                          }`}
                        >
                          Novos Conteúdos
                        </button>
                      </div>

                      {adminSubTab === 'members' ? (
                        <div className="space-y-4">
                          <div>
                            <label className="block text-[10px] font-bold mb-1.5 uppercase tracking-wider text-zinc-400">Selecionar Associado *</label>
                            <select
                              value={selectedMemberId}
                              onChange={(e) => setSelectedMemberId(e.target.value)}
                              className="w-full p-2.5 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-white dark:bg-zinc-850 text-xs text-zinc-800 dark:text-zinc-100"
                            >
                              {members.map(m => (
                                <option key={m.memberId} value={m.memberId}>
                                  {m.name} ({m.memberId})
                                </option>
                              ))}
                            </select>
                          </div>

                          {selectedMember && (
                            <div className="p-4 bg-zinc-50 dark:bg-zinc-850/50 border border-zinc-150 dark:border-zinc-800 rounded-xl space-y-2 text-xs">
                              <span className="block font-bold text-[10px] uppercase text-zinc-400 tracking-wider">Dados Resumidos:</span>
                              <div className="flex justify-between">
                                <span className="text-zinc-450">NIF:</span>
                                <span className="font-mono font-bold">{selectedMember.nif}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-zinc-455">Efetivo Registado:</span>
                                <span className="font-bold">{selectedMember.hivesCount} colmeias</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-zinc-455">Estado Quota:</span>
                                <span className={`font-bold ${selectedMember.status.includes('Regularizadas') ? 'text-emerald-500' : 'text-red-500'}`}>{selectedMember.status}</span>
                              </div>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="space-y-3">
                          <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-400">Tipo de Conteúdo *</label>
                          <div className="grid grid-cols-2 gap-2">
                            {[
                              { id: 'alert', label: 'Alerta Sanitário' },
                              { id: 'product', label: 'Produto Loja' },
                              { id: 'guide', label: 'Guia Técnico' },
                              { id: 'leg', label: 'Atualização Lei' }
                            ].map(type => (
                              <button
                                key={type.id}
                                type="button"
                                onClick={() => setContentType(type.id as any)}
                                className={`p-2 text-xs font-bold rounded-xl border cursor-pointer transition-all text-center ${
                                  contentType === type.id
                                    ? 'bg-[#0e5c94] border-[#0e5c94] text-white'
                                    : 'border-zinc-200 dark:border-zinc-800 text-zinc-650 hover:bg-zinc-50 dark:hover:bg-zinc-855'
                                }`}
                              >
                                {type.label}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right Form Fields */}
                  <div className="lg:col-span-8">
                    {adminSubTab === 'members' ? (
                      <div className="space-y-6">
                        {/* Quotas Form */}
                        <div className="p-6 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-sm space-y-4">
                          <h3 className="font-bold text-[#0b2c4c] dark:text-zinc-100 text-sm border-b pb-2 flex items-center gap-2">
                            <span className="bg-[#0e5c94]/10 text-[#0e5c94] p-1.5 rounded-lg text-xs">📅</span>
                            <span>Atualizar Anuidade de Quotas</span>
                          </h3>
                          <form onSubmit={handleUpdateQuotas} className="space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                              <div>
                                <label className="block text-xs font-bold mb-1">Ano da Quota</label>
                                <input
                                  type="number"
                                  value={quotaYear}
                                  onChange={(e) => setQuotaYear(Number(e.target.value))}
                                  className="w-full p-2.5 border border-zinc-350 dark:border-zinc-700 rounded-xl bg-zinc-50 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-150 text-xs"
                                />
                              </div>
                              <div>
                                <label className="block text-xs font-bold mb-1">Paga?</label>
                                <select
                                  value={quotaPaid ? 'true' : 'false'}
                                  onChange={(e) => setQuotaPaid(e.target.value === 'true')}
                                  className="w-full p-2.5 border border-zinc-355 dark:border-zinc-700 rounded-xl bg-zinc-50 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-150 text-xs"
                                >
                                  <option value="true">Sim (Paga)</option>
                                  <option value="false">Não (Pendente)</option>
                                </select>
                              </div>
                              <div>
                                <label className="block text-xs font-bold mb-1">Data Limite de Vencimento</label>
                                <input
                                  type="text"
                                  value={quotaExpiry}
                                  onChange={(e) => setQuotaExpiry(e.target.value)}
                                  className="w-full p-2.5 border border-zinc-355 dark:border-zinc-700 rounded-xl bg-zinc-50 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-150 text-xs"
                                />
                              </div>
                            </div>
                            <button
                              type="submit"
                              className="w-full py-2.5 bg-[#0e5c94] hover:bg-[#0b2c4c] text-white font-bold rounded-xl text-xs transition-colors cursor-pointer"
                            >
                              Confirmar Alterações de Quota
                            </button>
                          </form>
                          {quotaStatusMessage && (
                            <div className="p-2.5 bg-green-50 dark:bg-green-950/20 text-green-700 dark:text-green-300 font-bold rounded-xl text-xs text-center animate-in fade-in">
                              {quotaStatusMessage}
                            </div>
                          )}
                        </div>

                        {/* Receipts Uploader Form */}
                        <div className="p-6 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-sm space-y-4">
                          <h3 className="font-bold text-[#0b2c4c] dark:text-zinc-100 text-sm border-b pb-2 flex items-center gap-2">
                            <span className="bg-[#0e5c94]/10 text-[#0e5c94] p-1.5 rounded-lg text-xs">📄</span>
                            <span>Upload e Emissão de Recibo / Fatura</span>
                          </h3>
                          <form onSubmit={handleUploadReceipt} className="space-y-4">
                            <div>
                              <label className="block text-xs font-bold mb-1">Nome / Descrição da Fatura *</label>
                              <input
                                type="text"
                                required
                                value={receiptName}
                                onChange={(e) => setReceiptName(e.target.value)}
                                className="w-full p-2.5 border border-zinc-300 dark:border-zinc-700 rounded-xl bg-zinc-50 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-150 text-xs"
                              />
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <div>
                                <label className="block text-xs font-bold mb-1">Valor do Recibo (€) *</label>
                                <input
                                  type="number"
                                  step="0.01"
                                  required
                                  value={receiptAmount}
                                  onChange={(e) => setReceiptAmount(Number(e.target.value))}
                                  className="w-full p-2.5 border border-zinc-300 dark:border-zinc-700 rounded-xl bg-zinc-50 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-150 text-xs"
                                />
                              </div>
                              <div>
                                <label className="block text-xs font-bold mb-1">Data de Pagamento / Emissão *</label>
                                <input
                                  type="text"
                                  required
                                  value={receiptDate}
                                  onChange={(e) => setReceiptDate(e.target.value)}
                                  className="w-full p-2.5 border border-zinc-300 dark:border-zinc-700 rounded-xl bg-zinc-50 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-150 text-xs"
                                />
                              </div>
                            </div>
                            <button
                              type="submit"
                              className="w-full py-2.5 bg-[#0e5c94] hover:bg-[#0b2c4c] text-white font-bold rounded-xl text-xs transition-colors cursor-pointer"
                            >
                              Publicar Recibo PDF no Histórico do Sócio
                            </button>
                          </form>
                          {receiptStatusMessage && (
                            <div className="p-2.5 bg-green-50 dark:bg-green-950/20 text-green-700 dark:text-green-300 font-bold rounded-xl text-xs text-center animate-in fade-in">
                              {receiptStatusMessage}
                            </div>
                          )}
                        </div>
                      </div>
                    ) : (
                      /* Add Content Forms */
                      <div className="p-6 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-sm space-y-4 animate-in fade-in duration-200">
                        <h3 className="font-bold text-[#0b2c4c] dark:text-zinc-100 text-sm border-b pb-2 flex items-center gap-2">
                          <span className="bg-[#0e5c94]/10 text-[#0e5c94] p-1.5 rounded-lg text-xs">✨</span>
                          <span>Criar Novo Artigo / Alerta</span>
                        </h3>
                        <form onSubmit={handleAddContent} className="space-y-4">
                          {contentType === 'alert' && (
                            <div className="space-y-4">
                              <div>
                                <label className="block text-xs font-bold mb-1">Mensagem de Alerta Veterinário *</label>
                                <textarea
                                  required
                                  value={alertMsg}
                                  onChange={(e) => setAlertMsg(e.target.value)}
                                  rows={3}
                                  placeholder="Indique riscos fitossanitários ou tratamentos sazonais obrigatórios..."
                                  className="w-full p-2.5 border border-zinc-300 dark:border-zinc-700 rounded-xl bg-zinc-50 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-150 text-xs"
                                />
                              </div>
                              <div>
                                <label className="block text-xs font-bold mb-1">Grau de Emergência *</label>
                                <select
                                  value={alertType}
                                  onChange={(e) => setAlertType(e.target.value as any)}
                                  className="w-full p-2.5 border border-zinc-300 dark:border-zinc-700 rounded-xl bg-zinc-50 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-150 text-xs"
                                >
                                  <option value="danger">Crítico (Perigo Imediato)</option>
                                  <option value="warning">Aviso Sanitário (Prevenção)</option>
                                  <option value="info">Informação de Serviços</option>
                                </select>
                              </div>
                            </div>
                          )}

                          {contentType === 'product' && (
                            <div className="space-y-4">
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                  <label className="block text-xs font-bold mb-1">Nome do Artigo *</label>
                                  <input
                                    type="text"
                                    required
                                    value={prodName}
                                    onChange={(e) => setProdName(e.target.value)}
                                    className="w-full p-2.5 border border-zinc-300 dark:border-zinc-700 rounded-xl bg-zinc-50 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-150 text-xs"
                                  />
                                </div>
                                <div>
                                  <label className="block text-xs font-bold mb-1">Preço do Produto (€) *</label>
                                  <input
                                    type="number"
                                    step="0.01"
                                    required
                                    value={prodPrice}
                                    onChange={(e) => setProdPrice(Number(e.target.value))}
                                    className="w-full p-2.5 border border-zinc-300 dark:border-zinc-700 rounded-xl bg-zinc-50 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-150 text-xs"
                                  />
                                </div>
                              </div>

                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                  <label className="block text-xs font-bold mb-1">Categoria na Loja *</label>
                                  <select
                                    value={prodCat}
                                    onChange={(e) => setProdCat(e.target.value as any)}
                                    className="w-full p-2.5 border border-zinc-300 dark:border-zinc-700 rounded-xl bg-zinc-50 dark:bg-zinc-800 text-zinc-850 dark:text-zinc-150 text-xs"
                                  >
                                    <option value="mel-e-derivados">Mel e Derivados</option>
                                    <option value="cosmetica">Cosmética Natural</option>
                                    <option value="produtos-apicolas">Produtos Apícolas</option>
                                  </select>
                                </div>
                                <div>
                                  <label className="block text-xs font-bold mb-1">Especificações / Formato</label>
                                  <input
                                    type="text"
                                    placeholder="Ex: Frasco 500g, Embalagem de 12 unid."
                                    value={prodWeight}
                                    onChange={(e) => setProdWeight(e.target.value)}
                                    className="w-full p-2.5 border border-zinc-300 dark:border-zinc-700 rounded-xl bg-zinc-50 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-150 text-xs"
                                  />
                                </div>
                              </div>

                              <div>
                                <label className="block text-xs font-bold mb-1">Descrição Curta *</label>
                                <textarea
                                  required
                                  value={prodDesc}
                                  onChange={(e) => setProdDesc(e.target.value)}
                                  rows={2}
                                  className="w-full p-2.5 border border-zinc-300 dark:border-zinc-700 rounded-xl bg-zinc-50 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-150 text-xs"
                                />
                              </div>

                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                  <label className="block text-xs font-bold mb-1">Stock Disponível *</label>
                                  <select
                                    value={prodStock}
                                    onChange={(e) => setProdStock(e.target.value as any)}
                                    className="w-full p-2.5 border border-zinc-300 dark:border-zinc-700 rounded-xl bg-zinc-50 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-150 text-xs"
                                  >
                                    <option value="em-stock">Disponível em Stock</option>
                                    <option value="poucas-unidades">Poucas Unidades</option>
                                    <option value="indisponivel">Esgotado</option>
                                  </select>
                                </div>
                                <div>
                                  <label className="block text-xs font-bold mb-1">Fotografia do Produto</label>
                                  <select
                                    value={prodImage}
                                    onChange={(e) => setProdImage(e.target.value)}
                                    className="w-full p-2.5 border border-zinc-300 dark:border-zinc-700 rounded-xl bg-zinc-50 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-150 text-xs"
                                  >
                                    <option value="/mel_urze.jpg">Mel de Urze</option>
                                    <option value="/colheita_sustentavel.jpg">Mel de Castanheiro</option>
                                    <option value="/sabonete_mel.jpg">Sabonete Natural de Mel</option>
                                    <option value="/fato_apicultor.jpg">Fato de Proteção Apícola</option>
                                  </select>
                                </div>
                              </div>
                            </div>
                          )}

                          {contentType === 'guide' && (
                            <div className="space-y-4">
                              <div>
                                <label className="block text-xs font-bold mb-1">Título do Guia Prático *</label>
                                <input
                                  type="text"
                                  required
                                  value={guideTitle}
                                  onChange={(e) => setGuideTitle(e.target.value)}
                                  className="w-full p-2.5 border border-zinc-300 dark:border-zinc-700 rounded-xl bg-zinc-50 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-150 text-xs"
                                />
                              </div>
                              <div>
                                <label className="block text-xs font-bold mb-1">Breve Resumo *</label>
                                  <input
                                    type="text"
                                    required
                                    value={guideShort}
                                    onChange={(e) => setGuideShort(e.target.value)}
                                    className="w-full p-2.5 border border-zinc-300 dark:border-zinc-700 rounded-xl bg-zinc-50 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-150 text-xs"
                                  />
                              </div>
                              <div>
                                <label className="block text-xs font-bold mb-1">Conteúdo Completo do Guia *</label>
                                <textarea
                                  required
                                  value={guideFull}
                                  onChange={(e) => setGuideFull(e.target.value)}
                                  rows={4}
                                  placeholder="Digite as instruções e boas práticas apícolas..."
                                  className="w-full p-2.5 border border-zinc-300 dark:border-zinc-700 rounded-xl bg-zinc-50 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-150 text-xs"
                                />
                              </div>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                  <label className="block text-xs font-bold mb-1">Ícone / Categoria *</label>
                                  <select
                                    value={guideBadge}
                                    onChange={(e) => setGuideBadge(e.target.value as any)}
                                    className="w-full p-2.5 border border-zinc-300 dark:border-zinc-700 rounded-xl bg-zinc-50 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-150 text-xs"
                                  >
                                    <option value="doc">Documento Geral (Manual)</option>
                                    <option value="hive">Manejo das Colmeias (Inspeção)</option>
                                    <option value="honey">Produção de Mel (Extração)</option>
                                  </select>
                                </div>
                                <div>
                                  <label className="block text-xs font-bold mb-1">Imagem Ilustrativa</label>
                                  <select
                                    value={guideImage}
                                    onChange={(e) => setGuideImage(e.target.value)}
                                    className="w-full p-2.5 border border-zinc-300 dark:border-zinc-700 rounded-xl bg-zinc-50 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-150 text-xs"
                                  >
                                    <option value="/manejo_outono.jpg">Trabalhos de Outono</option>
                                    <option value="/melhoramento_rainhas.jpg">Criação de Rainhas</option>
                                    <option value="/colheita_sustentavel.jpg">Colheita de Mel</option>
                                  </select>
                                </div>
                              </div>
                            </div>
                          )}

                          {contentType === 'leg' && (
                            <div className="space-y-4">
                              <div>
                                <label className="block text-xs font-bold mb-1">Título da Lei ou Edital *</label>
                                <input
                                  type="text"
                                  required
                                  value={legTitle}
                                  onChange={(e) => setLegTitle(e.target.value)}
                                  className="w-full p-2.5 border border-zinc-300 dark:border-zinc-700 rounded-xl bg-zinc-50 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-150 text-xs"
                                />
                              </div>
                              <div>
                                <label className="block text-xs font-bold mb-1">Breve Resumo *</label>
                                <input
                                  type="text"
                                  required
                                  value={legShort}
                                  onChange={(e) => setLegShort(e.target.value)}
                                  className="w-full p-2.5 border border-zinc-300 dark:border-zinc-700 rounded-xl bg-zinc-50 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-150 text-xs"
                                />
                              </div>
                              <div>
                                <label className="block text-xs font-bold mb-1">Teor do Edital / Decreto Legislativo *</label>
                                <textarea
                                  required
                                  value={legFull}
                                  onChange={(e) => setLegFull(e.target.value)}
                                  rows={4}
                                  className="w-full p-2.5 border border-zinc-300 dark:border-zinc-700 rounded-xl bg-zinc-50 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-150 text-xs"
                                />
                              </div>
                              <div>
                                <label className="block text-xs font-bold mb-1">Ícone / Categoria *</label>
                                <select
                                  value={legBadge}
                                  onChange={(e) => setLegBadge(e.target.value as any)}
                                  className="w-full p-2.5 border border-zinc-300 dark:border-zinc-700 rounded-xl bg-zinc-50 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-150 text-xs"
                                >
                                  <option value="doc">Edital Sanitário Geral</option>
                                  <option value="hive">Rastreabilidade e Apiários</option>
                                  <option value="book">Regulamentos Apícolas Oficiais</option>
                                </select>
                              </div>
                            </div>
                          )}

                          <button
                            type="submit"
                            className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-white font-extrabold rounded-xl text-xs transition-colors cursor-pointer"
                          >
                            Publicar Novo Conteúdo no Portal AANP
                          </button>
                        </form>
                        {contentStatusMessage && (
                          <div className="p-2.5 bg-green-50 dark:bg-green-950/20 text-green-700 dark:text-green-300 font-bold rounded-xl text-xs text-center animate-in fade-in">
                            {contentStatusMessage}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                /* Member Dashboard: Full Page Grid */
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start animate-in fade-in duration-200">
                  
                  {/* Left Column: Digital Card & support records */}
                  <div className="lg:col-span-5 space-y-6">
                    {/* Simulated Digital Card */}
                    <div className="p-6 bg-gradient-to-br from-[#0e5c94] to-[#0b2c4c] text-white rounded-2xl space-y-6 shadow-sm relative overflow-hidden">
                      <div className="absolute right-0 bottom-0 opacity-10 text-white select-none pointer-events-none translate-y-6 translate-x-6">
                        <Logo size={180} variant="icon" />
                      </div>
                      
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="block text-[10px] uppercase font-bold tracking-wider opacity-80">Cartão Digital de Associado</span>
                          <span className="font-extrabold text-lg block mt-1">{portalMemberData.name}</span>
                        </div>
                        <span className="px-2 py-1 rounded bg-white/20 text-[10px] font-extrabold">AANP 2026</span>
                      </div>

                      <div className="grid grid-cols-2 gap-4 text-xs">
                        <div>
                          <span className="block opacity-75">N.º de Associado</span>
                          <span className="font-mono font-bold text-sm block mt-0.5">{portalMemberData.memberId}</span>
                        </div>
                        <div>
                          <span className="block opacity-75">Contribuinte (NIF)</span>
                          <span className="font-mono font-bold text-sm block mt-0.5">{portalMemberData.nif}</span>
                        </div>
                        <div>
                          <span className="block opacity-75">Efetivo Registado</span>
                          <span className="font-bold text-sm block mt-0.5">{portalMemberData.hivesCount} colmeias</span>
                        </div>
                        <div>
                          <span className="block opacity-75 font-semibold">Estado Veterinário</span>
                          <span className="text-emerald-400 font-bold uppercase text-xs block mt-0.5">{portalMemberData.status}</span>
                        </div>
                      </div>
                    </div>

                    {/* Additional sanitary and treatments records */}
                    <div className="p-5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-sm space-y-3">
                      <span className="block font-bold text-xs uppercase tracking-wider text-zinc-400">Registo Veterinário de Inspeções:</span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-zinc-50 dark:bg-zinc-850 p-4 rounded-xl text-xs">
                        <div>
                          <span className="block text-zinc-500">Última Inspeção</span>
                          <span className="font-bold text-zinc-700 dark:text-zinc-300 text-sm block mt-0.5">{portalMemberData.lastSanitaryInspection}</span>
                        </div>
                        <div>
                          <span className="block text-zinc-500">Próximo Tratamento</span>
                          <span className="font-bold text-amber-600 dark:text-amber-400 text-sm block mt-0.5">{portalMemberData.nextTreatmentDate}</span>
                        </div>
                      </div>

                      <button
                        onClick={() => window.print()}
                        className="w-full py-2 bg-[#0e5c94]/10 hover:bg-[#0e5c94]/20 text-[#0e5c94] dark:text-amber-400 font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                      >
                        Imprimir Certidão de Sócio
                      </button>
                    </div>
                  </div>

                  {/* Right Column: Quotas history & Receipts download list */}
                  <div className="lg:col-span-7 space-y-6">
                    {/* Member Quotas History */}
                    <div className="p-5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-sm space-y-3">
                      <span className="block font-bold text-xs uppercase tracking-wider text-zinc-400">Histórico de Quotas Anuais:</span>
                      <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                        {portalMemberData.quotas && portalMemberData.quotas.map((q: any) => (
                          <div key={q.year} className="flex justify-between items-center bg-zinc-50 dark:bg-zinc-800 p-3 rounded-xl text-xs">
                            <div>
                              <span className="font-bold text-sm text-zinc-700 dark:text-zinc-300 block">Ano {q.year}</span>
                              <span className="text-zinc-400">Data limite: {q.expiryDate}</span>
                            </div>
                            <span className={`px-3 py-1 rounded-full font-bold uppercase text-[10px] ${
                              q.paid 
                                ? 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600' 
                                : 'bg-red-50 dark:bg-red-950/20 text-red-600'
                            }`}>
                              {q.paid ? `Paga (${q.paymentDate})` : 'Pendente'}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Member Receipts List */}
                    <div className="p-5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-sm space-y-3">
                      <span className="block font-bold text-xs uppercase tracking-wider text-zinc-400">Recibos e Faturas Disponíveis:</span>
                      <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                        {!portalMemberData.receipts || portalMemberData.receipts.length === 0 ? (
                          <span className="text-zinc-500 italic block text-center py-4">Nenhum recibo registado no sistema.</span>
                        ) : (
                          portalMemberData.receipts.map((r: any) => (
                            <div key={r.id} className="flex justify-between items-center bg-zinc-50 dark:bg-zinc-800 p-3 rounded-xl text-xs">
                              <div>
                                <span className="font-bold text-sm text-zinc-700 dark:text-zinc-300 block">{r.name}</span>
                                <span className="text-zinc-400">Emitido em: {r.date} • Valor: {r.amount.toFixed(2)}€</span>
                              </div>
                              <a
                                href="#"
                                onClick={(e) => {
                                  e.preventDefault();
                                  alert(`A descarregar PDF de ${r.name} (${r.id})...`);
                                }}
                                className="px-3 py-1.5 bg-[#0e5c94] text-white font-bold rounded-lg text-xs hover:bg-[#0b2c4c] transition-colors"
                              >
                                PDF
                              </a>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

        </div>
      </main>

      {/* 5. FOOTER */}
      <footer 
        id="main-footer"
        className={`py-8 mt-12 border-t transition-colors duration-200 ${
          isHighContrast
            ? 'bg-black text-yellow-400 border-yellow-500 text-xs font-bold'
            : 'bg-zinc-50 dark:bg-zinc-950 text-zinc-500 dark:text-zinc-400 border-zinc-200 dark:border-zinc-900 text-xs'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="opacity-80 text-[11px]">
            &copy; 2026 Associação Nacional de Apicultores de Portugal. Todos os direitos reservados.
          </p>

          <div className="flex flex-wrap justify-center items-center gap-6">
            <button onClick={() => setActiveTab('inicio')} className="hover:underline cursor-pointer font-bold">Sobre</button>
            <button onClick={() => setActiveTab('membros')} className="hover:underline cursor-pointer font-bold">Membros</button>
            <button onClick={() => setActiveTab('recursos')} className="hover:underline cursor-pointer font-bold">Recursos</button>
            <button onClick={() => setActiveTab('noticias')} className="hover:underline cursor-pointer font-bold">Notícias</button>
            <button onClick={() => setActiveTab('contactos')} className="hover:underline cursor-pointer font-bold">Contato</button>
          </div>

          <div className="flex items-center gap-3">
            <a href="https://www.facebook.com/apicultores.norte" target="_blank" rel="noopener noreferrer" className="hover:text-blue-600 transition-colors">
              <Facebook className="h-5 w-5" />
            </a>
            <span className="opacity-30">|</span>
            <span className="p-1 rounded-sm bg-yellow-400/20 text-yellow-600 dark:text-yellow-400 font-semibold text-[10px]">
              Acessibilidade Sénior Ativa
            </span>
          </div>
        </div>
      </footer>

      {/* MODAL 1: PRACTICAL GUIDE DETAIL VIEW */}
      {selectedGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className={`w-full max-w-2xl overflow-hidden rounded-2xl shadow-xl transition-all ${
            isHighContrast ? 'bg-black text-yellow-400 border-2 border-yellow-500' : 'bg-white dark:bg-zinc-900'
          }`}>
            <img 
              src={selectedGuide.imageUrl} 
              alt={selectedGuide.title}
              className="w-full h-48 sm:h-60 object-cover"
              referrerPolicy="no-referrer"
            />
            
            <div className="p-6 space-y-4">
              <div className="flex items-start justify-between gap-4 border-b pb-3 border-zinc-100 dark:border-zinc-800">
                <h3 className="font-bold text-lg sm:text-xl text-[#0b2c4c] dark:text-zinc-100 leading-snug">
                  {selectedGuide.title}
                </h3>
                
                <button
                  onClick={() => speakText(`${selectedGuide.title}. ${selectedGuide.fullDesc}`, accessibility.ttsEnabled || true)}
                  className={`p-1.5 rounded-full border ${
                    isHighContrast 
                      ? 'bg-yellow-400 text-black border-yellow-500' 
                      : 'bg-zinc-50 dark:bg-zinc-800 hover:bg-zinc-100 border-zinc-200 text-[#0e5c94] dark:text-amber-400'
                  }`}
                  title="Ouvir Guia"
                >
                  <Volume2 className="h-4.5 w-4.5" />
                </button>
              </div>

              <p className={`text-xs sm:text-sm leading-relaxed whitespace-pre-line ${
                isHighContrast ? 'text-yellow-300' : 'text-zinc-600 dark:text-zinc-300'
              }`}>
                {selectedGuide.fullDesc}
              </p>

              <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-zinc-100 dark:border-zinc-800">
                <button
                  onClick={() => window.print()}
                  className="flex items-center gap-1.5 px-3 py-2 border rounded-lg text-xs font-bold hover:bg-zinc-50 dark:hover:bg-zinc-800 cursor-pointer"
                >
                  <Printer className="h-4 w-4" />
                  <span>Imprimir Guia (Apoio Sénior)</span>
                </button>

                <button
                  onClick={() => setSelectedGuide(null)}
                  className={`px-4 py-2 text-xs font-bold rounded-lg cursor-pointer ${
                    isHighContrast
                      ? 'bg-yellow-400 text-black font-black'
                      : 'bg-[#0e5c94] text-white hover:bg-opacity-95'
                  }`}
                >
                  Fechar Leitura
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: LEGISLATION UPDATE DETAIL VIEW */}
      {selectedLegislation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className={`w-full max-w-xl p-6 rounded-2xl shadow-xl transition-all ${
            isHighContrast ? 'bg-black text-yellow-400 border-2 border-yellow-500' : 'bg-white dark:bg-zinc-900'
          }`}>
            <div className="flex items-start justify-between gap-4 border-b pb-3 border-zinc-100 dark:border-zinc-800 mb-4">
              <h3 className="font-bold text-base sm:text-lg text-[#0b2c4c] dark:text-zinc-100 leading-snug">
                {selectedLegislation.title}
              </h3>
              
              <button
                onClick={() => speakText(`${selectedLegislation.title}. ${selectedLegislation.fullDesc}`, accessibility.ttsEnabled || true)}
                className={`p-1.5 rounded-full border ${
                  isHighContrast 
                    ? 'bg-yellow-400 text-black border-yellow-500' 
                    : 'bg-zinc-50 dark:bg-zinc-800 hover:bg-zinc-100 border-zinc-200 text-[#0e5c94] dark:text-amber-400'
                }`}
                title="Ouvir Legislação"
              >
                <Volume2 className="h-4.5 w-4.5" />
              </button>
            </div>

            <p className={`text-xs sm:text-sm leading-relaxed whitespace-pre-line mb-6 ${
              isHighContrast ? 'text-yellow-300' : 'text-zinc-600 dark:text-zinc-300'
            }`}>
              {selectedLegislation.fullDesc}
            </p>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-zinc-100 dark:border-zinc-800">
              <button
                onClick={() => window.print()}
                className="flex items-center gap-1.5 px-3 py-2 border rounded-lg text-xs font-bold hover:bg-zinc-50 dark:hover:bg-zinc-800 cursor-pointer"
              >
                <Printer className="h-4 w-4" />
                <span>Imprimir Documento</span>
              </button>

              <button
                onClick={() => setSelectedLegislation(null)}
                className={`px-4 py-2 text-xs font-bold rounded-lg cursor-pointer ${
                  isHighContrast
                    ? 'bg-yellow-400 text-black font-black'
                    : 'bg-[#0e5c94] text-white hover:bg-opacity-95'
                }`}
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 6. SHOPPING CART DRAWER */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden" aria-labelledby="slide-over-title" role="dialog" aria-modal="true">
          <div className="absolute inset-0 overflow-hidden">
            {/* Backdrop */}
            <div 
              onClick={() => setIsCartOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity duration-300"
            />

            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
              <div className={`pointer-events-auto w-screen max-w-md transform transition-transform duration-300 ${
                isHighContrast
                  ? 'border-l-2 border-yellow-500 bg-black text-yellow-400 rounded-none'
                  : 'bg-white dark:bg-zinc-900 shadow-xl'
              } flex flex-col h-full`}>
                {/* Header */}
                <div className="p-6 border-b border-zinc-150 dark:border-zinc-800 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ShoppingCart className="h-5 w-5 text-[#0e5c94] dark:text-[#38bdf8]" />
                    <h2 className="text-base font-extrabold text-[#0b2c4c] dark:text-zinc-100">
                      Carrinho de Compras
                    </h2>
                  </div>
                  <button 
                    onClick={() => setIsCartOpen(false)}
                    className="p-1 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                {/* Cart Items List */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                  {cart.length === 0 ? (
                    <div className="text-center py-16 space-y-3">
                      <ShoppingBag className="mx-auto h-12 w-12 text-zinc-350 dark:text-zinc-650" />
                      <p className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">
                        O seu carrinho está vazio. Adicione mel ou equipamentos apícolas na loja!
                      </p>
                    </div>
                  ) : (
                    cart.map(item => {
                      const finalPrice = isPortalLoggedIn ? item.product.price * 0.9 : item.product.price;
                      return (
                        <div key={item.product.id} className="flex gap-4 p-3 bg-zinc-50 dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-800/80 rounded-xl">
                          <img 
                            src={item.product.imageUrl} 
                            alt={item.product.name} 
                            className="h-16 w-16 object-cover rounded-lg bg-white border shrink-0" 
                          />
                          <div className="flex-1 min-w-0 flex flex-col justify-between">
                            <div>
                              <h4 className="text-xs font-bold text-zinc-800 dark:text-zinc-100 line-clamp-1 font-sans">
                                {item.product.name}
                              </h4>
                              <span className="text-[10px] text-zinc-400 block">{item.product.weightOrDetail}</span>
                            </div>
                            <div className="flex items-center justify-between gap-4 mt-2">
                              {/* Quantity Editor */}
                              <div className="flex items-center border border-zinc-200 dark:border-zinc-800 rounded-lg">
                                <button
                                  onClick={() => {
                                    setCart(prev => prev.map(i => i.product.id === item.product.id ? { ...i, quantity: Math.max(1, i.quantity - 1) } : i));
                                  }}
                                  className="p-1 text-zinc-500 hover:text-zinc-700 cursor-pointer"
                                >
                                  <Minus className="h-3 w-3" />
                                </button>
                                <span className="px-2 text-xs font-bold text-zinc-800 dark:text-zinc-100 font-mono">
                                  {item.quantity}
                                </span>
                                <button
                                  onClick={() => {
                                    setCart(prev => prev.map(i => i.product.id === item.product.id ? { ...i, quantity: i.quantity + 1 } : i));
                                  }}
                                  className="p-1 text-zinc-500 hover:text-zinc-700 cursor-pointer"
                                >
                                  <Plus className="h-3 w-3" />
                                </button>
                              </div>
                              {/* Price and Delete */}
                              <div className="flex items-center gap-3">
                                <span className="text-xs font-extrabold text-zinc-800 dark:text-zinc-100 font-mono">
                                  {(finalPrice * item.quantity).toFixed(2)}€
                                </span>
                                <button
                                  onClick={() => {
                                    setCart(prev => prev.filter(i => i.product.id !== item.product.id));
                                  }}
                                  className="text-red-500 hover:text-red-700 cursor-pointer"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>

                {/* Footer and Totals */}
                {cart.length > 0 && (() => {
                  const subtotal = cart.reduce((total, item) => total + (item.product.price * item.quantity), 0);
                  const discount = isPortalLoggedIn ? subtotal * 0.1 : 0;
                  const total = subtotal - discount;

                  return (
                    <div className="p-6 border-t border-zinc-150 dark:border-zinc-800 space-y-4 bg-zinc-50 dark:bg-zinc-950/50">
                      <div className="space-y-1.5 text-xs text-zinc-600 dark:text-zinc-300">
                        <div className="flex justify-between">
                          <span>Subtotal</span>
                          <span className="font-mono">{subtotal.toFixed(2)}€</span>
                        </div>
                        {isPortalLoggedIn && (
                          <div className="flex justify-between text-amber-600 dark:text-amber-400 font-bold">
                            <span>Desconto de Sócio (10%)</span>
                            <span className="font-mono">-{discount.toFixed(2)}€</span>
                          </div>
                        )}
                        <div className="flex justify-between text-sm font-extrabold text-zinc-800 dark:text-zinc-100 border-t pt-2 mt-2">
                          <span>Total Estimado</span>
                          <span className="font-mono text-[#0e5c94] dark:text-[#38bdf8] text-base">{total.toFixed(2)}€</span>
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          setIsCartOpen(false);
                          setCheckoutForm(prev => ({
                            ...prev,
                            name: portalMemberData ? portalMemberData.name : '',
                            nif: portalMemberData ? portalMemberData.nif : '',
                          }));
                          setIsCheckoutOpen(true);
                        }}
                        className={`w-full py-3 text-xs font-bold rounded-xl tracking-wide uppercase text-center transition-colors cursor-pointer ${
                          isHighContrast
                            ? 'bg-yellow-400 text-black hover:bg-yellow-500 font-extrabold border-2 border-yellow-500'
                            : 'bg-[#0e5c94] text-white hover:bg-opacity-95'
                        }`}
                      >
                        Iniciar Reserva
                      </button>
                    </div>
                  );
                })()}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 7. CHECKOUT RESERVATION MODAL */}
      {isCheckoutOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div onClick={() => setIsCheckoutOpen(false)} className="absolute inset-0 bg-black/60 backdrop-blur-xs" />
          <div className={`relative max-w-lg w-full p-6 animate-in zoom-in-95 duration-150 ${
            isHighContrast
              ? 'border-2 border-yellow-500 bg-black text-yellow-400 rounded-none'
              : 'bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-xl'
          }`}>
            <h2 className="text-lg font-extrabold text-[#0b2c4c] dark:text-zinc-100 border-b pb-3 mb-4">
              Finalizar Reserva de Artigos
            </h2>

            <form onSubmit={async (e) => {
              e.preventDefault();
              setIsCheckoutSubmitting(true);
              setCheckoutError(null);

              const subtotal = cart.reduce((total, item) => total + (item.product.price * item.quantity), 0);
              const discount = isPortalLoggedIn ? subtotal * 0.1 : 0;
              const total = subtotal - discount;

              const payload: OrderSubmission = {
                name: checkoutForm.name,
                phone: checkoutForm.phone,
                email: checkoutForm.email,
                nif: checkoutForm.nif,
                deliveryType: checkoutForm.deliveryType,
                address: checkoutForm.deliveryType === 'delivery' ? checkoutForm.address : undefined,
                items: cart.map(i => ({ productId: i.product.id, quantity: i.quantity })),
                subtotal,
                discount,
                total,
                memberId: isPortalLoggedIn ? portalMemberId : undefined
              };

              try {
                const response = await fetch('/api/orders', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify(payload)
                });

                if (!response.ok) {
                  throw new Error('Falha ao submeter a reserva.');
                }

                const data = await response.json();
                setCheckoutSuccessData({
                  reservationCode: data.reservationCode,
                  subtotal,
                  discount,
                  total,
                  deliveryType: checkoutForm.deliveryType
                });
                setCart([]);
                setIsCheckoutOpen(false);
              } catch (err: any) {
                setCheckoutError(err.message || 'Erro de rede. Ligue para a secretaria da AANP.');
              } finally {
                setIsCheckoutSubmitting(false);
              }
            }} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold mb-1">Nome Completo *</label>
                  <input
                    type="text"
                    required
                    value={checkoutForm.name}
                    onChange={(e) => setCheckoutForm(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full p-2 border border-zinc-300 dark:border-zinc-700 rounded-lg text-xs bg-white dark:bg-zinc-800 text-zinc-850 dark:text-zinc-150"
                  />
                </div>
                <div>
                  <label className="block font-bold mb-1">Contacto Telefónico *</label>
                  <input
                    type="tel"
                    required
                    value={checkoutForm.phone}
                    onChange={(e) => setCheckoutForm(prev => ({ ...prev, phone: e.target.value }))}
                    className="w-full p-2 border border-zinc-300 dark:border-zinc-700 rounded-lg text-xs bg-white dark:bg-zinc-800 text-zinc-850 dark:text-zinc-150"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold mb-1">E-mail *</label>
                  <input
                    type="email"
                    required
                    value={checkoutForm.email}
                    onChange={(e) => setCheckoutForm(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full p-2 border border-zinc-300 dark:border-zinc-700 rounded-lg text-xs bg-white dark:bg-zinc-800 text-zinc-850 dark:text-zinc-150"
                  />
                </div>
                <div>
                  <label className="block font-bold mb-1">NIF (para faturação)</label>
                  <input
                    type="text"
                    value={checkoutForm.nif}
                    onChange={(e) => setCheckoutForm(prev => ({ ...prev, nif: e.target.value }))}
                    className="w-full p-2 border border-zinc-300 dark:border-zinc-700 rounded-lg text-xs bg-white dark:bg-zinc-800 text-zinc-850 dark:text-zinc-150"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold mb-1">Tipo de Entrega *</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setCheckoutForm(prev => ({ ...prev, deliveryType: 'pickup' }))}
                    className={`p-2.5 rounded-xl border flex items-center justify-center gap-1.5 font-bold cursor-pointer ${
                      checkoutForm.deliveryType === 'pickup'
                        ? 'border-[#0e5c94] bg-blue-50/20 text-[#0e5c94] dark:border-amber-400 dark:text-amber-400'
                        : 'border-zinc-250 dark:border-zinc-750 text-zinc-500'
                    }`}
                  >
                    <Store className="h-4 w-4" />
                    <span>Levantamento na Sede</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setCheckoutForm(prev => ({ ...prev, deliveryType: 'delivery' }))}
                    className={`p-2.5 rounded-xl border flex items-center justify-center gap-1.5 font-bold cursor-pointer ${
                      checkoutForm.deliveryType === 'delivery'
                        ? 'border-[#0e5c94] bg-blue-50/20 text-[#0e5c94] dark:border-amber-400 dark:text-amber-400'
                        : 'border-zinc-250 dark:border-zinc-750 text-zinc-500'
                    }`}
                  >
                    <Truck className="h-4 w-4" />
                    <span>Envio por Transportadora</span>
                  </button>
                </div>
              </div>

              {checkoutForm.deliveryType === 'delivery' && (
                <div className="animate-in slide-in-from-top-2 duration-150">
                  <label className="block font-bold mb-1">Morada Completa de Envio *</label>
                  <input
                    type="text"
                    required
                    value={checkoutForm.address}
                    onChange={(e) => setCheckoutForm(prev => ({ ...prev, address: e.target.value }))}
                    className="w-full p-2 border border-zinc-300 dark:border-zinc-700 rounded-lg text-xs bg-white dark:bg-zinc-800 text-zinc-850 dark:text-zinc-150"
                    placeholder="Rua, número, andar, código postal e localidade"
                  />
                </div>
              )}

              {checkoutError && (
                <div className="p-3 bg-red-150 text-red-700 font-bold rounded-xl text-xs">
                  {checkoutError}
                </div>
              )}

              <div className="flex justify-end gap-3 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setIsCheckoutOpen(false)}
                  className="px-4 py-2 border rounded-xl font-bold cursor-pointer text-xs"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isCheckoutSubmitting}
                  className={`px-6 py-2.5 font-bold rounded-xl cursor-pointer disabled:opacity-50 text-xs ${
                    isHighContrast ? 'bg-yellow-400 text-black border-2 border-yellow-500' : 'bg-[#0e5c94] text-white hover:bg-opacity-95'
                  }`}
                >
                  {isCheckoutSubmitting ? 'A registar...' : 'Confirmar Reserva'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 8. RESERVATION SUCCESS CONFIRMATION MODAL */}
      {checkoutSuccessData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div onClick={() => setCheckoutSuccessData(null)} className="absolute inset-0 bg-black/60 backdrop-blur-xs" />
          <div className={`relative max-w-md w-full p-6 animate-in zoom-in-95 duration-150 text-center ${
            isHighContrast
              ? 'border-2 border-yellow-500 bg-black text-yellow-400 rounded-none'
              : 'bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-xl'
          }`}>
            <CheckCircle2 className="h-12 w-12 text-green-500 mx-auto mb-3" />
            <h2 className="text-lg font-extrabold text-[#0b2c4c] dark:text-zinc-100">
              Reserva Efetuada com Sucesso!
            </h2>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 mb-4">
              A sua solicitação foi registada com sucesso na secretaria da AANP.
            </p>

            <div className="p-4 bg-zinc-50 dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-850 rounded-xl space-y-3 mb-6 text-xs text-left">
              <div className="flex justify-between items-center border-b pb-2 border-zinc-200 dark:border-zinc-800">
                <span className="text-zinc-400">Código de Reserva</span>
                <span className="font-mono font-black text-[#0e5c94] dark:text-amber-400 text-sm select-all">
                  {checkoutSuccessData.reservationCode}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-zinc-400">Total a Pagar</span>
                <span className="font-extrabold font-mono text-zinc-800 dark:text-zinc-100 text-sm">
                  {checkoutSuccessData.total.toFixed(2)}€
                </span>
              </div>
              <div className="text-[10px] text-zinc-500 leading-normal text-left pt-2">
                {checkoutSuccessData.deliveryType === 'pickup' ? (
                  <span>📍 Levante os seus artigos na sede da AANP em Porto. O pagamento poderá ser efetuado em numerário ou Multibanco no ato da recolha.</span>
                ) : (
                  <span>📦 Entraremos em contacto para o e-mail indicado com os dados para pagamento por transferência bancária (IBAN) e envio da encomenda.</span>
                )}
              </div>
            </div>

            <button
              onClick={() => setCheckoutSuccessData(null)}
              className={`w-full py-3 text-xs font-bold rounded-xl cursor-pointer ${
                isHighContrast ? 'bg-yellow-400 text-black border-2 border-yellow-500' : 'bg-[#0e5c94] text-white hover:bg-opacity-95'
              }`}
            >
              Fechar e Voltar à Loja
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
