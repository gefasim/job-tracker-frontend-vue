<script setup lang="ts">
import type { Board } from '@/models/board.dto'
import { useBoards } from '@/store/boardStore'
import { useNavbarFilter } from '@/store/navbarFilterStore'
import { computed, onMounted, watch, ref } from 'vue'
import GenericSelector from '../Shared/GenericSelector.vue'
import { useRoute, useRouter } from 'vue-router'
import ContactNavTabIcon from '@/assets/icons/ContactNavTabIcon.vue'
import DocumentNavTabIcon from '@/assets/icons/DocumentNavTabIcon.vue'
import BoardIcon from '@/assets/icons/BoardIcon.vue'
import BaseButtonDropdown from '../Shared/BaseButtonDropdown.vue'
import CreateBoardModal from './Board/CreateBoardModal.vue'
import CreateJobApplicationModal from '@/views/JobApplication/CreateJobApplicationModal.vue'
import ContactModal from '@/views/JobApplication/ContactsTab/ContactModal.vue'
import DocumentModal from '@/views/JobApplication/DocumentsTab/DocumentModal.vue'

const { textFilter, selectedBoard } = useNavbarFilter()
const { boards } = useBoards()
const route = useRoute()
const router = useRouter()
const availableBoards = computed(() => boards.value.filter((b) => !b.isArchived))

const isCreateBoardModalOpen = ref(false)
const isCreateJobModalOpen = ref(false)
const isContactModalOpen = ref(false)
const isDocumentModalOpen = ref(false)

const setSelectBoardDropdownValue = () => {
  if (availableBoards.value.length == 0) return
  const isBoardChangedOusideBoardSelector =
    route.params.boardId && selectedBoard.value?.id !== route.params.boardId
  if (isBoardChangedOusideBoardSelector) {
    const found = availableBoards.value.find((b) => b.id === route.params.boardId)
    selectedBoard.value = found || availableBoards.value[0]!
  } else if (selectedBoard.value == null) {
    selectedBoard.value = availableBoards.value[0]!
  }
}

onMounted(async () => {
  setSelectBoardDropdownValue()
})

watch(
  () => route.params.boardId,
  async () => {
    if (!route.params.boardId) return
    setSelectBoardDropdownValue()
  },
)

const linkToSelectedBoard = computed(() => {
  return selectedBoard.value
    ? { name: 'board', params: { boardId: selectedBoard.value?.id } }
    : { name: 'boards' }
})

const onBoardChange = async (board: Board) => {
  selectedBoard.value = board
  // Redirects to another board page if user is currently on a board page
  if (route.params.boardId) {
    router.push({ name: 'board', params: { boardId: board.id } })
  }
}

const onCreate = (item: string) => {
  if (item === 'Board') {
    isCreateBoardModalOpen.value = true
  } else if (item === 'Job') {
    isCreateJobModalOpen.value = true
  } else if (item === 'Contact') {
    isContactModalOpen.value = true
  } else if (item === 'Document') {
    isDocumentModalOpen.value = true
  }
}

const onBoardCreated = async (board: Board) => {
  selectedBoard.value = board
  isCreateBoardModalOpen.value = false
  router.push({ name: 'board', params: { boardId: board.id } })
}
</script>
<template>
  <nav class="top-navbar">
    <div class="nav-menu">
      <GenericSelector
        :items="availableBoards"
        :selected-item="selectedBoard"
        label="Select Board:"
        display-property="name"
        value-property="id"
        id="board-select"
        :hideLabel="true"
        @update:selected-item="onBoardChange"
      />
      <input v-model="textFilter" type="text" placeholder="Search..." />
    </div>
    <div class="nav-menu">
      <RouterLink :to="linkToSelectedBoard" class="sidebar-item" active-class="active">
        <BoardIcon /> Board
      </RouterLink>
      <RouterLink to="/contacts" class="sidebar-item" active-class="active">
        <ContactNavTabIcon /> Contacts
      </RouterLink>
      <RouterLink to="/documents" class="sidebar-item" active-class="active">
        <DocumentNavTabIcon /> Documents
      </RouterLink>
    </div>
    <div class="nav-menu">
      <BaseButtonDropdown :items="['Board', 'Job', 'Contact', 'Document']" @select="onCreate">
        <template #buttonValue>Create new</template>
        <template #item="{ item }">{{ item }}</template>
      </BaseButtonDropdown>
    </div>
  </nav>
  <Teleport to="body">
    <CreateBoardModal
      v-if="isCreateBoardModalOpen"
      @close="isCreateBoardModalOpen = false"
      @save="onBoardCreated"
    />
    <CreateJobApplicationModal
      v-if="isCreateJobModalOpen && selectedBoard"
      :boardId="selectedBoard.id"
      :boards="boards"
      @close="isCreateJobModalOpen = false"
      @save="isCreateJobModalOpen = false"
    />
    <ContactModal
      v-if="isContactModalOpen && selectedBoard"
      :contact="null"
      :jobApplication="null"
      :boardId="selectedBoard.id"
      @close="isContactModalOpen = false"
      @save="isContactModalOpen = false"
    />
    <DocumentModal
      v-if="isDocumentModalOpen && selectedBoard"
      :document="null"
      :boardId="selectedBoard.id"
      @close="isDocumentModalOpen = false"
      @save="isDocumentModalOpen = false"
    />
  </Teleport>
</template>
<style scoped>
.top-navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 1rem;
  border-bottom: 1px solid var(--border-color);
}
.nav-menu {
  display: flex;
  align-items: center;
  gap: 1rem;
}
</style>
