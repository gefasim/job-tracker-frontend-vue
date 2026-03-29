<script setup lang="ts">
import { computed, ref } from 'vue'
import BaseModalWrapper from '../Shared/BaseModalWrapper.vue'
import DropdownList from '../Shared/DropdownList.vue'
import type { Board } from '@/models/board.dto'
import type { BoardColumn } from '@/models/board-column.dto'
import CompanySelectDropdown from '../Shared/CompanySelectDropdown.vue'
import type { Company } from '@/models/company.dto'
import { api } from '@/api/api'
import type { CreateJobApplication } from '@/models/create-job-application.dto'

const props = defineProps<{
  boardId: string
  columnId?: string
  boards: Board[]
}>()

const emit = defineEmits(['close', 'save'])

let selectedCompany: Company | null = null
const jobTitle = ref<string>('')
const selectedBoard = ref<Board>(props.boards.filter((b) => b.id == props.boardId)[0]!)
const selectedColumn = ref<BoardColumn>(selectedBoard.value.columns.filter((c) => c.name)[0]!)
const boardNames = computed(() => props.boards.map((b) => b.name))
const columnNames = computed(() => selectedBoard.value!.columns.map((c) => c.name))

const handleCompanySelect = (company: Company) => {
  selectedCompany = company
}

const handleBoardSelect = (boardName: string) => {
  selectedBoard.value = props.boards.filter((b) => b.name == boardName)[0]!
  selectedColumn.value = selectedBoard.value.columns[0]!
}

const handleColumnSelect = (columnName: string) => {
  selectedColumn.value = selectedBoard.value!.columns.filter((c) => c.name == columnName)[0]!
}

const handleSave = async () => {
  const company = await getOrCreateCompany(selectedCompany!)
  const createDto = {
    title: jobTitle.value,
    columnId: selectedColumn.value.id,
    companyId: company!.id,
  } as CreateJobApplication
  const job = await api.jobs.create(createDto)
  emit('save', job)
}

async function getOrCreateCompany(company: Company) {
  // TODO: replace with strict check
  const existingCompany = await api.companies.getByNameStartsWith(selectedCompany!.name)
  if (existingCompany.length >= 1) return existingCompany[0]
  return await api.companies.create(company)
}
</script>
<template>
  <BaseModalWrapper title="Create Job" @save="handleSave" @close="emit('close')">
    <template #body>
      <div class="modal-form">
        <CompanySelectDropdown @select="handleCompanySelect"></CompanySelectDropdown>
        <div class="input-group">
          <label>Job Title</label>
          <input v-model="jobTitle" placeholder="i.e: CEO" />
        </div>
        <div class="modal-row">
          <div class="input-group">
            <label>Board</label>
            <DropdownList
              :list="boardNames"
              :default-value="selectedBoard.name"
              :show-list-above="true"
              @select="handleBoardSelect"
            ></DropdownList>
          </div>
          <div class="input-group">
            <label>Column</label>
            <DropdownList
              :list="columnNames"
              :default-value="selectedColumn.name"
              :show-list-above="true"
              @select="handleColumnSelect"
            ></DropdownList>
          </div>
        </div>
      </div>
    </template>
  </BaseModalWrapper>
</template>
<style scoped>
.modal-form {
  display: flex;
  flex-direction: column;
  width: stretch;
  gap: 20px;
}
.modal-row {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  gap: 20px;
}
</style>
