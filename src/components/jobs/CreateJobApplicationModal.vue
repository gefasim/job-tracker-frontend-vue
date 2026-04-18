<script setup lang="ts">
import { ref } from 'vue'
import BaseModalWrapper from '@/components/common/BaseModalWrapper.vue'
import type { Board } from '@/types/dtos/board.dto'
import type { BoardColumn } from '@/types/dtos/board-column.dto'
import CompanySelectDropdown from '@/components/common/CompanySelectDropdown.vue'
import type { Company } from '@/types/dtos/company.dto'
import { api } from '@/services/api'
import type { CreateJobApplication } from '@/types/dtos/create-job-application.dto'
import GenericSelector from '@/components/common/GenericSelector.vue'
import { useBoards } from '@/stores/boardStore'

const props = defineProps<{
  boardId: string
  columnId?: string
}>()

const emit = defineEmits(['close', 'save'])

const { activeBoards } = useBoards()

const jobTitle = ref<string>('')
let selectedCompany: Company | null = null
const selectedBoard = ref<Board>(activeBoards.value.filter((b) => b.id == props.boardId)[0]!)
const selectedColumn = ref<BoardColumn>(selectedBoard.value.columns.filter((c) => c.name)[0]!)

const handleCompanySelect = (company: Company) => {
  selectedCompany = company
}

const handleBoardSelect = (board: Board) => {
  selectedBoard.value = board
  selectedColumn.value = selectedBoard.value.columns[0]!
}

const handleColumnSelect = (column: BoardColumn) => {
  selectedColumn.value = column
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
            <GenericSelector
              :items="activeBoards"
              :selected-item="selectedBoard"
              label="Select Board:"
              display-property="name"
              value-property="id"
              id="create-job-board-select"
              :hideLabel="true"
              @update:selected-item="handleBoardSelect"
            />
          </div>
          <div class="input-group">
            <label>Column</label>
            <GenericSelector
              :items="selectedBoard.columns"
              :selected-item="selectedColumn"
              label="Select Column:"
              display-property="name"
              value-property="id"
              id="create-job-column-select"
              :hideLabel="true"
              @update:selected-item="handleColumnSelect"
            ></GenericSelector>
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
