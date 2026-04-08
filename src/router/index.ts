import AuthenticatedHome from '@/views/HomeDashboard/AuthenticatedHome.vue'
import GuestHome from '@/views/GuestHome.vue'
import JobApplicationModal from '@/views/JobApplication/JobApplicationModal.vue'
import JobBoard from '@/views/HomeDashboard/JobBoard.vue'
import LogIn from '@/views/LogIn.vue'
import SignUp from '@/views/SignUp.vue'
import VerifyEmail from '@/views/VerifyEmail.vue'
import BoardDashboard from '@/views/HomeDashboard/BoardDashboard.vue'
import ContactDashboard from '@/views/HomeDashboard/ContactDashboard.vue'
import DocumentDashboard from '@/views/HomeDashboard/DocumentDashboard.vue'
import AboutView from '@/views/HomeDashboard/AboutView.vue'
import ContactUs from '@/views/HomeDashboard/ContactUs.vue'
import HowTo from '@/views/HomeDashboard/HowTo.vue'
import PersonalAccount from '@/views/HomeDashboard/PersonalAccount.vue'
import ProfileTab from '@/views/HomeDashboard/Account/ProfileTab.vue'
import SettingsTab from '@/views/HomeDashboard/Account/SettingsTab.vue'
import NotificationsTab from '@/views/HomeDashboard/Account/NotificationsTab.vue'
import { createRouter, createWebHistory } from 'vue-router'
import { useUser } from '@/store/userStore'

const { isAuthenticated } = useUser()

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
      path: '/signup',
      name: 'signup',
      component: SignUp,
    },
    {
      path: '/verify-email',
      name: 'verify-email',
      component: VerifyEmail,
    },
    {
      path: '/',
      component: AuthenticatedHome,
      beforeEnter: (to, from) => {
        if (!isAuthenticated.value) return '/welcome'
      },
      children: [
        {
          path: '',
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
