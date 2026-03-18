<template>
  <div>
    <button
      v-if="!isAuthenticated"
      @click="connect"
      :disabled="loading"
      class="connect-btn"
    >
      {{ loading ? '...' : 'Connect' }}
    </button>

    <div v-else class="wallet-info">
      <div class="wallet-address">
        {{ user?.wallet?.address?.slice(0, 6) }}...{{ user?.wallet?.address?.slice(-4) }}
      </div>
      <button @click="logout" class="disconnect-btn" title="Disconnect">
        &times;
      </button>
    </div>

    <div v-if="error" class="error-msg">{{ error }}</div>
  </div>
</template>

<script setup lang="ts">
const privy = usePrivy()

const isAuthenticated = computed(() => privy.isAuthenticated.value)
const loading = computed(() => privy.loading.value)
const user = computed(() => privy.user.value)
const error = computed(() => privy.error.value)

const connect = async () => { await privy.connectWallet() }
const logout = () => { privy.logout() }
</script>

<style scoped>
.connect-btn {
  padding: 0.4rem 1rem;
  border-radius: 0.5rem;
  font-size: 0.8rem;
  font-weight: 700;
  background: linear-gradient(135deg, oklch(0.5 0.2 265), oklch(0.45 0.2 290));
  color: white;
  border: none;
  cursor: pointer;
  transition: all 0.2s;
}

.connect-btn:hover {
  box-shadow: 0 0 15px oklch(0.5 0.2 265 / 0.4);
  transform: translateY(-1px);
}

.wallet-info {
  display: flex;
  align-items: center;
  gap: 0.4rem;
}

.wallet-address {
  font-size: 0.75rem;
  font-family: var(--font-mono);
  font-weight: 600;
  padding: 0.35rem 0.65rem;
  border-radius: 0.5rem;
  background: oklch(0.18 0.03 265);
  border: 1px solid oklch(0.28 0.05 265);
  color: oklch(0.8 0.08 195);
}

.disconnect-btn {
  width: 28px;
  height: 28px;
  border-radius: 0.375rem;
  background: none;
  border: 1px solid oklch(0.28 0.05 265);
  color: oklch(0.5 0.03 265);
  cursor: pointer;
  font-size: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.disconnect-btn:hover {
  border-color: oklch(0.5 0.15 25);
  color: oklch(0.7 0.15 25);
}

.error-msg {
  font-size: 0.7rem;
  color: oklch(0.6 0.2 25);
  margin-top: 0.25rem;
}
</style>
