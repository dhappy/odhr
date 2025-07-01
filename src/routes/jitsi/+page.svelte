<script lang="ts">
  import {
    PUBLIC_JITSI_HOST, PUBLIC_X8_API_KEY, PUBLIC_X8_ROOM_JWT,
  } from '$env/static/public'
  import '$lib/jitsi_external_api'

  $effect(() => {
    new globalThis.JitsiMeetExternalAPI(PUBLIC_JITSI_HOST, {
      roomName: `${PUBLIC_X8_API_KEY}/Mobbing`,
      parentNode: document.querySelector('#jaas-container'),
      jwt: PUBLIC_X8_ROOM_JWT,
    })
  })
</script>

<svelte:head>
  <title>Jitsi Mobbing</title>
</svelte:head>

<div id="jaas-container"></div>

<style>
  :global(html), :global(body) {
    min-height: 100vh;
    margin: 0;
    display: flex;
    flex-direction: column;
  }
  #jaas-container, :global(iframe) {
    flex-grow: 1;
  }
</style>
