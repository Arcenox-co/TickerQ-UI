<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="isVisible"
        class="fixed inset-0 z-[9999] flex items-end justify-center bg-black bg-opacity-50 backdrop-blur-sm sm:items-center"
        @click.self="handleBackdropClick"
      >
        <div
          class="w-full max-w-md transform rounded-t-2xl bg-white shadow-2xl transition-all duration-300 ease-out sm:rounded-2xl sm:border dark:bg-gray-900 dark:border-gray-700"
          @click.stop
        >
          <!-- Header -->
          <div class="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
            <div class="flex items-center space-x-3">
              <div class="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div>
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Help Us Improve TickerQ</h3>
                <p class="text-sm text-gray-600 dark:text-gray-400">Anonymous usage insights</p>
              </div>
            </div>
            <button
              @click="handleDecline"
              class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <!-- Content -->
          <div class="p-6">
            <div class="mb-6">
              <p class="text-gray-700 dark:text-gray-300 text-sm leading-relaxed mb-4">
                We'd love to understand how TickerQ is being used to help us improve the library. 
                This information is completely <strong>anonymous</strong> and optional.
              </p>
              <div class="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
                <p class="text-blue-800 dark:text-blue-200 text-xs">
                  This form uses localStorage to remember your preference and avoid showing this modal again.
                </p>
              </div>
            </div>

            <form @submit.prevent="handleSubmit" class="space-y-4">
              <!-- Usage Purpose -->
              <div>
                <label for="purpose" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  What are you using TickerQ for? <span class="text-red-500">*</span>
                </label>
                <select
                  id="purpose"
                  v-model="formData.purpose"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                >
                  <option value="">Select purpose...</option>
                  <option value="web-application">Web Application</option>
                  <option value="microservices">Microservices</option>
                  <option value="data-processing">Data Processing</option>
                  <option value="automation">Automation & Scripts</option>
                  <option value="background-jobs">Background Job Processing</option>
                  <option value="integration">System Integration</option>
                  <option value="learning">Learning/Educational</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <!-- Organization Type -->
              <div>
                <label for="orgType" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Organization Type <span class="text-red-500">*</span>
                </label>
                <select
                  id="orgType"
                  v-model="formData.organizationType"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                >
                  <option value="">Select type...</option>
                  <option value="startup">Startup</option>
                  <option value="small-business">Small Business</option>
                  <option value="medium-enterprise">Medium Enterprise</option>
                  <option value="large-enterprise">Large Enterprise</option>
                  <option value="freelancer">Freelancer/Consultant</option>
                  <option value="open-source">Open Source Project</option>
                  <option value="personal">Personal Project</option>
                  <option value="education">Educational Institution</option>
                </select>
              </div>

              <!-- Team Size -->
              <div>
                <label for="teamSize" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Development Team Size
                </label>
                <select
                  id="teamSize"
                  v-model="formData.teamSize"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                >
                  <option value="">Select size...</option>
                  <option value="1">Just me</option>
                  <option value="2-5">2-5 developers</option>
                  <option value="6-15">6-15 developers</option>
                  <option value="16-50">16-50 developers</option>
                  <option value="50+">50+ developers</option>
                </select>
              </div>

              <!-- Industry -->
              <div>
                <label for="industry" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Industry
                </label>
                <select
                  id="industry"
                  v-model="formData.industry"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                >
                  <option value="">Select industry...</option>
                  <option value="technology">Technology</option>
                  <option value="finance">Finance & Banking</option>
                  <option value="healthcare">Healthcare</option>
                  <option value="ecommerce">E-commerce</option>
                  <option value="gaming">Gaming</option>
                  <option value="education">Education</option>
                  <option value="media">Media & Entertainment</option>
                  <option value="manufacturing">Manufacturing</option>
                  <option value="logistics">Logistics & Supply Chain</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <!-- Comments -->
              <div>
                <label for="comments" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Additional Comments
                </label>
                <textarea
                  id="comments"
                  v-model="formData.comments"
                  rows="3"
                  placeholder="Any feedback, use cases, or suggestions..."
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none dark:bg-gray-800 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
                ></textarea>
              </div>

              <!-- Error Message -->
              <div v-if="error" class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
                <p class="text-red-800 dark:text-red-200 text-sm">{{ error }}</p>
              </div>

              <!-- Success Message -->
              <div v-if="isSubmitted" class="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-3">
                <p class="text-green-800 dark:text-green-200 text-sm">Thank you for your feedback! 🎉</p>
              </div>

              <!-- Actions -->
              <div class="flex space-x-3 pt-4">
                <button
                  type="submit"
                  :disabled="isSubmitting || isSubmitted"
                  class="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  <span v-if="isSubmitting">Submitting...</span>
                  <span v-else-if="isSubmitted">Submitted ✓</span>
                  <span v-else>Share Feedback</span>
                </button>
                <button
                  type="button"
                  @click="handleDecline"
                  class="px-4 py-2.5 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 font-medium transition-colors"
                >
                  Skip
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'

interface FormData {
  purpose: string
  organizationType: string
  teamSize: string
  industry: string
  comments: string
}

const isVisible = ref(false)
const isSubmitting = ref(false)
const isSubmitted = ref(false)
const error = ref('')

const formData = reactive<FormData>({
  purpose: '',
  organizationType: '',
  teamSize: '',
  industry: '',
  comments: ''
})

const STORAGE_KEY = 'tickerq-analytics-modal'
// TickerQ Analytics API endpoint
// Use environment variable in production, fallback to production API
const ANALYTICS_ENDPOINT = import.meta.env?.VITE_ANALYTICS_API_URL || 'https://api.arcenox.com/api/email/:send-analytics'

// Check if modal should be shown
const shouldShowModal = computed(() => {
  if (typeof window === 'undefined') return false
  
  const stored = localStorage.getItem(STORAGE_KEY)
  if (stored) {
    const data = JSON.parse(stored)
    return !data.dismissed && !data.submitted
  }
  return true
})

// Show modal on mount if needed
onMounted(() => {
  // Delay to ensure smooth page load
  setTimeout(() => {
    if (shouldShowModal.value) {
      isVisible.value = true
    }
  }, 2000) // Show after 2 seconds
})

const handleSubmit = async () => {
  if (!formData.purpose || !formData.organizationType) {
    error.value = 'Please fill in the required fields'
    return
  }

  isSubmitting.value = true
  error.value = ''

  try {
    // Prepare submission data to match API model
    const submissionData = {
      purpose: formData.purpose,
      organizationType: formData.organizationType,
      teamSize: formData.teamSize,
      industry: formData.industry,
      comments: formData.comments,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href
    }

    // Submit to analytics endpoint if configured
    if (ANALYTICS_ENDPOINT) {
      const response = await fetch(ANALYTICS_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submissionData)
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || 'Submission failed')
      }

      const responseData = await response.json()
      console.log('Analytics submission successful:', responseData)
    } else {
      // Fallback: log to console if no endpoint configured
      console.log('Analytics Data:', submissionData)
    }

    // Mark as submitted
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      submitted: true,
      timestamp: Date.now()
    }))

    isSubmitted.value = true
    
    // Close modal after 2 seconds
    setTimeout(() => {
      isVisible.value = false
    }, 1000)

  } catch (err) {
    error.value = 'Failed to submit. Please try again.'
    console.error('Submission error:', err)
  } finally {
    isSubmitting.value = false
  }
}

const handleDecline = () => {
  // Mark as dismissed
  localStorage.setItem(STORAGE_KEY, JSON.stringify({
    dismissed: true,
    timestamp: Date.now()
  }))
  
  isVisible.value = false
}

const handleBackdropClick = () => {
  // Don't close on backdrop click, require explicit action
}
</script>

<style scoped>
.modal-enter-active, .modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from, .modal-leave-to {
  opacity: 0;
}

.modal-enter-active .modal-content,
.modal-leave-active .modal-content {
  transition: transform 0.3s ease;
}

.modal-enter-from .modal-content,
.modal-leave-to .modal-content {
  transform: translateY(100%) scale(0.95);
}

@media (min-width: 640px) {
  .modal-enter-from .modal-content,
  .modal-leave-to .modal-content {
    transform: translateY(0) scale(0.95);
  }
}
</style>
