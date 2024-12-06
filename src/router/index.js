import { createRouter, createWebHistory } from 'vue-router'
import MainPage from '@/views/MainPage.vue'
import MarketPage from '@/views/MarketPage.vue'
import PortfolioPage from '@/views/PortfolioPage.vue'
import RankingPage from '@/views/RankingPage.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: MainPage
  },
  {
    path: '/market',
    name: 'Market',
    component: MarketPage
  },
  {
    path: '/portfolio',
    name: 'Portfolio',
    component: PortfolioPage
  },
  {
    path: '/ranking',
    name: 'Ranking',
    component: RankingPage
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router 