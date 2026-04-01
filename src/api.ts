import axios from 'axios'

const API_BASE =
  (import.meta.env.VITE_API_BASE as string | undefined) ||
  (typeof window !== 'undefined' ? window.location.origin : 'https://fyjrhb.transparent.yun')

export type MediaType = 'image' | 'video'

export type SiteConfig = {
  companyName: string
  companyIntro: string
  contactText: string
  contactPhone: string
  contactEmail: string
  contactAddress: string
  heroImageUrl: string | null
  promoVideoUrl: string | null
}

export type Product = {
  id: number
  title: string
  description: string
  coverUrl: string | null
  mediaType: MediaType
  mediaUrl: string | null
  sortOrder: number
}

export type ContactLeadCreate = {
  name: string
  phone: string
  wechat?: string
  email?: string
  message?: string
}

const http = axios.create({
  baseURL: API_BASE,
  timeout: 15000,
})

export async function getPublicSite(): Promise<SiteConfig> {
  const { data } = await http.get('/api/public/site')
  return data
}

export async function getPublicProducts(): Promise<Product[]> {
  const { data } = await http.get('/api/public/products')
  return data
}

export async function createPublicLead(payload: ContactLeadCreate): Promise<{ ok: true }> {
  const { data } = await http.post('/api/public/leads', payload)
  return data
}

export async function getAdminSite(): Promise<SiteConfig> {
  const { data } = await http.get('/api/admin/site')
  return data
}

export async function updateAdminSite(payload: SiteConfig): Promise<{ ok: true }> {
  const { data } = await http.put('/api/admin/site', payload)
  return data
}

export async function getAdminProducts(): Promise<Product[]> {
  const { data } = await http.get('/api/admin/products')
  return data
}

export async function upsertAdminProduct(payload: Omit<Product, 'id'> & { id?: number }): Promise<Product> {
  const { data } = await http.post('/api/admin/products', payload)
  return data
}

export async function deleteAdminProduct(id: number): Promise<{ ok: true }> {
  const { data } = await http.delete(`/api/admin/products/${id}`)
  return data
}

export async function uploadAdminMedia(file: File): Promise<{ url: string; mediaType: MediaType }> {
  const form = new FormData()
  form.append('file', file)
  const { data } = await http.post('/api/admin/upload', form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return data
}

