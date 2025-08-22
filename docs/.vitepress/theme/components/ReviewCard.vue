<template>
  <div class="review-card-container">
    <Transition name="slide-up">
      <div 
        v-if="showCard" 
        class="review-card"
        @click="openReviewDialog"
      >
        <div class="card-content">
          <div class="icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 17.27L18.18 21L16.54 13.97L22 9.24L14.81 8.63L12 2L9.19 8.63L2 9.24L7.46 13.97L5.82 21L12 17.27Z" fill="currentColor"/>
            </svg>
          </div>
          <div class="text">
            <h3>Rate TickerQ</h3>
            <p>Share your experience & help us improve</p>
          </div>
          <div class="arrow">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M6 12L10 8L6 4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
        </div>
        <button 
          class="close-btn"
          @click.stop="hideCard"
          aria-label="Close review card"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 4L4 12M4 4L12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
        </button>
      </div>
    </Transition>

    <!-- Review Dialog -->
    <ReviewDialog v-model:open="showDialog" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

const showCard = ref(false)
const showDialog = ref(false)

// Analytics tracking function
const trackEvent = (eventName: string, parameters: Record<string, any> = {}) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, {
      event_category: 'Review_Card',
      ...parameters
    })
  }
  
  // Also log to console for debugging
  console.log('Review Analytics:', eventName, parameters)
}

onMounted(() => {
  // Show card after 3 seconds
  setTimeout(() => {
    showCard.value = true
    // Track card appearance
    trackEvent('review_card_shown', {
      trigger: 'auto_timeout',
      delay_seconds: 3
    })
  }, 3000)
})

const openReviewDialog = () => {
  showDialog.value = true
  showCard.value = false
  
  // Track dialog opening
  trackEvent('review_dialog_opened', {
    source: 'review_card_click'
  })
}

const hideCard = () => {
  showCard.value = false
  
  // Track card dismissal
  trackEvent('review_card_dismissed', {
    action: 'close_button_click'
  })
}
</script>

<style scoped>
.review-card-container {
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 1000;
}

.review-card {
  background: linear-gradient(145deg, var(--vp-c-bg) 0%, var(--vp-c-bg-soft) 100%);
  border: 1px solid var(--vp-c-border);
  border-radius: 16px;
  padding: 20px;
  box-shadow: 
    0 10px 40px rgba(0, 0, 0, 0.1),
    0 2px 8px rgba(0, 0, 0, 0.05),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(16px);
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  max-width: 320px;
  min-width: 280px;
  overflow: hidden;
}

.review-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(90deg, var(--vp-c-brand), var(--vp-c-brand-light));
  opacity: 0;
  transition: opacity 0.3s ease;
}

.review-card:hover {
  transform: translateY(-4px) scale(1.02);
  box-shadow: 
    0 20px 60px rgba(0, 0, 0, 0.15),
    0 8px 24px rgba(0, 0, 0, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
  border-color: var(--vp-c-brand);
}

.review-card:hover::before {
  opacity: 1;
}

.review-card:active {
  transform: translateY(-2px) scale(1.01);
  transition: all 0.1s ease;
}

.card-content {
  display: flex;
  align-items: center;
  gap: 16px;
}

.icon {
  width: 48px;
  height: 48px;
  background: var(--vp-c-brand);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  flex-shrink: 0;
  transition: all 0.3s ease;
  box-shadow: 0 4px 16px var(--vp-c-brand-soft);
}

.review-card:hover .icon {
  transform: rotate(5deg) scale(1.1);
  box-shadow: 0 6px 24px var(--vp-c-brand-soft);
}

.text {
  flex: 1;
}

.text h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 700;
  color: var(--vp-c-text-1);
  line-height: 1.2;
}

.text p {
  margin: 6px 0 0 0;
  font-size: 14px;
  color: var(--vp-c-text-2);
  line-height: 1.4;
  font-weight: 500;
}

.arrow {
  color: var(--vp-c-text-3);
  flex-shrink: 0;
  transition: all 0.3s ease;
  opacity: 0.7;
}

.review-card:hover .arrow {
  transform: translateX(4px);
  color: var(--vp-c-brand);
  opacity: 1;
}

.close-btn {
  position: absolute;
  top: 12px;
  right: 12px;
  background: rgba(255, 255, 255, 0.8);
  border: none;
  cursor: pointer;
  padding: 6px;
  border-radius: 8px;
  color: var(--vp-c-text-2);
  transition: all 0.3s ease;
  backdrop-filter: blur(8px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  opacity: 0;
  transform: scale(0.8);
}

.review-card:hover .close-btn {
  opacity: 1;
  transform: scale(1);
}

.close-btn:hover {
  background: rgba(255, 255, 255, 0.95);
  color: var(--vp-c-text-1);
  transform: scale(1.1);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

/* Transition animations */
.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.3s ease;
}

.slide-up-enter-from {
  transform: translateY(100px);
  opacity: 0;
}

.slide-up-leave-to {
  transform: translateY(20px);
  opacity: 0;
}

/* Dark mode adjustments */
.dark .review-card {
  background: linear-gradient(145deg, rgba(26, 26, 26, 0.95) 0%, rgba(30, 30, 30, 0.9) 100%);
  border-color: var(--vp-c-border);
  box-shadow: 
    0 10px 40px rgba(0, 0, 0, 0.3),
    0 2px 8px rgba(0, 0, 0, 0.2),
    inset 0 1px 0 rgba(255, 255, 255, 0.05);
}

.dark .review-card:hover {
  border-color: var(--vp-c-brand);
  background: linear-gradient(145deg, rgba(26, 26, 26, 0.98) 0%, rgba(30, 30, 30, 0.95) 100%);
  box-shadow: 
    0 20px 60px rgba(0, 0, 0, 0.4),
    0 8px 24px rgba(0, 0, 0, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
}

.dark .close-btn {
  background: rgba(40, 40, 40, 0.8);
  color: var(--vp-c-text-2);
}

.dark .close-btn:hover {
  background: rgba(50, 50, 50, 0.95);
  color: var(--vp-c-text-1);
}

.dark .icon {
  background: var(--vp-c-brand);
  box-shadow: 0 4px 16px rgba(64, 158, 255, 0.2);
}

.dark .review-card:hover .icon {
  box-shadow: 0 6px 24px rgba(64, 158, 255, 0.3);
}



/* Mobile responsiveness */
@media (max-width: 768px) {
  .review-card-container {
    bottom: 80px;
    right: 16px;
    left: 16px;
  }
  
  .review-card {
    max-width: none;
    min-width: auto;
    padding: 18px;
  }
  
  .card-content {
    gap: 14px;
  }
  
  .icon {
    width: 42px;
    height: 42px;
  }
  
  .text h3 {
    font-size: 16px;
  }
  
  .text p {
    font-size: 13px;
  }
}
</style>
