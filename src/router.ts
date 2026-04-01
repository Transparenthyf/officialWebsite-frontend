import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

import CompanyIntro from './views/CompanyIntro.vue'
import Products from './views/Products.vue'
import ContactUs from './views/ContactUs.vue'
import Admin from './views/Admin.vue'

const routes: RouteRecordRaw[] = [
  { path: '/', redirect: '/company' },
  { path: '/company', component: CompanyIntro },
  { path: '/products', component: Products },
  { path: '/contact', component: ContactUs },
  { path: '/admin', component: Admin },
]

export const router = createRouter({
  history: createWebHistory(),
  routes,
})

