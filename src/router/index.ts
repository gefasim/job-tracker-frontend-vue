import AuthenticatedHome from '@/pages/AuthenticatedHome.vue'
import GuestHome from '@/pages/GuestHome.vue'
import GuestMain from '@/layouts/GuestLayout.vue'
import JobApplicationModal from '@/components/jobs/JobApplicationModal.vue'
import JobBoard from '@/pages/JobBoard.vue'
import LogIn from '@/pages/LogIn.vue'
import SignUp from '@/pages/SignUp.vue'
import VerifyEmail from '@/pages/VerifyEmail.vue'
import BoardDashboard from '@/pages/BoardDashboard.vue'
import ContactDashboard from '@/pages/ContactDashboard.vue'
import DocumentDashboard from '@/pages/DocumentDashboard.vue'
import AboutView from '@/pages/AboutView.vue'
import ContactUs from '@/pages/ContactUs.vue'
import HowTo from '@/pages/HowTo.vue'
import PersonalAccount from '@/pages/PersonalAccount.vue'
import ProfileTab from '@/pages/Account/ProfileTab.vue'
import SettingsTab from '@/pages/Account/SettingsTab.vue'
import NotificationsTab from '@/pages/Account/NotificationsTab.vue'
import { createRouter, createWebHistory } from 'vue-router'
import { useUser } from '@/stores/userStore'
import HomeLayout from '@/layouts/HomeLayout.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior(to, from, savedPosition) {
    if (to.hash) {
      return {
        el: to.hash,
        behavior: 'smooth',
      }
    } else if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0, behavior: 'smooth' }
    }
  },
  routes: [
    {
      path: '/',
      component: HomeLayout,
      children: [
        {
          path: '',
          name: 'home',
          redirect: () => {
            const { isAuthenticated } = useUser()
            return isAuthenticated.value ? { name: 'boards' } : { name: 'landing' }
          },
        },
        {
          path: 'landing',
          name: 'landing',
          component: GuestMain,
        },
        {
          path: 'about',
          name: 'guest-about',
          component: AboutView,
        },
        {
          path: 'contact-us',
          name: 'guest-contact-us',
          component: ContactUs,
        },
        {
          path: 'how-to',
          name: 'guest-how-to',
          component: HowTo,
        },
        {
          path: '/login',
          name: 'login',
          component: LogIn,
        },
        {
          path: '/signup',
          name: 'signup',
          component: SignUp,
        },
        {
          path: '/verify-email',
          name: 'verify-email',
          component: VerifyEmail,
        },

        /* Authenticated routes */
        {
          path: 'boards',
          name: 'boards',
          component: BoardDashboard,
        },
        {
          path: 'contacts',
          name: 'contacts',
          component: ContactDashboard,
        },
        {
          path: 'documents',
          name: 'documents',
          component: DocumentDashboard,
        },
        {
          path: 'account',
          component: PersonalAccount,
          redirect: { name: 'account-profile' },
          children: [
            {
              path: 'profile',
              name: 'account-profile',
              component: ProfileTab,
            },
            {
              path: 'settings',
              name: 'account-settings',
              component: SettingsTab,
            },
            {
              path: 'notifications',
              name: 'account-notifications',
              component: NotificationsTab,
            },
          ],
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

router.beforeEach((to, from) => {
  const { isAuthenticated } = useUser()

  if (to.name === 'landing' && isAuthenticated.value) {
    return { name: 'boards' }
  }

  if (to.name === 'boards' && !isAuthenticated.value) {
    return { name: 'landing' }
  }
})

export default router
