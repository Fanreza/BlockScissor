<template>
  <div class="card-3d" :class="sizeClass">
    <div
      class="card-flip"
      :class="{ 'is-flipped': revealed }"
    >
      <!-- Back face -->
      <div class="card-face card-back">
        <div class="card-back-content">
          <!-- Geometric card back pattern -->
          <svg viewBox="0 0 100 130" class="card-back-svg">
            <defs>
              <linearGradient id="cb-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#2a1060" />
                <stop offset="50%" stop-color="#1a0a40" />
                <stop offset="100%" stop-color="#2a1060" />
              </linearGradient>
              <linearGradient id="cb-line-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#7a27ff" stop-opacity="0.6" />
                <stop offset="100%" stop-color="#5a17cc" stop-opacity="0.2" />
              </linearGradient>
              <filter id="cb-glow">
                <feGaussianBlur stdDeviation="1.5" result="blur" />
                <feFlood flood-color="#7a27ff" flood-opacity="0.5" result="color" />
                <feComposite in="color" in2="blur" operator="in" result="glow" />
                <feMerge>
                  <feMergeNode in="glow" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
            <!-- Background -->
            <rect width="100" height="130" rx="6" fill="url(#cb-grad)" />
            <!-- Border -->
            <rect x="4" y="4" width="92" height="122" rx="4" fill="none" stroke="#7a27ff" stroke-width="0.8" opacity="0.4" />
            <!-- Inner geometric pattern -->
            <g filter="url(#cb-glow)" opacity="0.6">
              <!-- Central diamond -->
              <polygon points="50,20 75,65 50,110 25,65" fill="none" stroke="url(#cb-line-grad)" stroke-width="1" />
              <!-- Inner diamond -->
              <polygon points="50,35 65,65 50,95 35,65" fill="none" stroke="#7a27ff" stroke-width="0.6" opacity="0.5" />
              <!-- Cross lines -->
              <line x1="15" y1="25" x2="85" y2="105" stroke="#7a27ff" stroke-width="0.4" opacity="0.3" />
              <line x1="85" y1="25" x2="15" y2="105" stroke="#7a27ff" stroke-width="0.4" opacity="0.3" />
              <!-- Horizontal lines -->
              <line x1="15" y1="65" x2="85" y2="65" stroke="#7a27ff" stroke-width="0.4" opacity="0.3" />
              <!-- Corner decorations -->
              <circle cx="50" cy="65" r="8" fill="none" stroke="#9944ff" stroke-width="0.6" opacity="0.5">
                <animate attributeName="r" values="8;10;8" dur="3s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.5;0.3;0.5" dur="3s" repeatCount="indefinite" />
              </circle>
              <circle cx="50" cy="65" r="3" fill="#7a27ff" opacity="0.4">
                <animate attributeName="opacity" values="0.4;0.7;0.4" dur="2s" repeatCount="indefinite" />
              </circle>
              <!-- Corner dots -->
              <circle cx="15" cy="20" r="2" fill="#7a27ff" opacity="0.5" />
              <circle cx="85" cy="20" r="2" fill="#7a27ff" opacity="0.5" />
              <circle cx="15" cy="110" r="2" fill="#7a27ff" opacity="0.5" />
              <circle cx="85" cy="110" r="2" fill="#7a27ff" opacity="0.5" />
              <!-- Pulsing corner markers -->
              <rect x="12" y="17" width="6" height="6" rx="1" fill="none" stroke="#9944ff" stroke-width="0.5" opacity="0.4">
                <animate attributeName="opacity" values="0.4;0.15;0.4" dur="2.5s" repeatCount="indefinite" />
              </rect>
              <rect x="82" y="17" width="6" height="6" rx="1" fill="none" stroke="#9944ff" stroke-width="0.5" opacity="0.4">
                <animate attributeName="opacity" values="0.4;0.15;0.4" dur="2.5s" begin="0.5s" repeatCount="indefinite" />
              </rect>
              <rect x="12" y="107" width="6" height="6" rx="1" fill="none" stroke="#9944ff" stroke-width="0.5" opacity="0.4">
                <animate attributeName="opacity" values="0.4;0.15;0.4" dur="2.5s" begin="1s" repeatCount="indefinite" />
              </rect>
              <rect x="82" y="107" width="6" height="6" rx="1" fill="none" stroke="#9944ff" stroke-width="0.5" opacity="0.4">
                <animate attributeName="opacity" values="0.4;0.15;0.4" dur="2.5s" begin="1.5s" repeatCount="indefinite" />
              </rect>
            </g>
          </svg>
        </div>
      </div>

      <!-- Front face -->
      <div class="card-face card-front" :class="resultClass">
        <div class="card-front-content">
          <!-- Card title -->
          <div class="front-title" :style="`color: ${choiceColor}`">
            {{ choiceLabel }}
          </div>

          <!-- SVG illustration -->
          <div class="front-art">
            <!-- ROCK -->
            <svg v-if="choice === GameChoice.Rock" :viewBox="artViewBox" class="front-art-svg">
              <defs>
                <linearGradient id="fc-rock-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stop-color="#ff9500" />
                  <stop offset="50%" stop-color="#ffb340" />
                  <stop offset="100%" stop-color="#cc6a00" />
                </linearGradient>
                <linearGradient id="fc-rock-shine" x1="0%" y1="0%" x2="50%" y2="50%">
                  <stop offset="0%" stop-color="#ffe0a0" stop-opacity="0.8" />
                  <stop offset="100%" stop-color="#ff9500" stop-opacity="0" />
                </linearGradient>
                <filter id="fc-rock-glow">
                  <feGaussianBlur stdDeviation="2" result="blur" />
                  <feFlood flood-color="#ff9500" flood-opacity="0.5" result="color" />
                  <feComposite in="color" in2="blur" operator="in" result="glow" />
                  <feMerge>
                    <feMergeNode in="glow" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>
              <g filter="url(#fc-rock-glow)" transform="translate(60, 48)">
                <polygon points="0,-34 20,-22 24,-4 16,18 0,28 -16,18 -24,-4 -20,-22" fill="url(#fc-rock-grad)" stroke="#ffb340" stroke-width="0.8" />
                <polygon points="0,-34 20,-22 0,-10 -20,-22" fill="url(#fc-rock-shine)" />
                <polygon points="0,-10 20,-22 24,-4 0,4" fill="#cc6a00" opacity="0.4" />
                <polygon points="0,-10 -20,-22 -24,-4 0,4" fill="#ffb340" opacity="0.3" />
                <polygon points="0,4 24,-4 16,18 0,28" fill="#b35900" opacity="0.5" />
                <polygon points="0,4 -24,-4 -16,18 0,28" fill="#e07800" opacity="0.4" />
                <line x1="0" y1="-34" x2="0" y2="28" stroke="#ffe0a0" stroke-width="0.4" opacity="0.3" />
                <circle cx="-8" cy="-16" r="3" fill="none" stroke="#ffe0a0" stroke-width="0.6" opacity="0.5" />
                <circle cx="4" cy="-18" r="2.5" fill="none" stroke="#ffe0a0" stroke-width="0.6" opacity="0.5" />
                <circle cx="12" cy="-12" r="2" fill="none" stroke="#ffe0a0" stroke-width="0.6" opacity="0.4" />
                <circle cx="28" cy="-12" r="1" fill="#ffe0a0" opacity="0.5">
                  <animate attributeName="opacity" values="0.5;0.1;0.5" dur="2s" repeatCount="indefinite" />
                </circle>
              </g>
            </svg>

            <!-- PAPER -->
            <svg v-if="choice === GameChoice.Paper" :viewBox="artViewBox" class="front-art-svg">
              <defs>
                <linearGradient id="fc-paper-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stop-color="#00e5cc" />
                  <stop offset="50%" stop-color="#00c9db" />
                  <stop offset="100%" stop-color="#0090a8" />
                </linearGradient>
                <linearGradient id="fc-paper-shine" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stop-color="#00ffee" stop-opacity="0.6" />
                  <stop offset="100%" stop-color="#00c9db" stop-opacity="0" />
                </linearGradient>
                <filter id="fc-paper-glow">
                  <feGaussianBlur stdDeviation="2" result="blur" />
                  <feFlood flood-color="#00e5cc" flood-opacity="0.5" result="color" />
                  <feComposite in="color" in2="blur" operator="in" result="glow" />
                  <feMerge>
                    <feMergeNode in="glow" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>
              <g filter="url(#fc-paper-glow)" transform="translate(60, 48)">
                <rect x="-22" y="-30" width="44" height="60" rx="2" fill="url(#fc-paper-grad)" stroke="#00ffee" stroke-width="0.8" />
                <ellipse cx="0" cy="-30" rx="26" ry="5" fill="#00a89a" stroke="#00e5cc" stroke-width="0.6" />
                <ellipse cx="0" cy="-30" rx="26" ry="5" fill="url(#fc-paper-shine)" opacity="0.4" />
                <ellipse cx="0" cy="30" rx="26" ry="5" fill="#00a89a" stroke="#00e5cc" stroke-width="0.6" />
                <g stroke="#00ffee" stroke-width="1" opacity="0.6" fill="none">
                  <path d="M-14,-18 L-10,-22 L-6,-18 L-10,-14 Z">
                    <animate attributeName="opacity" values="0.6;0.2;0.6" dur="2.5s" repeatCount="indefinite" />
                  </path>
                  <circle cx="-10" cy="-2" r="3" opacity="0.5">
                    <animate attributeName="opacity" values="0.5;0.15;0.5" dur="2s" repeatCount="indefinite" />
                  </circle>
                  <path d="M4,-20 L10,-17 L4,-14" opacity="0.5">
                    <animate attributeName="opacity" values="0.5;0.15;0.5" dur="2.2s" repeatCount="indefinite" />
                  </path>
                  <path d="M-14,10 L-8,6 L-8,14 Z" opacity="0.5">
                    <animate attributeName="opacity" values="0.5;0.2;0.5" dur="2.8s" repeatCount="indefinite" />
                  </path>
                  <circle cx="8" cy="8" r="3" opacity="0.4">
                    <animate attributeName="opacity" values="0.4;0.1;0.4" dur="2.4s" repeatCount="indefinite" />
                  </circle>
                  <circle cx="0" cy="20" r="4" stroke-width="1.2" opacity="0.6">
                    <animate attributeName="opacity" values="0.6;0.25;0.6" dur="1.8s" repeatCount="indefinite" />
                  </circle>
                </g>
              </g>
            </svg>

            <!-- SCISSORS -->
            <svg v-if="choice === GameChoice.Scissors" :viewBox="artViewBox" class="front-art-svg">
              <defs>
                <linearGradient id="fc-scissors-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stop-color="#ff3399" />
                  <stop offset="50%" stop-color="#e040a0" />
                  <stop offset="100%" stop-color="#cc0066" />
                </linearGradient>
                <linearGradient id="fc-blade-shine" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stop-color="#ff66bb" stop-opacity="0.8" />
                  <stop offset="100%" stop-color="#ff3399" stop-opacity="0.1" />
                </linearGradient>
                <filter id="fc-scissors-glow">
                  <feGaussianBlur stdDeviation="2" result="blur" />
                  <feFlood flood-color="#ff3399" flood-opacity="0.5" result="color" />
                  <feComposite in="color" in2="blur" operator="in" result="glow" />
                  <feMerge>
                    <feMergeNode in="glow" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>
              <g filter="url(#fc-scissors-glow)" transform="translate(60, 48)">
                <!-- Blade 1 -->
                <polygon points="-28,-30 -4,-6 2,-10 -24,-36" fill="url(#fc-scissors-grad)" stroke="#ff66bb" stroke-width="0.6" />
                <polygon points="-28,-30 -4,-6 -2,-3 -26,-27" fill="url(#fc-blade-shine)" />
                <line x1="-28" y1="-30" x2="-4" y2="-6" stroke="#ff88cc" stroke-width="1" opacity="0.5">
                  <animate attributeName="opacity" values="0.5;0.15;0.5" dur="1.5s" repeatCount="indefinite" />
                </line>
                <!-- Blade 2 -->
                <polygon points="28,-30 4,-6 -2,-10 24,-36" fill="url(#fc-scissors-grad)" stroke="#ff66bb" stroke-width="0.6" />
                <polygon points="28,-30 4,-6 2,-3 26,-27" fill="url(#fc-blade-shine)" />
                <line x1="28" y1="-30" x2="4" y2="-6" stroke="#ff88cc" stroke-width="1" opacity="0.5">
                  <animate attributeName="opacity" values="0.5;0.15;0.5" dur="1.8s" repeatCount="indefinite" />
                </line>
                <!-- Center pivot -->
                <circle cx="0" cy="-5" r="6" fill="#1a0015" stroke="#ff3399" stroke-width="1.2" />
                <circle cx="0" cy="-5" r="3" fill="#ff3399" opacity="0.5">
                  <animate attributeName="opacity" values="0.5;0.8;0.5" dur="1.5s" repeatCount="indefinite" />
                </circle>
                <circle cx="0" cy="-5" r="1.5" fill="#ff88cc" />
                <!-- Handle 1 -->
                <ellipse cx="-10" cy="14" rx="9" ry="13" fill="none" stroke="#e040a0" stroke-width="2" transform="rotate(-15, -10, 14)" />
                <ellipse cx="-10" cy="14" rx="7" ry="11" fill="#1a0015" transform="rotate(-15, -10, 14)" />
                <!-- Handle 2 -->
                <ellipse cx="10" cy="14" rx="9" ry="13" fill="none" stroke="#e040a0" stroke-width="2" transform="rotate(15, 10, 14)" />
                <ellipse cx="10" cy="14" rx="7" ry="11" fill="#1a0015" transform="rotate(15, 10, 14)" />
                <!-- Lightning sparks -->
                <polyline points="-16,-24 -10,-18 -14,-17 -8,-12" fill="none" stroke="#ff88cc" stroke-width="0.8" opacity="0.6">
                  <animate attributeName="opacity" values="0.6;0;0.6" dur="0.8s" repeatCount="indefinite" />
                </polyline>
                <polyline points="16,-24 10,-18 14,-17 8,-12" fill="none" stroke="#ff88cc" stroke-width="0.8" opacity="0.4">
                  <animate attributeName="opacity" values="0.4;0;0.4" dur="1s" repeatCount="indefinite" />
                </polyline>
              </g>
            </svg>

            <!-- NONE / UNKNOWN -->
            <svg v-if="choice === GameChoice.None" :viewBox="artViewBox" class="front-art-svg">
              <defs>
                <filter id="fc-none-glow">
                  <feGaussianBlur stdDeviation="2" result="blur" />
                  <feFlood flood-color="#7a27ff" flood-opacity="0.5" result="color" />
                  <feComposite in="color" in2="blur" operator="in" result="glow" />
                  <feMerge>
                    <feMergeNode in="glow" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>
              <g filter="url(#fc-none-glow)" transform="translate(60, 48)">
                <text x="0" y="8" text-anchor="middle" font-size="36" font-weight="900" fill="#7a27ff" font-family="var(--font-display), Orbitron, sans-serif">?</text>
              </g>
            </svg>
          </div>

          <!-- Label -->
          <div v-if="showLabel" class="front-label" :style="`color: ${choiceColor}`">
            {{ choiceLabel }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { GameChoice } from '~/composables/useRPS'

const props = withDefaults(defineProps<{
  choice: GameChoice
  revealed?: boolean
  result?: 'win' | 'lose' | 'draw' | null
  size?: 'sm' | 'md' | 'lg'
  showLabel?: boolean
}>(), {
  revealed: false,
  result: null,
  size: 'md',
  showLabel: true,
})

const choiceLabel = computed(() => {
  const map: Record<number, string> = {
    [GameChoice.Rock]: 'ROCK',
    [GameChoice.Paper]: 'PAPER',
    [GameChoice.Scissors]: 'SCISSORS',
    [GameChoice.None]: '???',
  }
  return map[props.choice] || '???'
})

const choiceColor = computed(() => {
  const map: Record<number, string> = {
    [GameChoice.Rock]: '#ff9500',
    [GameChoice.Paper]: '#00e5cc',
    [GameChoice.Scissors]: '#ff3399',
    [GameChoice.None]: '#7a27ff',
  }
  return map[props.choice] || '#7a27ff'
})

const artViewBox = '0 0 120 96'

const sizeClass = computed(() => ({
  sm: 'card-sm',
  md: 'card-md',
  lg: 'card-lg',
}[props.size]))

const resultClass = computed(() => {
  if (!props.result) return ''
  return {
    win: 'glow-win',
    lose: 'glow-lose',
    draw: 'glow-draw',
  }[props.result]
})
</script>

<style scoped>
.card-3d {
  perspective: 1000px;
}

.card-sm {
  width: 64px;
  height: 88px;
}

.card-md {
  width: 96px;
  height: 128px;
}

.card-lg {
  width: 128px;
  height: 172px;
}

.card-flip {
  position: relative;
  width: 100%;
  height: 100%;
  transform-style: preserve-3d;
  transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

.card-flip.is-flipped {
  transform: rotateY(180deg);
}

.card-face {
  position: absolute;
  inset: 0;
  backface-visibility: hidden;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

/* Back face */
.card-back {
  background: linear-gradient(135deg, #1c1030, #141418);
  border: 2px solid #3a2870;
  box-shadow: 0 0 15px #7a27ff33;
}

.card-back-content {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: back-pulse 3s ease-in-out infinite;
}

.card-back-svg {
  width: 90%;
  height: 90%;
}

/* Front face */
.card-front {
  background: linear-gradient(180deg, #1c1c28, #141418);
  border: 2px solid #2b2b3a;
  transform: rotateY(180deg);
  transition: box-shadow 0.3s ease, border-color 0.3s ease;
}

.card-front-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  padding: 6px;
  gap: 2px;
}

.front-title {
  font-family: var(--font-display), 'Orbitron', sans-serif;
  font-weight: 800;
  letter-spacing: 0.12em;
  font-size: 0.5rem;
  opacity: 0.8;
}

.card-lg .front-title {
  font-size: 0.65rem;
}

.card-sm .front-title {
  font-size: 0.4rem;
}

.front-art {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  min-height: 0;
}

.front-art-svg {
  width: 85%;
  height: 85%;
}

.front-label {
  font-family: var(--font-display), 'Orbitron', sans-serif;
  font-size: 0.5rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

.card-lg .front-label {
  font-size: 0.6rem;
}

.card-sm .front-label {
  font-size: 0.35rem;
}

/* Result glow effects */
.glow-win {
  border-color: #44dd88;
  box-shadow: 0 0 20px #44dd8888, 0 0 45px #44dd8833;
  animation: glow-pulse-win 1.5s ease-in-out infinite;
}

.glow-lose {
  border-color: #cc4444;
  box-shadow: 0 0 10px #cc444466;
  opacity: 0.7;
}

.glow-draw {
  border-color: #ddaa33;
  box-shadow: 0 0 15px #ddaa3366, 0 0 30px #ddaa3322;
}

@keyframes back-pulse {
  0%, 100% { opacity: 0.7; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.02); }
}

@keyframes glow-pulse-win {
  0%, 100% { box-shadow: 0 0 20px #44dd8888, 0 0 45px #44dd8833; }
  50% { box-shadow: 0 0 30px #44dd88aa, 0 0 60px #44dd8844; }
}
</style>
