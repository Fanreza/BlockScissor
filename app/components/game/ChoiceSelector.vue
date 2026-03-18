<template>
  <div class="selector-container">
    <h3 class="selector-title">Choose Your Weapon</h3>

    <div class="cards-row">
      <button
        v-for="c in choices"
        :key="c.value"
        @click="handleSelect(c.value)"
        :class="[
          'game-card',
          `game-card--${c.id}`,
          selected === c.value ? 'game-card--selected' : '',
          selected !== null && selected !== c.value ? 'game-card--dimmed' : '',
          disabled ? 'game-card--disabled' : '',
        ]"
      >
        <!-- Card top border decoration -->
        <div class="card-top-border">
          <svg width="100%" height="6" viewBox="0 0 180 6" preserveAspectRatio="none">
            <defs>
              <linearGradient :id="`top-grad-${c.id}`" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" :style="`stop-color:${c.color1};stop-opacity:0`" />
                <stop offset="50%" :style="`stop-color:${c.color1};stop-opacity:1`" />
                <stop offset="100%" :style="`stop-color:${c.color1};stop-opacity:0`" />
              </linearGradient>
            </defs>
            <rect width="180" height="2" y="2" :fill="`url(#top-grad-${c.id})`" rx="1" />
          </svg>
        </div>

        <!-- Card title -->
        <div class="card-title" :style="`color: ${c.color1}`">
          <span class="card-title-diamond">&#9670;</span>
          <span class="card-title-text">{{ c.label }}</span>
          <span class="card-title-diamond">&#9670;</span>
        </div>

        <!-- Illustration area -->
        <div class="card-art-frame" :style="`border-color: ${c.color2}`">
          <div class="card-art-bg" :style="`background: radial-gradient(ellipse at center, ${c.color2}22, transparent 70%)`">
            <!-- ROCK SVG -->
            <svg v-if="c.id === 'rock'" viewBox="0 0 150 120" class="card-art-svg">
              <defs>
                <linearGradient id="rock-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stop-color="#ff9500" />
                  <stop offset="50%" stop-color="#ffb340" />
                  <stop offset="100%" stop-color="#cc6a00" />
                </linearGradient>
                <linearGradient id="rock-shine" x1="0%" y1="0%" x2="50%" y2="50%">
                  <stop offset="0%" stop-color="#ffe0a0" stop-opacity="0.8" />
                  <stop offset="100%" stop-color="#ff9500" stop-opacity="0" />
                </linearGradient>
                <filter id="rock-glow">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feFlood flood-color="#ff9500" flood-opacity="0.6" result="color" />
                  <feComposite in="color" in2="blur" operator="in" result="glow" />
                  <feMerge>
                    <feMergeNode in="glow" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>
              <!-- Crystal fist shape - angular gem facets -->
              <g filter="url(#rock-glow)" transform="translate(75, 60)">
                <!-- Main crystal body -->
                <polygon points="0,-42 25,-28 30,-5 20,22 0,35 -20,22 -30,-5 -25,-28" fill="url(#rock-grad)" stroke="#ffb340" stroke-width="1" />
                <!-- Facet lines -->
                <line x1="0" y1="-42" x2="0" y2="35" stroke="#ffe0a0" stroke-width="0.5" opacity="0.4" />
                <line x1="-25" y1="-28" x2="20" y2="22" stroke="#ffe0a0" stroke-width="0.5" opacity="0.3" />
                <line x1="25" y1="-28" x2="-20" y2="22" stroke="#ffe0a0" stroke-width="0.5" opacity="0.3" />
                <!-- Top facet highlight -->
                <polygon points="0,-42 25,-28 0,-12 -25,-28" fill="url(#rock-shine)" />
                <!-- Inner crystal facets -->
                <polygon points="0,-12 25,-28 30,-5 0,5" fill="#cc6a00" opacity="0.4" />
                <polygon points="0,-12 -25,-28 -30,-5 0,5" fill="#ffb340" opacity="0.3" />
                <!-- Bottom facets -->
                <polygon points="0,5 30,-5 20,22 0,35" fill="#b35900" opacity="0.5" />
                <polygon points="0,5 -30,-5 -20,22 0,35" fill="#e07800" opacity="0.4" />
                <!-- Knuckle ridges (fist detail) -->
                <circle cx="-10" cy="-20" r="4" fill="none" stroke="#ffe0a0" stroke-width="0.8" opacity="0.5" />
                <circle cx="5" cy="-22" r="3.5" fill="none" stroke="#ffe0a0" stroke-width="0.8" opacity="0.5" />
                <circle cx="15" cy="-16" r="3" fill="none" stroke="#ffe0a0" stroke-width="0.8" opacity="0.4" />
                <!-- Sparkle accents -->
                <g opacity="0.7">
                  <line x1="38" y1="-30" x2="44" y2="-30" stroke="#ffe0a0" stroke-width="1.5" />
                  <line x1="41" y1="-33" x2="41" y2="-27" stroke="#ffe0a0" stroke-width="1.5" />
                  <line x1="-38" y1="10" x2="-43" y2="10" stroke="#ffb340" stroke-width="1" />
                  <line x1="-40.5" y1="7" x2="-40.5" y2="13" stroke="#ffb340" stroke-width="1" />
                </g>
                <!-- Energy particles -->
                <circle cx="35" cy="-15" r="1.5" fill="#ffe0a0" opacity="0.6">
                  <animate attributeName="opacity" values="0.6;0.1;0.6" dur="2s" repeatCount="indefinite" />
                </circle>
                <circle cx="-33" cy="-20" r="1" fill="#ffb340" opacity="0.5">
                  <animate attributeName="opacity" values="0.5;0.1;0.5" dur="1.8s" repeatCount="indefinite" />
                </circle>
                <circle cx="28" cy="30" r="1.2" fill="#ffe0a0" opacity="0.4">
                  <animate attributeName="opacity" values="0.4;0;0.4" dur="2.2s" repeatCount="indefinite" />
                </circle>
              </g>
            </svg>

            <!-- PAPER SVG -->
            <svg v-if="c.id === 'paper'" viewBox="0 0 150 120" class="card-art-svg">
              <defs>
                <linearGradient id="paper-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stop-color="#00e5cc" />
                  <stop offset="50%" stop-color="#00c9db" />
                  <stop offset="100%" stop-color="#0090a8" />
                </linearGradient>
                <linearGradient id="paper-shine" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stop-color="#00ffee" stop-opacity="0.6" />
                  <stop offset="100%" stop-color="#00c9db" stop-opacity="0" />
                </linearGradient>
                <filter id="paper-glow">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feFlood flood-color="#00e5cc" flood-opacity="0.6" result="color" />
                  <feComposite in="color" in2="blur" operator="in" result="glow" />
                  <feMerge>
                    <feMergeNode in="glow" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>
              <g filter="url(#paper-glow)" transform="translate(75, 60)">
                <!-- Scroll body -->
                <rect x="-28" y="-38" width="56" height="76" rx="3" fill="url(#paper-grad)" stroke="#00ffee" stroke-width="1" />
                <!-- Scroll top roll -->
                <ellipse cx="0" cy="-38" rx="32" ry="6" fill="#00a89a" stroke="#00e5cc" stroke-width="0.8" />
                <ellipse cx="0" cy="-38" rx="32" ry="6" fill="url(#paper-shine)" opacity="0.5" />
                <!-- Scroll bottom roll -->
                <ellipse cx="0" cy="38" rx="32" ry="6" fill="#00a89a" stroke="#00e5cc" stroke-width="0.8" />
                <!-- Roll end caps -->
                <ellipse cx="-32" cy="-38" rx="3" ry="6" fill="#008880" stroke="#00e5cc" stroke-width="0.5" />
                <ellipse cx="32" cy="-38" rx="3" ry="6" fill="#008880" stroke="#00e5cc" stroke-width="0.5" />
                <ellipse cx="-32" cy="38" rx="3" ry="6" fill="#008880" stroke="#00e5cc" stroke-width="0.5" />
                <ellipse cx="32" cy="38" rx="3" ry="6" fill="#008880" stroke="#00e5cc" stroke-width="0.5" />
                <!-- Rune lines -->
                <g stroke="#00ffee" stroke-width="1.2" opacity="0.7" fill="none">
                  <!-- Rune row 1 - angular symbols -->
                  <path d="M-18,-22 L-14,-28 L-10,-22 L-14,-16 Z">
                    <animate attributeName="opacity" values="0.7;0.3;0.7" dur="3s" repeatCount="indefinite" />
                  </path>
                  <path d="M-2,-22 L4,-28 L4,-22 L-2,-16 Z" opacity="0.5">
                    <animate attributeName="opacity" values="0.5;0.2;0.5" dur="2.5s" repeatCount="indefinite" />
                  </path>
                  <path d="M12,-25 L18,-25 L15,-19" opacity="0.6">
                    <animate attributeName="opacity" values="0.6;0.2;0.6" dur="2.8s" repeatCount="indefinite" />
                  </path>
                  <!-- Rune row 2 - circles and lines -->
                  <circle cx="-14" cy="-4" r="4" opacity="0.5">
                    <animate attributeName="opacity" values="0.5;0.2;0.5" dur="2.2s" repeatCount="indefinite" />
                  </circle>
                  <line x1="-5" y1="-7" x2="5" y2="-1" opacity="0.6" />
                  <path d="M10,-7 L16,-4 L10,-1" opacity="0.5">
                    <animate attributeName="opacity" values="0.5;0.15;0.5" dur="2.6s" repeatCount="indefinite" />
                  </path>
                  <!-- Rune row 3 -->
                  <path d="M-18,12 L-12,8 L-12,16 Z" opacity="0.6">
                    <animate attributeName="opacity" values="0.6;0.25;0.6" dur="3.2s" repeatCount="indefinite" />
                  </path>
                  <line x1="-4" y1="10" x2="4" y2="14" opacity="0.4" />
                  <line x1="-4" y1="14" x2="4" y2="10" opacity="0.4" />
                  <circle cx="14" cy="12" r="3" opacity="0.45">
                    <animate attributeName="opacity" values="0.45;0.15;0.45" dur="2.4s" repeatCount="indefinite" />
                  </circle>
                  <!-- Central glyph -->
                  <circle cx="0" cy="26" r="5" stroke-width="1.5" opacity="0.7">
                    <animate attributeName="opacity" values="0.7;0.3;0.7" dur="2s" repeatCount="indefinite" />
                  </circle>
                  <line x1="-3" y1="26" x2="3" y2="26" opacity="0.6" />
                  <line x1="0" y1="23" x2="0" y2="29" opacity="0.6" />
                </g>
                <!-- Ambient sparkles -->
                <circle cx="-38" cy="-10" r="1.2" fill="#00ffee" opacity="0.5">
                  <animate attributeName="opacity" values="0.5;0;0.5" dur="2s" repeatCount="indefinite" />
                </circle>
                <circle cx="40" cy="15" r="1" fill="#00e5cc" opacity="0.4">
                  <animate attributeName="opacity" values="0.4;0;0.4" dur="1.7s" repeatCount="indefinite" />
                </circle>
              </g>
            </svg>

            <!-- SCISSORS SVG -->
            <svg v-if="c.id === 'scissors'" viewBox="0 0 150 120" class="card-art-svg">
              <defs>
                <linearGradient id="scissors-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stop-color="#ff3399" />
                  <stop offset="50%" stop-color="#e040a0" />
                  <stop offset="100%" stop-color="#cc0066" />
                </linearGradient>
                <linearGradient id="blade-shine" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stop-color="#ff66bb" stop-opacity="0.8" />
                  <stop offset="100%" stop-color="#ff3399" stop-opacity="0.1" />
                </linearGradient>
                <filter id="scissors-glow">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feFlood flood-color="#ff3399" flood-opacity="0.6" result="color" />
                  <feComposite in="color" in2="blur" operator="in" result="glow" />
                  <feMerge>
                    <feMergeNode in="glow" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
                <filter id="lightning-glow">
                  <feGaussianBlur stdDeviation="2" result="blur" />
                  <feFlood flood-color="#ff88cc" flood-opacity="0.8" result="color" />
                  <feComposite in="color" in2="blur" operator="in" result="glow" />
                  <feMerge>
                    <feMergeNode in="glow" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>
              <g filter="url(#scissors-glow)" transform="translate(75, 60)">
                <!-- Blade 1 (top-left to bottom-right) -->
                <polygon points="-35,-38 -5,-8 2,-12 -30,-45" fill="url(#scissors-grad)" stroke="#ff66bb" stroke-width="0.8" />
                <polygon points="-35,-38 -5,-8 -2,-4 -32,-34" fill="url(#blade-shine)" />
                <!-- Blade edge glow -->
                <line x1="-35" y1="-38" x2="-5" y2="-8" stroke="#ff88cc" stroke-width="1.5" opacity="0.6">
                  <animate attributeName="opacity" values="0.6;0.2;0.6" dur="1.5s" repeatCount="indefinite" />
                </line>

                <!-- Blade 2 (top-right to bottom-left) -->
                <polygon points="35,-38 5,-8 -2,-12 30,-45" fill="url(#scissors-grad)" stroke="#ff66bb" stroke-width="0.8" />
                <polygon points="35,-38 5,-8 2,-4 32,-34" fill="url(#blade-shine)" />
                <!-- Blade edge glow -->
                <line x1="35" y1="-38" x2="5" y2="-8" stroke="#ff88cc" stroke-width="1.5" opacity="0.6">
                  <animate attributeName="opacity" values="0.6;0.2;0.6" dur="1.8s" repeatCount="indefinite" />
                </line>

                <!-- Center pivot / energy core -->
                <circle cx="0" cy="-6" r="8" fill="#1a0015" stroke="#ff3399" stroke-width="1.5" />
                <circle cx="0" cy="-6" r="4" fill="#ff3399" opacity="0.6">
                  <animate attributeName="r" values="4;5;4" dur="1.5s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.6;0.9;0.6" dur="1.5s" repeatCount="indefinite" />
                </circle>
                <circle cx="0" cy="-6" r="2" fill="#ff88cc" />

                <!-- Handle 1 -->
                <ellipse cx="-12" cy="18" rx="12" ry="16" fill="none" stroke="#e040a0" stroke-width="2.5" transform="rotate(-15, -12, 18)" />
                <ellipse cx="-12" cy="18" rx="10" ry="14" fill="#1a0015" transform="rotate(-15, -12, 18)" />
                <!-- Handle grip lines -->
                <line x1="-20" y1="12" x2="-18" y2="8" stroke="#ff3399" stroke-width="0.6" opacity="0.4" />
                <line x1="-21" y1="18" x2="-19" y2="15" stroke="#ff3399" stroke-width="0.6" opacity="0.4" />

                <!-- Handle 2 -->
                <ellipse cx="12" cy="18" rx="12" ry="16" fill="none" stroke="#e040a0" stroke-width="2.5" transform="rotate(15, 12, 18)" />
                <ellipse cx="12" cy="18" rx="10" ry="14" fill="#1a0015" transform="rotate(15, 12, 18)" />
                <!-- Handle grip lines -->
                <line x1="20" y1="12" x2="18" y2="8" stroke="#ff3399" stroke-width="0.6" opacity="0.4" />
                <line x1="21" y1="18" x2="19" y2="15" stroke="#ff3399" stroke-width="0.6" opacity="0.4" />

                <!-- Lightning bolts between blades -->
                <g filter="url(#lightning-glow)">
                  <polyline points="-20,-30 -14,-24 -18,-22 -10,-16" fill="none" stroke="#ff88cc" stroke-width="1.2" opacity="0.7">
                    <animate attributeName="opacity" values="0.7;0;0.7" dur="0.8s" repeatCount="indefinite" />
                  </polyline>
                  <polyline points="20,-30 14,-24 18,-22 10,-16" fill="none" stroke="#ff88cc" stroke-width="1.2" opacity="0.5">
                    <animate attributeName="opacity" values="0.5;0;0.5" dur="1s" repeatCount="indefinite" />
                  </polyline>
                  <!-- Cross spark at intersection -->
                  <line x1="-6" y1="-20" x2="6" y2="-20" stroke="#ffaadd" stroke-width="1" opacity="0.6">
                    <animate attributeName="opacity" values="0.6;0;0.6" dur="0.6s" repeatCount="indefinite" />
                  </line>
                  <line x1="0" y1="-26" x2="0" y2="-14" stroke="#ffaadd" stroke-width="1" opacity="0.5">
                    <animate attributeName="opacity" values="0.5;0;0.5" dur="0.7s" repeatCount="indefinite" />
                  </line>
                </g>

                <!-- Sparkle accents -->
                <circle cx="-40" cy="-25" r="1.2" fill="#ff88cc" opacity="0.5">
                  <animate attributeName="opacity" values="0.5;0;0.5" dur="1.6s" repeatCount="indefinite" />
                </circle>
                <circle cx="42" cy="-20" r="1" fill="#ff66bb" opacity="0.4">
                  <animate attributeName="opacity" values="0.4;0;0.4" dur="2s" repeatCount="indefinite" />
                </circle>
              </g>
            </svg>
          </div>
        </div>

        <!-- Divider -->
        <div class="card-divider" :style="`background: linear-gradient(90deg, transparent, ${c.color1}, transparent)`" />

        <!-- Stats area -->
        <div class="card-stats">
          <div class="card-stat-row">
            <span class="card-stat-label">ATK</span>
            <span class="card-stat-value" :style="`color: ${c.color1}`">{{ c.atk }}</span>
          </div>
          <div class="card-stat-row">
            <span class="card-stat-label">TYPE</span>
            <span class="card-stat-value" :style="`color: ${c.color2}`">{{ c.type }}</span>
          </div>
        </div>

        <!-- Power level indicator -->
        <div class="card-power">
          <div
            v-for="i in 5"
            :key="i"
            class="power-pip"
            :class="{ 'power-pip--filled': i <= c.power }"
            :style="i <= c.power ? `background: ${c.color1}; box-shadow: 0 0 4px ${c.color1}` : ''"
          />
        </div>
      </button>
    </div>

    <!-- Lock in button -->
    <Transition name="lockin">
      <div v-if="selected !== null" class="lockin-container">
        <button
          @click="handleConfirm"
          :disabled="disabled"
          class="lockin-btn"
        >
          <span class="lockin-btn-text">LOCK IN</span>
        </button>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { GameChoice } from '~/composables/useRPS'

const props = defineProps<{
  disabled?: boolean
}>()

const emit = defineEmits<{
  select: [choice: GameChoice]
  confirm: [choice: GameChoice]
}>()

const { playSelect, playClick } = useSoundEffects()

const selected = ref<GameChoice | null>(null)

const choices = [
  {
    value: GameChoice.Rock,
    id: 'rock',
    label: 'ROCK',
    atk: 120,
    type: 'Earth',
    power: 4,
    color1: '#ff9500',
    color2: '#ffb340',
  },
  {
    value: GameChoice.Paper,
    id: 'paper',
    label: 'PAPER',
    atk: 100,
    type: 'Arcane',
    power: 3,
    color1: '#00e5cc',
    color2: '#00ffee',
  },
  {
    value: GameChoice.Scissors,
    id: 'scissors',
    label: 'SCISSORS',
    atk: 110,
    type: 'Storm',
    power: 4,
    color1: '#ff3399',
    color2: '#ff66bb',
  },
]

const handleSelect = (choice: GameChoice) => {
  selected.value = choice
  playSelect()
  emit('select', choice)
}

const handleConfirm = () => {
  if (selected.value !== null) {
    playClick()
    emit('confirm', selected.value)
  }
}

defineExpose({ reset: () => { selected.value = null } })
</script>

<style scoped>
.selector-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
}

.selector-title {
  font-family: var(--font-display), 'Orbitron', sans-serif;
  font-size: 1.25rem;
  font-weight: 700;
  text-align: center;
  color: #c8b8ff;
  text-shadow: 0 0 10px #7a27ff, 0 0 25px #7a27ff66;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.cards-row {
  display: flex;
  justify-content: center;
  gap: 1rem;
  perspective: 1200px;
}

@media (min-width: 768px) {
  .cards-row {
    gap: 1.5rem;
  }
}

/* === GAME CARD === */
.game-card {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 160px;
  padding: 10px 10px 8px;
  border-radius: 12px;
  border: 2px solid #2b2b3a;
  background: linear-gradient(180deg, #1c1c28, #141418);
  cursor: pointer;
  transition: transform 0.35s cubic-bezier(0.25, 0.46, 0.45, 0.94),
              box-shadow 0.35s ease,
              border-color 0.3s ease,
              opacity 0.3s ease;
  transform-style: preserve-3d;
  transform: perspective(800px) rotateX(0deg) rotateY(0deg) translateY(0px);
}

@media (max-width: 520px) {
  .game-card {
    width: 110px;
    padding: 6px 6px 5px;
  }
}

.game-card:hover {
  transform: perspective(800px) rotateX(-4deg) rotateY(0deg) translateY(-8px) scale(1.03);
  border-color: #3d3d55;
  box-shadow: 0 12px 40px #0008, 0 0 15px #7a27ff33;
}

.game-card--rock:hover {
  border-color: #ff950066;
  box-shadow: 0 12px 40px #0008, 0 0 20px #ff950044;
}

.game-card--paper:hover {
  border-color: #00e5cc66;
  box-shadow: 0 12px 40px #0008, 0 0 20px #00e5cc44;
}

.game-card--scissors:hover {
  border-color: #ff339966;
  box-shadow: 0 12px 40px #0008, 0 0 20px #ff339944;
}

/* Selected state */
.game-card--selected {
  transform: perspective(800px) rotateX(-2deg) translateY(-16px) scale(1.06) !important;
}

.game-card--selected.game-card--rock {
  border-color: #ff9500;
  box-shadow: 0 0 25px #ff9500aa, 0 0 60px #ff950044, 0 16px 50px #0008;
}

.game-card--selected.game-card--paper {
  border-color: #00e5cc;
  box-shadow: 0 0 25px #00e5ccaa, 0 0 60px #00e5cc44, 0 16px 50px #0008;
}

.game-card--selected.game-card--scissors {
  border-color: #ff3399;
  box-shadow: 0 0 25px #ff3399aa, 0 0 60px #ff339944, 0 16px 50px #0008;
}

/* Dimmed state */
.game-card--dimmed {
  opacity: 0.45;
  transform: perspective(800px) scale(0.95);
  filter: saturate(0.4);
}

.game-card--dimmed:hover {
  opacity: 0.7;
  filter: saturate(0.7);
  transform: perspective(800px) translateY(-4px) scale(0.97);
}

/* Disabled state */
.game-card--disabled {
  pointer-events: none;
  opacity: 0.5;
}

/* Card inner elements */
.card-top-border {
  width: 100%;
  margin-bottom: 4px;
}

.card-title {
  display: flex;
  align-items: center;
  gap: 6px;
  font-family: var(--font-display), 'Orbitron', sans-serif;
  font-size: 0.7rem;
  font-weight: 800;
  letter-spacing: 0.15em;
  margin-bottom: 6px;
}

@media (max-width: 520px) {
  .card-title {
    font-size: 0.6rem;
    gap: 4px;
  }
}

.card-title-diamond {
  font-size: 0.5rem;
  opacity: 0.7;
}

.card-title-text {
  white-space: nowrap;
}

.card-art-frame {
  width: 136px;
  height: 100px;
  border: 1px solid;
  border-radius: 6px;
  overflow: hidden;
  background: #0a0a12;
  display: flex;
  align-items: center;
  justify-content: center;
}

@media (max-width: 520px) {
  .card-art-frame {
    width: 94px;
    height: 72px;
  }
}

.card-art-bg {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.card-art-svg {
  width: 130px;
  height: 100px;
}

@media (max-width: 520px) {
  .card-art-svg {
    width: 88px;
    height: 68px;
  }
}

.card-divider {
  width: 85%;
  height: 1px;
  margin: 8px 0 6px;
  opacity: 0.6;
}

.card-stats {
  width: 100%;
  padding: 0 8px;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.card-stat-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-stat-label {
  font-family: var(--font-display), 'Orbitron', sans-serif;
  font-size: 0.55rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  color: #555568;
  text-transform: uppercase;
}

.card-stat-value {
  font-family: var(--font-display), 'Orbitron', sans-serif;
  font-size: 0.6rem;
  font-weight: 800;
  letter-spacing: 0.05em;
}

.card-power {
  display: flex;
  gap: 3px;
  margin-top: 6px;
}

.power-pip {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  border: 1px solid #3a3a50;
  background: transparent;
  transition: all 0.3s ease;
}

.power-pip--filled {
  border-color: transparent;
}

/* Lock-in button */
.lockin-container {
  display: flex;
  justify-content: center;
  margin-top: 0.5rem;
}

.lockin-btn {
  position: relative;
  padding: 0.7rem 2.8rem;
  font-family: var(--font-display), 'Orbitron', sans-serif;
  font-size: 0.95rem;
  font-weight: 800;
  letter-spacing: 0.15em;
  color: #fff;
  border: 2px solid #7a27ff;
  border-radius: 10px;
  background: linear-gradient(135deg, #2a1060, #1a0a40);
  cursor: pointer;
  overflow: hidden;
  transition: all 0.25s ease;
  text-transform: uppercase;
}

.lockin-btn::before {
  content: '';
  position: absolute;
  inset: -2px;
  border-radius: 12px;
  background: linear-gradient(135deg, #7a27ff, #00e5cc, #ff3399, #7a27ff);
  background-size: 300% 300%;
  z-index: -1;
  animation: border-rotate 3s linear infinite;
  opacity: 0.7;
}

.lockin-btn:hover {
  box-shadow: 0 0 30px #7a27ff88, 0 0 60px #7a27ff33;
  transform: scale(1.05);
  border-color: #9944ff;
}

.lockin-btn:active {
  transform: scale(0.97);
}

.lockin-btn-text {
  position: relative;
  z-index: 1;
}

@keyframes border-rotate {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

/* Transition */
.lockin-enter-active {
  animation: slide-up 0.35s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.lockin-leave-active {
  animation: slide-up 0.2s ease reverse;
}

@keyframes slide-up {
  from {
    opacity: 0;
    transform: translateY(12px) scale(0.9);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}
</style>
