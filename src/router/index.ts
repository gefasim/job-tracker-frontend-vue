import { CurrentUserService } from '@/current-user.service'
import AuthenticatedHome from '@/views/AuthenticatedHome.vue'
import GuestHome from '@/views/GuestHome.vue'
import JobApplicationModal from '@/views/JobApplication/JobApplicationModal.vue'
import JobBoard from '@/views/JobBoard.vue'
import LogIn from '@/views/LogIn.vue'
import UserBoards from '@/views/UserBoards.vue'
import ContactsView from '@/views/ContactsView.vue'
import DocumentsView from '@/views/DocumentsView.vue'
import AboutView from '@/views/AboutView.vue'
import ContactUs from '@/views/ContactUs.vue'
import HowTo from '@/views/HowTo.vue'
import PersonalAccount from '@/views/PersonalAccount.vue'
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
          path: 'contacts',
          name: 'contacts',
          component: ContactsView,
        },
        {
          path: 'documents',
          name: 'documents',
          component: DocumentsView,
        },
        {
          path: 'about',
          name: 'about',
          component: AboutView,
        },
        {
          path: 'contact-us',
          name: 'contact-us',
          component: ContactUs,
        },
        {
          path: 'how-to',
          name: 'how-to',
          component: HowTo,
        },
        {
          path: 'personal-account',
          name: 'personal-account',
          component: PersonalAccount,
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
