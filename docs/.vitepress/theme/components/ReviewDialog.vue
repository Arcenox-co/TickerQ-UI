<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="open" class="modal-overlay" @click="closeDialog">
        <div class="modal-container" @click.stop>
          <div class="modal-header">
            <div class="header-content">
              <h2 v-if="currentStep === 1">Help Us Improve TickerQ</h2>
              <h2 v-else-if="currentStep === 2">Rate Your Experience</h2>
              <h2 v-else>Thank You!</h2>
            </div>
            <button 
              class="close-button"
              @click="closeDialog"
              aria-label="Close dialog"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              </svg>
            </button>
          </div>
          
          <div class="modal-body">
            <!-- Step 1: Analytics Form -->
            <div v-if="currentStep === 1" class="step-content">
              <div class="step-description">
                <p>Help us understand how TickerQ is being used to improve our library (optional & anonymous)</p>
              </div>
              
              <div class="analytics-form">
                <div class="form-row">
                  <label class="form-label">
                    What are you using TickerQ for? <span class="required">*</span>
                  </label>
                  <select 
                    v-model="analyticsData.purpose" 
                    class="form-select"
                    :class="{ 
                      'error': validationErrors.purpose,
                      'success': analyticsData.purpose && !validationErrors.purpose
                    }"
                    @change="validationErrors.purpose = ''"
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
                  <div v-if="validationErrors.purpose" class="error-message">
                    {{ validationErrors.purpose }}
                  </div>
                </div>

                <div class="form-row">
                  <label class="form-label">
                    Organization Type <span class="required">*</span>
                  </label>
                  <select 
                    v-model="analyticsData.organizationType" 
                    class="form-select"
                    :class="{ 
                      'error': validationErrors.organizationType,
                      'success': analyticsData.organizationType && !validationErrors.organizationType
                    }"
                    @change="validationErrors.organizationType = ''"
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
                  <div v-if="validationErrors.organizationType" class="error-message">
                    {{ validationErrors.organizationType }}
                  </div>
                </div>

                <div class="form-row-group">
                  <div class="form-row">
                    <label class="form-label">Team Size</label>
                    <select v-model="analyticsData.teamSize" class="form-select">
                      <option value="">Select size...</option>
                      <option value="1">Just me</option>
                      <option value="2-5">2-5 developers</option>
                      <option value="6-15">6-15 developers</option>
                      <option value="16-50">16-50 developers</option>
                      <option value="50+">50+ developers</option>
                    </select>
                  </div>

                  <div class="form-row">
                    <label class="form-label">Industry</label>
                    <select v-model="analyticsData.industry" class="form-select">
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
                </div>


              </div>

              <div class="step-actions">
                <button 
                  class="primary-btn"
                  @click="completeAnalyticsStep"
                  :disabled="!isAnalyticsValid"
                  :class="{ 'pulse': isAnalyticsValid }"
                >
                  Next
                </button>
              </div>
            </div>

            <!-- Step 2: Rating -->
            <div v-if="currentStep === 2" class="step-content">
              <div class="rating-section">
                <h3>How would you rate TickerQ?</h3>
                <div class="stars" :class="{ 'error': validationErrors.rating }">
                  <button
                    v-for="star in 5"
                    :key="star"
                    class="star"
                    :class="{ active: star <= rating }"
                    @click="setRating(star)"
                    @mouseover="hoverRating = star"
                    @mouseleave="hoverRating = 0"
                  >
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path 
                        d="M12 17.27L18.18 21L16.54 13.97L22 9.24L14.81 8.63L12 2L9.19 8.63L2 9.24L7.46 13.97L5.82 21L12 17.27Z" 
                        :fill="(star <= (hoverRating || rating)) ? 'currentColor' : 'none'"
                        :stroke="(star <= (hoverRating || rating)) ? 'currentColor' : 'currentColor'"
                        stroke-width="1"
                      />
                    </svg>
                  </button>
                </div>
                <p class="rating-text">{{ getRatingText() }}</p>
                <div v-if="validationErrors.rating" class="error-message">
                  {{ validationErrors.rating }}
                </div>
              </div>

              <div v-if="rating > 0" class="review-section">
                <h3>Tell us what you think (optional)</h3>
                <textarea
                  v-model="reviewText"
                  placeholder="Share your experience with TickerQ..."
                  rows="4"
                  class="review-textarea"
                ></textarea>
              </div>

              <div class="step-actions">
                <button 
                  v-if="currentStep > 1"
                  class="secondary-btn"
                  @click="prevStep"
                >
                  Back
                </button>
                <button 
                  class="primary-btn"
                  @click="submitReview"
                  :disabled="submitting || !isRatingValid"
                  :class="{ 'pulse': isRatingValid && !submitting }"
                >
                  {{ submitting ? 'Submitting...' : 'Next' }}
                </button>
              </div>
            </div>

            <!-- Step 3: Success -->
            <div v-if="currentStep === 3" class="step-content success-content">
              <div class="success-icon">
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="12" cy="12" r="10" fill="var(--vp-c-brand)" />
                  <path d="M9 12L11 14L15 10" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </div>
              
              <h3>Thank you for your feedback!</h3>
              <p>Your review helps us improve TickerQ for everyone.</p>
              
              <div class="github-star-section">
                <h4>Love TickerQ? Give us a star on GitHub!</h4>
                <p>Help others discover this library</p>
                <a 
                  href="https://github.com/Arcenox-co/TickerQ"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="github-star-btn"
                  @click="trackPlatformClick('github', 'https://github.com/Arcenox-co/TickerQ')"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0C5.374 0 0 5.373 0 12 0 17.302 3.438 21.8 8.207 23.387c.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
                  </svg>
                  Star on GitHub
                </a>
              </div>

              <div class="step-actions">
                <button 
                  class="primary-btn"
                  @click="closeDialog"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, watch, reactive, computed } from 'vue'

interface Props {
  open: boolean
}

interface Emits {
  (e: 'update:open', value: boolean): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const rating = ref(0)
const hoverRating = ref(0)
const reviewText = ref('')
const submitting = ref(false)
const dialogStartTime = ref(0)
const hasStartedTyping = ref(false)

// Step system
const currentStep = ref(1)
const totalSteps = 3

// Analytics form data
const analyticsData = reactive({
  purpose: '',
  organizationType: '',
  teamSize: '',
  industry: ''
})

const analyticsSubmitted = ref(false)

// Validation states
const validationErrors = reactive({
  purpose: '',
  organizationType: '',
  rating: ''
})

const isAnalyticsValid = computed(() => {
  return analyticsData.purpose && analyticsData.organizationType
})

const isRatingValid = computed(() => {
  return rating.value > 0
})

const ANALYTICS_STORAGE_KEY = 'tickerq-analytics-modal'
const ANALYTICS_ENDPOINT = import.meta.env?.VITE_ANALYTICS_API_URL || 'https://api.arcenox.com/api/email/:send-analytics'

// Analytics tracking function
const trackEvent = (eventName: string, parameters: Record<string, any> = {}) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, {
      event_category: 'Review_Dialog',
      ...parameters
    })
  }
}



// Track dialog open/close
watch(() => props.open, (newValue) => {
  if (newValue) {
    dialogStartTime.value = Date.now()
    hasStartedTyping.value = false
    // Always start from step 1 since we removed the skip option
    currentStep.value = 1
    trackEvent('review_dialog_viewed', {
      timestamp: new Date().toISOString(),
      initial_step: currentStep.value
    })
  } else if (dialogStartTime.value > 0) {
    const timeSpent = Math.round((Date.now() - dialogStartTime.value) / 1000)
    trackEvent('review_dialog_closed', {
      time_spent_seconds: timeSpent,
      had_rating: rating.value > 0,
      had_text: reviewText.value.length > 0,
      final_step: currentStep.value
    })
    // Reset state when closing
    setTimeout(() => {
      currentStep.value = 1
      rating.value = 0
      hoverRating.value = 0
      reviewText.value = ''
      submitting.value = false
      analyticsSubmitted.value = false
    }, 300)
  }
})

// Track when user starts typing review
watch(reviewText, (newValue) => {
  if (newValue.length > 0 && !hasStartedTyping.value) {
    hasStartedTyping.value = true
    trackEvent('review_text_started', {
      rating_value: rating.value,
      time_since_dialog_open_seconds: Math.round((Date.now() - dialogStartTime.value) / 1000)
    })
  }
})

const closeDialog = () => {
  emit('update:open', false)
}

const setRating = (value: number) => {
  const previousRating = rating.value
  rating.value = value
  
  // Clear rating validation error
  validationErrors.rating = ''
  
  // Track rating selection
  trackEvent('rating_selected', {
    rating_value: value,
    previous_rating: previousRating,
    is_change: previousRating !== value && previousRating > 0
  })
}

// Validation functions
const validateAnalyticsStep = () => {
  validationErrors.purpose = ''
  validationErrors.organizationType = ''
  
  if (!analyticsData.purpose) {
    validationErrors.purpose = 'Please select what you are using TickerQ for'
  }
  if (!analyticsData.organizationType) {
    validationErrors.organizationType = 'Please select your organization type'
  }
  
  return isAnalyticsValid.value
}

const validateRatingStep = () => {
  validationErrors.rating = ''
  
  if (!rating.value) {
    validationErrors.rating = 'Please provide a rating'
  }
  
  return isRatingValid.value
}

const getRatingText = () => {
  const currentRating = hoverRating.value || rating.value
  switch (currentRating) {
    case 1: return 'Poor'
    case 2: return 'Fair'
    case 3: return 'Good'
    case 4: return 'Very Good'
    case 5: return 'Excellent'
    default: return 'Click to rate'
  }
}

// Step navigation functions
const nextStep = () => {
  if (currentStep.value < totalSteps) {
    currentStep.value++
    trackEvent('step_advanced', {
      from_step: currentStep.value - 1,
      to_step: currentStep.value
    })
  }
}

const prevStep = () => {
  if (currentStep.value > 1) {
    currentStep.value--
    trackEvent('step_back', {
      from_step: currentStep.value + 1,
      to_step: currentStep.value
    })
  }
}

// Handle analytics form submission
const submitAnalytics = async () => {
  if (!analyticsData.purpose || !analyticsData.organizationType) {
    return false
  }

  try {
    const submissionData = {
      stars: rating.value,
      purpose: analyticsData.purpose,
      organizationType: analyticsData.organizationType,
      teamSize: analyticsData.teamSize,
      industry: analyticsData.industry,
      comments: reviewText.value,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href
    }

    if (ANALYTICS_ENDPOINT) {
      const response = await fetch(ANALYTICS_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submissionData)
      })

      if (!response.ok) {
        throw new Error('Analytics submission failed')
      }

      // Analytics submission successful
    }

    // Mark as submitted
    localStorage.setItem(ANALYTICS_STORAGE_KEY, JSON.stringify({
      submitted: true,
      timestamp: Date.now()
    }))

    analyticsSubmitted.value = true
    
    trackEvent('analytics_submitted', {
      purpose: analyticsData.purpose,
      organization_type: analyticsData.organizationType,
      team_size: analyticsData.teamSize,
      industry: analyticsData.industry
    })

    return true
  } catch (error) {
    return false
  }
}

// Handle analytics form completion
const completeAnalyticsStep = () => {
  if (validateAnalyticsStep()) {
    nextStep()
  }
}



const submitReview = async () => {
  if (!validateRatingStep()) {
    return
  }
  
  submitting.value = true
  
  const startTime = Date.now()
  
  // Track review submission start
  trackEvent('review_submission_started', {
    rating_value: rating.value,
    has_review_text: reviewText.value.length > 0,
    review_text_length: reviewText.value.length,
    time_to_submit_seconds: Math.round((Date.now() - dialogStartTime.value) / 1000)
  })
  
  try {
    // Submit all data together using your format
    if (analyticsData.purpose && analyticsData.organizationType) {
      await submitAnalytics()
    }
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    const submissionTime = Date.now() - startTime
    
    // Track successful submission
    trackEvent('review_submitted_successfully', {
      stars: rating.value,
      has_comments: reviewText.value.length > 0,
      comments_length: reviewText.value.length,
      submission_duration_ms: submissionTime,
      total_dialog_time_seconds: Math.round((Date.now() - dialogStartTime.value) / 1000),
      analytics_submitted: analyticsSubmitted.value
    })
    
    submitting.value = false
    
    // Go to success step instead of closing
    currentStep.value = 3
    
    trackEvent('review_completed', {
      final_stars: rating.value,
      comments_length: reviewText.value.length,
      analytics_completed: analyticsSubmitted.value
    })
    
  } catch (error) {
    submitting.value = false
    alert('There was an error submitting your review. Please try again.')
  }
}

// Track platform button clicks
const trackPlatformClick = (platform: string, url: string) => {
  trackEvent('platform_link_clicked', {
    platform: platform,
    rating_value: rating.value,
    has_review_text: reviewText.value.length > 0,
    destination_url: url,
    step: currentStep.value
    })
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  padding: 20px;
}

.modal-container {
  background: linear-gradient(145deg, var(--vp-c-bg) 0%, var(--vp-c-bg-soft) 100%);
  border-radius: 24px;
  max-width: 540px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 
    0 32px 80px rgba(0, 0, 0, 0.25),
    0 8px 32px rgba(0, 0, 0, 0.15),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
  border: 1px solid var(--vp-c-border);
  position: relative;
}

.modal-container::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, var(--vp-c-brand), var(--vp-c-brand-light), var(--vp-c-brand));
  border-radius: 24px 24px 0 0;
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px 16px;
  border-bottom: 1px solid var(--vp-c-border);
  margin-bottom: 20px;
  position: relative;
}

.modal-header::after {
  content: '';
  position: absolute;
  bottom: -1px;
  left: 24px;
  right: 24px;
  height: 1px;
  background: linear-gradient(90deg, transparent, var(--vp-c-border), transparent);
}

.header-content {
  display: flex;
  flex-direction: column;
}

.modal-header h2 {
  margin: 0;
  font-size: 24px;
  font-weight: 700;
  color: var(--vp-c-text-1);
}



.close-button {
  background: rgba(255, 255, 255, 0.1);
  border: none;
  cursor: pointer;
  padding: 10px;
  border-radius: 12px;
  color: var(--vp-c-text-3);
  transition: all 0.3s ease;
  backdrop-filter: blur(8px);
}

.close-button:hover {
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-1);
  transform: scale(1.1);
}

.modal-body {
  padding: 0 24px 24px;
}

.step-content {
  min-height: 300px;
  display: flex;
  flex-direction: column;
}

.step-description {
  margin-bottom: 20px;
}

.step-description p {
  margin: 0;
  color: var(--vp-c-text-2);
  font-size: 15px;
  text-align: center;
}

/* Form styles */
.analytics-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
  flex: 1;
}

.form-row {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-row-group {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.form-label {
  font-size: 14px;
  font-weight: 600;
  color: var(--vp-c-text-1);
}

.required {
  color: var(--vp-c-danger);
  font-weight: 700;
}

.form-select {
  padding: 12px 14px;
  border: 2px solid var(--vp-c-border);
  border-radius: 8px;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
  font-size: 14px;
  font-weight: 500;
  transition: all 0.3s ease;
  cursor: pointer;
}

.form-select:focus {
  outline: none;
  border-color: var(--vp-c-brand);
  background: var(--vp-c-bg-soft);
  box-shadow: 0 0 0 4px rgba(64, 158, 255, 0.1);
  transform: translateY(-1px);
}

.form-select:hover {
  border-color: var(--vp-c-text-3);
  transform: translateY(-1px);
}

.form-select.error {
  border-color: #ef4444;
  background: rgba(239, 68, 68, 0.05);
}

.form-select.error:focus {
  border-color: #ef4444;
  box-shadow: 0 0 0 4px rgba(239, 68, 68, 0.1);
}

.form-select.success {
  border-color: #22c55e;
  background: rgba(34, 197, 94, 0.05);
}

.form-select.success:focus {
  border-color: #22c55e;
  box-shadow: 0 0 0 4px rgba(34, 197, 94, 0.1);
}

.form-textarea {
  width: 100%;
  padding: 12px;
  border: 2px solid var(--vp-c-border);
  border-radius: 8px;
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-1);
  font-family: inherit;
  font-size: 14px;
  line-height: 1.5;
  resize: vertical;
  min-height: 80px;
  transition: all 0.3s ease;
}

.form-textarea:focus {
  outline: none;
  border-color: var(--vp-c-brand);
  background: var(--vp-c-bg);
  box-shadow: 0 0 0 4px rgba(64, 158, 255, 0.1);
  transform: translateY(-1px);
}

.form-textarea::placeholder {
  color: var(--vp-c-text-3);
  font-style: italic;
}

/* Validation styles */
.error-message {
  margin-top: 8px;
  font-size: 13px;
  color: #ef4444;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 6px;
}

.error-message::before {
  content: '⚠';
  font-size: 14px;
}

.stars.error {
  border-color: #ef4444;
  background: rgba(239, 68, 68, 0.05);
}

/* Rating styles */
.rating-section {
  margin-bottom: 20px;
}

.rating-section h3 {
  margin: 0 0 16px 0;
  font-size: 18px;
  font-weight: 700;
  color: var(--vp-c-text-1);
  text-align: center;
}

.stars {
  display: flex;
  gap: 8px;
  margin-bottom: 12px;
  justify-content: center;
  padding: 12px;
  background: var(--vp-c-bg-soft);
  border-radius: 12px;
  border: 1px solid var(--vp-c-border);
}

.star {
  background: none;
  border: none;
  cursor: pointer;
  padding: 6px;
  border-radius: 8px;
  color: var(--vp-c-text-3);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
}

.star::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, #fbbf24, #f59e0b);
  border-radius: 8px;
  opacity: 0;
  transition: opacity 0.3s ease;
  z-index: -1;
}

.star:hover::before,
.star.active::before {
  opacity: 0.1;
}

.star:hover,
.star.active {
  color: #f59e0b;
  transform: scale(1.2) rotate(5deg);
}

.star:active {
  transform: scale(1.1) rotate(2deg);
}

.rating-text {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: var(--vp-c-text-1);
  text-align: center;
  padding: 8px;
  background: linear-gradient(135deg, var(--vp-c-bg-soft), var(--vp-c-bg-alt));
  border-radius: 8px;
  border: 1px solid var(--vp-c-border);
}

.review-section {
  margin-bottom: 20px;
}

.review-section h3 {
  margin: 0 0 12px 0;
  font-size: 16px;
  font-weight: 600;
  color: var(--vp-c-text-1);
}

.review-textarea {
  width: 100%;
  padding: 12px;
  border: 2px solid var(--vp-c-border);
  border-radius: 8px;
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-1);
  font-family: inherit;
  font-size: 14px;
  line-height: 1.5;
  resize: vertical;
  min-height: 80px;
  transition: all 0.3s ease;
}

.review-textarea:focus {
  outline: none;
  border-color: var(--vp-c-brand);
  background: var(--vp-c-bg);
  box-shadow: 0 0 0 4px rgba(64, 158, 255, 0.1);
  transform: translateY(-2px);
}

.review-textarea::placeholder {
  color: var(--vp-c-text-3);
  font-style: italic;
}

/* Success content */
.success-content {
  text-align: center;
  align-items: center;
}

.success-icon {
  margin-bottom: 20px;
}

.success-content h3 {
  margin: 0 0 8px 0;
  font-size: 20px;
  font-weight: 700;
  color: var(--vp-c-text-1);
}

.success-content > p {
  margin: 0 0 24px 0;
  color: var(--vp-c-text-2);
  font-size: 15px;
}

.github-star-section {
  background: var(--vp-c-bg-soft);
  border: 2px solid var(--vp-c-border);
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 24px;
}

.github-star-section h4 {
  margin: 0 0 8px 0;
  font-size: 18px;
  font-weight: 700;
  color: var(--vp-c-text-1);
}

.github-star-section p {
  margin: 0 0 16px 0;
  color: var(--vp-c-text-2);
  font-size: 14px;
}

.github-star-btn {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  padding: 12px 24px;
  background: #333;
  color: white;
  text-decoration: none;
  border-radius: 8px;
  font-weight: 600;
  transition: all 0.3s ease;
}

.github-star-btn:hover {
  background: #24292e;
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(51, 51, 51, 0.3);
}

/* Step actions */
.step-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-top: auto;
  padding-top: 40px;
  position: relative;
}

.step-actions::before {
  content: '';
  position: absolute;
  top: 20px;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent, var(--vp-c-border), transparent);
}

.primary-btn,
.secondary-btn {
  padding: 10px 20px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 14px;
}

.primary-btn {
  background: linear-gradient(135deg, var(--vp-c-brand), var(--vp-c-brand-dark));
  color: white;
  border: none;
  box-shadow: 0 4px 16px rgba(64, 158, 255, 0.3);
}

.primary-btn:hover:not(:disabled) {
  background: linear-gradient(135deg, var(--vp-c-brand-dark), var(--vp-c-brand));
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(64, 158, 255, 0.4);
}

.primary-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
  box-shadow: 0 4px 16px rgba(64, 158, 255, 0.2);
}

.primary-btn.pulse {
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% {
    box-shadow: 0 4px 16px rgba(64, 158, 255, 0.3);
  }
  50% {
    box-shadow: 0 6px 20px rgba(64, 158, 255, 0.5);
    transform: translateY(-1px);
  }
  100% {
    box-shadow: 0 4px 16px rgba(64, 158, 255, 0.3);
  }
}

.secondary-btn {
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-2);
  border: 2px solid var(--vp-c-border);
}

.secondary-btn:hover {
  background: var(--vp-c-bg-alt);
  color: var(--vp-c-text-1);
  border-color: var(--vp-c-text-3);
  transform: translateY(-1px);
}

/* Transition animations */
.modal-enter-active,
.modal-leave-active {
  transition: all 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
  transform: scale(0.9);
}

/* Dark mode adjustments */
.dark .modal-container {
  background: linear-gradient(145deg, rgba(26, 26, 26, 0.95) 0%, rgba(30, 30, 30, 0.9) 100%);
  border-color: var(--vp-c-border);
  box-shadow: 
    0 32px 80px rgba(0, 0, 0, 0.4),
    0 8px 32px rgba(0, 0, 0, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.05);
}

.dark .close-button {
  background: rgba(40, 40, 40, 0.8);
  color: var(--vp-c-text-3);
}

.dark .close-button:hover {
  background: rgba(50, 50, 50, 0.95);
  color: var(--vp-c-text-1);
}

.dark .github-star-btn {
  background: #24292e;
}

.dark .github-star-btn:hover {
  background: #333;
}

/* Mobile responsiveness */
@media (max-width: 768px) {
  .modal-overlay {
    padding: 16px;
  }
  
  .modal-header {
    padding: 20px 20px 16px;
  }
  
  .modal-header h2 {
    font-size: 20px;
  }
  
  .modal-body {
    padding: 0 20px 20px;
  }
  
  .step-content {
    min-height: 250px;
  }
  
  .form-row-group {
    grid-template-columns: 1fr;
    gap: 12px;
  }
  
  .stars {
    gap: 6px;
    padding: 10px;
  }
  
  .star {
    padding: 4px;
  }
  
  .step-actions {
    flex-direction: column-reverse;
    gap: 8px;
  }
  
  .primary-btn,
  .secondary-btn {
    width: 100%;
    padding: 12px 20px;
  }
  
  .github-star-section {
    padding: 16px;
  }
}
</style>