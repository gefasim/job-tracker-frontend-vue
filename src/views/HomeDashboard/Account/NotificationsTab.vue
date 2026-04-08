<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { api } from '@/api/api'
import type {
  NotificationReport,
  DailyNotification,
  WeeklyNotification,
} from '@/models/notification.dto'

const isLoading = ref(true)
const isSaving = ref(false)

const dailyEnabled = ref(false)
const weeklyEnabled = ref(false)

const dailyData = ref<DailyNotification>({
  time: '12:00',
  timezoneOffset: new Date().getTimezoneOffset(),
})

const weeklyData = ref<WeeklyNotification>({
  dayOfWeek: 'SUNDAY',
  time: '12:00',
  timezoneOffset: new Date().getTimezoneOffset(),
})

const daysOfWeek = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY']

// Generate timezone offsets (e.g., UTC-12:00 to UTC+14:00)
const timezones = Array.from({ length: 27 }, (_, i) => {
  const hours = i - 12
  const sign = hours >= 0 ? '+' : '-'
  const absHours = Math.abs(hours).toString().padStart(2, '0')
  return {
    label: `UTC${sign}${absHours}:00`,
    value: -hours * 60, // JavaScript getTimezoneOffset() is minutes behind UTC
  }
})

onMounted(async () => {
  try {
    const report = await api.notifications.getReport()
    if (report.daily) {
      dailyEnabled.value = true
      dailyData.value = report.daily
    }
    if (report.weekly) {
      weeklyEnabled.value = true
      weeklyData.value = report.weekly
    }
  } catch (err) {
    // If not found or error, we just leave it with defaults
    console.error('Failed to load notifications', err)
  } finally {
    isLoading.value = false
  }
})

const saveChanges = async () => {
  try {
    isSaving.value = true
    const payload: NotificationReport = {
      daily: dailyEnabled.value ? dailyData.value : null,
      weekly: weeklyEnabled.value ? weeklyData.value : null,
    }
    await api.notifications.saveReport(payload)
  } catch (err) {
    console.error('Failed to save notifications', err)
  } finally {
    isSaving.value = false
  }
}
</script>

<template>
  <div class="notifications-tab tab-border">
    <div class="header">
      <h2>Report Notifications</h2>
      <p class="subtitle">
        Configure when you want to receive summary reports for your job tracking pipeline.
      </p>
    </div>

    <div v-if="isLoading" class="loading">Loading settings...</div>

    <div v-else class="content">
      <!-- Daily Notifications -->
      <div class="notification-card">
        <div class="card-header">
          <div class="toggle-group">
            <label class="switch">
              <input type="checkbox" v-model="dailyEnabled" />
              <span class="slider round"></span>
            </label>
            <h3>Daily Report</h3>
          </div>
          <p>Receive a daily summary of your job application activity.</p>
        </div>

        <div v-if="dailyEnabled" class="card-body form-grid">
          <div class="input-group">
            <label>Time</label>
            <input type="time" v-model="dailyData.time" />
          </div>
          <div class="input-group">
            <label>Timezone</label>
            <select v-model="dailyData.timezoneOffset">
              <option v-for="tz in timezones" :key="tz.value" :value="tz.value">
                {{ tz.label }}
              </option>
            </select>
          </div>
        </div>
      </div>

      <!-- Weekly Notifications -->
      <div class="notification-card">
        <div class="card-header">
          <div class="toggle-group">
            <label class="switch">
              <input type="checkbox" v-model="weeklyEnabled" />
              <span class="slider round"></span>
            </label>
            <h3>Weekly Report</h3>
          </div>
          <p>Receive a weekly overview of your job application progress.</p>
        </div>

        <div v-if="weeklyEnabled" class="card-body form-grid">
          <div class="input-group">
            <label>Day of Week</label>
            <select v-model="weeklyData.dayOfWeek">
              <option v-for="day in daysOfWeek" :key="day" :value="day">
                {{ day }}
              </option>
            </select>
          </div>
          <div class="input-group">
            <label>Time</label>
            <input type="time" v-model="weeklyData.time" />
          </div>
          <div class="input-group">
            <label>Timezone</label>
            <select v-model="weeklyData.timezoneOffset">
              <option v-for="tz in timezones" :key="tz.value" :value="tz.value">
                {{ tz.label }}
              </option>
            </select>
          </div>
        </div>
      </div>

      <div class="form-actions">
        <button class="btn-primary" @click="saveChanges" :disabled="isSaving">
          {{ isSaving ? 'Saving...' : 'Save Settings' }}
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.header {
  margin-bottom: 24px;
}

.header h2 {
  font-size: 20px;
  font-weight: 600;
  margin: 0 0 8px 0;
}

.subtitle {
  font-size: 14px;
  margin: 0;
}

.loading {
  padding: 32px 0;
}

.notification-card {
  border: 1px solid var(--border-color);
  border-radius: 8px;
  padding: 24px;
  margin-bottom: 24px;
  background-color: var(--bg-primary);
}

.card-header .toggle-group {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 8px;
}

.card-header h3 {
  font-size: 16px;
  font-weight: 600;
  margin: 0;
}

.card-header p {
  font-size: 14px;
  margin: 0 0 16px 0;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  padding-top: 16px;
  border-top: 1px solid var(--border-color);
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 32px;
}

/* Toggle Switch Styles */
.switch {
  position: relative;
  display: inline-block;
  width: 40px;
  height: 24px;
}

.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: var(--border-color);
  transition: 0.4s;
}

.slider:before {
  position: absolute;
  content: '';
  height: 16px;
  width: 16px;
  left: 4px;
  bottom: 4px;
  background-color: white;
  transition: 0.4s;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
}

input:checked + .slider {
  background-color: #1a73e8; /* Standard Google Blue used in btn-primary */
}

input:checked + .slider:before {
  transform: translateX(16px);
}

.slider.round {
  border-radius: 24px;
}

.slider.round:before {
  border-radius: 50%;
}
</style>
