/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface AccessibilitySettings {
  fontSize: 'normal' | 'large' | 'extra-large';
  contrast: 'normal' | 'high' | 'dark';
  lineSpacing: 'normal' | 'wide';
  dyslexicFont: boolean;
  ttsEnabled: boolean;
}

export interface FacebookPost {
  id: string;
  content: string;
  date: string;
  likes: number;
  commentsCount: number;
  shares: number;
  imageUrl?: string;
  link: string;
}

export interface ContactInquiry {
  name: string;
  email: string;
  phone: string;
  nif?: string;
  beekeepingRegister?: string;
  subject: string;
  message: string;
}

export interface ServiceDetail {
  id: string;
  title: string;
  shortDesc: string;
  fullDesc: string;
  iconName: string;
  importantDates?: string;
}

export interface Product {
  id: string;
  name: string;
  category: 'mel-e-derivados' | 'cosmetica' | 'produtos-apicolas';
  price: number;
  weightOrDetail: string;
  description: string;
  imageUrl: string;
  stockStatus: 'em-stock' | 'poucas-unidades' | 'indisponivel';
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface OrderSubmission {
  name: string;
  phone: string;
  email: string;
  nif?: string;
  deliveryType: 'pickup' | 'delivery';
  address?: string;
  items: { productId: string; quantity: number }[];
  subtotal: number;
  discount: number;
  total: number;
  memberId?: string;
}

export interface MemberReceipt {
  id: string;
  name: string;
  date: string;
  amount: number;
  fileUrl: string;
}

export interface MemberQuota {
  year: number;
  paid: boolean;
  expiryDate: string;
  paymentDate?: string;
}

export interface PortalMember {
  name: string;
  nif: string;
  memberId: string;
  joinDate: string;
  hivesCount: number;
  apiariesCount: number;
  status: string;
  pasJoined: string;
  lastSanitaryInspection: string;
  nextTreatmentDate: string;
  quotas: MemberQuota[];
  receipts: MemberReceipt[];
}


