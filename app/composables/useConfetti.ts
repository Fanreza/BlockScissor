// Confetti effects using canvas-confetti
import confetti from 'canvas-confetti'

export const useConfetti = () => {
  const fireWinConfetti = () => {
    // Burst from both sides
    const duration = 3000
    const end = Date.now() + duration

    const colors = ['#a855f7', '#06b6d4', '#22c55e', '#eab308', '#ec4899']

    const frame = () => {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.7 },
        colors,
      })
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.7 },
        colors,
      })

      if (Date.now() < end) {
        requestAnimationFrame(frame)
      }
    }

    // Initial big burst
    confetti({
      particleCount: 100,
      spread: 100,
      origin: { y: 0.6 },
      colors,
    })

    frame()
  }

  const fireDrawConfetti = () => {
    confetti({
      particleCount: 40,
      spread: 60,
      origin: { y: 0.6 },
      colors: ['#eab308', '#f59e0b', '#fbbf24'],
    })
  }

  return {
    fireWinConfetti,
    fireDrawConfetti,
  }
}
