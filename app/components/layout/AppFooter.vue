<template>
  <footer class="footer">
    <div class="footer-inner">
      <div class="footer-top">
        <div class="footer-brand">
          <img src="/logo.png" alt="BlockScissor" class="footer-logo" />
          <span class="footer-name">BlockScissor</span>
          <p class="footer-desc">On-chain Rock Paper Scissors powered by Somnia Network reactivity.</p>
        </div>

        <div class="footer-links">
          <div class="footer-col">
            <h4>Game</h4>
            <NuxtLink to="/game/bot">Play vs Bot</NuxtLink>
            <NuxtLink to="/">PvP Match</NuxtLink>
            <NuxtLink to="/leaderboard">Leaderboard</NuxtLink>
          </div>
          <div class="footer-col">
            <h4>Network</h4>
            <a href="https://somnia.network" target="_blank" rel="noopener">Somnia Network</a>
            <a href="https://shannon-explorer.somnia.network" target="_blank" rel="noopener">Block Explorer</a>
            <a href="https://testnet.somnia.network" target="_blank" rel="noopener">Faucet</a>
          </div>
        </div>
      </div>

      <div class="footer-bottom">
        <span class="footer-copy">&copy; 2025 BlockScissor. All rights reserved.</span>
        <span class="footer-chain">
          <span class="footer-dot" />
          Testnet
        </span>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.footer {
  border-top: 1px solid #2b2b3a;
  background: #0a0a0f;
  margin-top: 4rem;
}

.footer-inner {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2.5rem 1.5rem 1.5rem;
}

.footer-top {
  display: flex;
  justify-content: space-between;
  gap: 3rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid #1c1c28;
}

.footer-brand {
  max-width: 280px;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.footer-logo {
  width: 36px;
  height: 36px;
  border-radius: 8px;
}

.footer-name {
  font-family: var(--font-display);
  font-size: 1.1rem;
  font-weight: 800;
  letter-spacing: 0.04em;
  background: linear-gradient(135deg, #00fff2, #7a27ff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.footer-desc {
  font-size: 0.8rem;
  color: #576975;
  line-height: 1.5;
}

.footer-links {
  display: flex;
  gap: 3rem;
}

.footer-col {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.footer-col h4 {
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: #576975;
  margin-bottom: 0.25rem;
}

.footer-col a {
  font-size: 0.8rem;
  color: #a0aab0;
  text-decoration: none;
  transition: color 0.2s;
}

.footer-col a:hover {
  color: #e6f1f8;
}

.footer-bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 1.25rem;
}

.footer-copy {
  font-size: 0.7rem;
  color: #434343;
}

.footer-chain {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.7rem;
  color: #434343;
  font-family: var(--font-mono);
}

.footer-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #26ffae;
  box-shadow: 0 0 6px #26ffae;
}

@media (max-width: 640px) {
  .footer-top { flex-direction: column; gap: 1.5rem; }
  .footer-bottom { flex-direction: column; gap: 0.5rem; text-align: center; }
}
</style>
