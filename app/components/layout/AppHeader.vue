<template>
  <header class="header">
    <div class="header-inner">
      <NuxtLink to="/" class="logo">
        <img src="/logo.png" alt="BlockScissor" class="logo-img" />
        <span class="logo-text">BlockScissor</span>
      </NuxtLink>

      <nav class="nav">
        <NuxtLink to="/" class="nav-link" active-class="nav-active">
          Home
        </NuxtLink>
        <NuxtLink to="/leaderboard" class="nav-link" active-class="nav-active">
          Leaderboard
        </NuxtLink>
      </nav>

      <div class="header-right">
        <div class="network-badge">
          <span class="network-dot" />
          <span>Somnia</span>
        </div>
        <ConnectWalletButton />
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import ConnectWalletButton from '../ConnectWalletButton.vue'
</script>

<style scoped>
.header {
  position: sticky;
  top: 0;
  z-index: 50;
  border-bottom: 1px solid oklch(0.22 0.04 265);
  background: oklch(0.1 0.02 265 / 0.85);
  backdrop-filter: blur(16px);
}

.header-inner {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 1.5rem;
  height: 60px;
}

.logo {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  text-decoration: none;
}

.logo-img {
  width: 32px;
  height: 32px;
  border-radius: 6px;
}

.logo-text {
  font-family: var(--font-display);
  font-size: 1.2rem;
  font-weight: 900;
  letter-spacing: 0.08em;
  background: linear-gradient(135deg, oklch(0.8 0.15 195), oklch(0.7 0.2 265));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.nav {
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.nav-link {
  font-size: 0.85rem;
  font-weight: 600;
  padding: 0.4rem 0.85rem;
  border-radius: 0.5rem;
  color: oklch(0.55 0.02 265);
  text-decoration: none;
  transition: all 0.2s;
}

.nav-link:hover {
  color: oklch(0.85 0.05 265);
  background: oklch(0.2 0.03 265);
}

.nav-active {
  color: oklch(0.85 0.1 265) !important;
  background: oklch(0.22 0.05 265);
}

.header-right {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.network-badge {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.75rem;
  font-weight: 600;
  color: oklch(0.6 0.08 145);
  padding: 0.3rem 0.65rem;
  border-radius: 2rem;
  background: oklch(0.2 0.04 145 / 0.2);
  border: 1px solid oklch(0.4 0.08 145 / 0.3);
}

.network-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: oklch(0.7 0.2 145);
  box-shadow: 0 0 6px oklch(0.7 0.2 145);
  animation: pulse-dot 2s ease-in-out infinite;
}

@keyframes pulse-dot {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

@media (max-width: 640px) {
  .nav { display: none; }
  .network-badge { display: none; }
}
</style>
