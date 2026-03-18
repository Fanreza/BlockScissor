// Obfuscate on-chain sequential game IDs into non-guessable room codes
// Uses XOR cipher — fully reversible, no backend needed

const MASK = 0x7A27FF5C // arbitrary constant for obfuscation

export const encodeGameId = (id: bigint | number): string => {
  const n = Number(id)
  return (n ^ MASK).toString(36)
}

export const decodeGameId = (code: string): bigint => {
  const n = parseInt(code, 36)
  if (isNaN(n)) throw new Error('Invalid room code')
  return BigInt(n ^ MASK)
}
