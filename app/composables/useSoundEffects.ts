// Sound effects composable using Web Audio API
// Generates sounds programmatically - no external files needed

let audioCtx: AudioContext | null = null

const getAudioContext = () => {
  if (!audioCtx && typeof window !== 'undefined') {
    audioCtx = new AudioContext()
  }
  return audioCtx
}

const muted = ref(false)

const playTone = (frequency: number, duration: number, type: OscillatorType = 'sine', volume = 0.3) => {
  if (muted.value) return
  const ctx = getAudioContext()
  if (!ctx) return

  const osc = ctx.createOscillator()
  const gain = ctx.createGain()

  osc.type = type
  osc.frequency.setValueAtTime(frequency, ctx.currentTime)
  gain.gain.setValueAtTime(volume, ctx.currentTime)
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration)

  osc.connect(gain)
  gain.connect(ctx.destination)

  osc.start()
  osc.stop(ctx.currentTime + duration)
}

const playNotes = (notes: Array<{ freq: number; delay: number; duration: number; type?: OscillatorType; volume?: number }>) => {
  if (muted.value) return
  const ctx = getAudioContext()
  if (!ctx) return

  notes.forEach(({ freq, delay, duration, type = 'sine', volume = 0.3 }) => {
    setTimeout(() => playTone(freq, duration, type, volume), delay * 1000)
  })
}

export const useSoundEffects = () => {
  const playClick = () => {
    playTone(800, 0.08, 'square', 0.15)
  }

  const playSelect = () => {
    playNotes([
      { freq: 600, delay: 0, duration: 0.08, type: 'square', volume: 0.15 },
      { freq: 900, delay: 0.06, duration: 0.1, type: 'square', volume: 0.2 },
    ])
  }

  const playReveal = () => {
    playNotes([
      { freq: 200, delay: 0, duration: 0.3, type: 'sawtooth', volume: 0.1 },
      { freq: 400, delay: 0.1, duration: 0.3, type: 'sine', volume: 0.15 },
      { freq: 600, delay: 0.2, duration: 0.3, type: 'sine', volume: 0.2 },
    ])
  }

  const playWin = () => {
    playNotes([
      { freq: 523, delay: 0, duration: 0.2, type: 'square', volume: 0.2 },
      { freq: 659, delay: 0.15, duration: 0.2, type: 'square', volume: 0.2 },
      { freq: 784, delay: 0.3, duration: 0.2, type: 'square', volume: 0.25 },
      { freq: 1047, delay: 0.45, duration: 0.5, type: 'square', volume: 0.3 },
    ])
  }

  const playLose = () => {
    playNotes([
      { freq: 400, delay: 0, duration: 0.3, type: 'sawtooth', volume: 0.15 },
      { freq: 300, delay: 0.2, duration: 0.3, type: 'sawtooth', volume: 0.15 },
      { freq: 200, delay: 0.4, duration: 0.5, type: 'sawtooth', volume: 0.1 },
    ])
  }

  const playDraw = () => {
    playNotes([
      { freq: 440, delay: 0, duration: 0.2, type: 'triangle', volume: 0.2 },
      { freq: 440, delay: 0.25, duration: 0.3, type: 'triangle', volume: 0.15 },
    ])
  }

  const playCountdown = () => {
    playTone(600, 0.1, 'square', 0.15)
  }

  const playRoundWin = () => {
    playNotes([
      { freq: 660, delay: 0, duration: 0.15, type: 'square', volume: 0.2 },
      { freq: 880, delay: 0.12, duration: 0.25, type: 'square', volume: 0.25 },
    ])
  }

  const playRoundLose = () => {
    playNotes([
      { freq: 330, delay: 0, duration: 0.15, type: 'sawtooth', volume: 0.15 },
      { freq: 220, delay: 0.12, duration: 0.25, type: 'sawtooth', volume: 0.1 },
    ])
  }

  const toggleMute = () => {
    muted.value = !muted.value
  }

  return {
    muted,
    playClick,
    playSelect,
    playReveal,
    playWin,
    playLose,
    playDraw,
    playCountdown,
    playRoundWin,
    playRoundLose,
    toggleMute,
  }
}
