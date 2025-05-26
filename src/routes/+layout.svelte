<script lang="ts">
  import { createAppKit } from '@reown/appkit'
  import { mainnet, arbitrum } from '@reown/appkit/networks'
  import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'

	let { children } = $props();

  const projectId = '101a9a9ea0737af81f87ae784a9884ef'

  export const networks = [mainnet]
  const wagmiAdapter = new WagmiAdapter({
    projectId,
    networks
  })
  const metadata = {
    name: 'Óðrœrir',
    description: 'Serial Mob Programming',
    url: 'https://odr.ygg.army',
    icons: ['https://avatars.githubusercontent.com/u/179229932']
  }
  const modal = createAppKit({
    adapters: [wagmiAdapter],
    networks: [mainnet],
    metadata,
    projectId,
    features: { analytics: true },
  })
</script>

<header>
  <appkit-button />
</header>

{@render children()}

<style>
  header {
    display: flex;
    justify-content: end;
  }
</style>