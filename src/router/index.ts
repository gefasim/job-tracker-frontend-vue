import { CurrentUserService } from '@/current-user.service'
import AuthenticatedHome from '@/views/AuthenticatedHome.vue'
import GuestHome from '@/views/GuestHome.vue'
import JobApplicationModal from '@/views/JobApplication/JobApplicationModal.vue'
import JobBoard from '@/views/JobBoard.vue'
import LogIn from '@/views/LogIn.vue'
import UserBoards from '@/views/UserBoards.vue'
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/welcome',
      name: 'landing',
      component: GuestHome,
    },
    {
      path: '/login',
      name: 'login',
      component: LogIn,
    },
    {
      path: '/',
      component: AuthenticatedHome,
      beforeEnter: (to, from) => {
        const isLoggedIn = !!CurrentUserService.getUser()
        if (!isLoggedIn) return '/welcome'
      },
      children: [
        {
          path: '',
          name: 'dashboard',
          component: UserBoards,
        },
        {
          path: 'boards/:boardId',
          name: 'board',
          component: JobBoard,
          props: true,
          children: [
            {
              path: '/boards/:boardId/jobs/:jobId/',
              name: 'job-application',
              component: JobApplicationModal,
              props: true,
            },
          ],
        },
      ],
    },
  ],
})

export default router
