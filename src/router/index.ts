import JobApplicationModal from '@/components/jobs/JobApplicationModal.vue'
import JobBoard from '@/pages/JobBoard.vue'
import LogIn from '@/pages/auth/LogIn.vue'
import SignUp from '@/pages/auth/SignUp.vue'
import ForgotPassword from '@/pages/auth/ForgotPassword.vue'
import VerifyEmail from '@/pages/auth/VerifyEmail.vue'
import ContactDashboard from '@/pages/dashboards/ContactDashboard.vue'
import DocumentDashboard from '@/pages/dashboards/DocumentDashboard.vue'
import AboutView from '@/pages/help/AboutView.vue'
import ContactUs from '@/pages/help/ContactUs.vue'
import HowTo from '@/pages/help/HowTo.vue'
import PersonalAccount from '@/pages/account/PersonalAccount.vue'
import ProfileTab from '@/pages/account/ProfileTab.vue'
import SettingsTab from '@/pages/account/SettingsTab.vue'
import NotificationsTab from '@/pages/account/NotificationsTab.vue'
import { createRouter, createWebHistory } from 'vue-router'
import HomePageProxy from '@/pages/HomePageProxy.vue'
import HomeLayoutProxy from '@/layouts/HomeLayoutProxy.vue'

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
      component: HomeLayoutProxy,
      children: [
        {
          path: '',
          name: 'home',
          component: HomePageProxy,
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
          path: '/forgot-password',
          name: 'forgot-password',
          component: ForgotPassword,
        },
        {
          path: '/verify-email',
          name: 'verify-email',
          component: VerifyEmail,
        },

        /* Authenticated routes */
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

export default router
