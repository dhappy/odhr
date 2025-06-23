<svelte:head>
  <title>Jitsi Mobbing</title>
  <script src='https://8x8.vc/vpaas-magic-cookie-327ed58ed18a48e7a1d31af4a6a7be45/external_api.js' async></script>
  <script type="text/javascript">
    window.onload = () => {
      const api = new JitsiMeetExternalAPI('8x8.vc', {
        roomName: 'vpaas-magic-cookie-327ed58ed18a48e7a1d31af4a6a7be45/MobSample',
        parentNode: document.querySelector('#jaas-container'),
        jwt: 'eyJraWQiOiJ2cGFhcy1tYWdpYy1jb29raWUtMzI3ZWQ1OGVkMThhNDhlN2ExZDMxYWY0YTZhN2JlNDUvNmY2MzI2LVNBTVBMRV9BUFAiLCJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiJqaXRzaSIsImlzcyI6ImNoYXQiLCJpYXQiOjE3NTA2NTA0NTcsImV4cCI6MTc1MDY1NzY1NywibmJmIjoxNzUwNjUwNDUyLCJzdWIiOiJ2cGFhcy1tYWdpYy1jb29raWUtMzI3ZWQ1OGVkMThhNDhlN2ExZDMxYWY0YTZhN2JlNDUiLCJjb250ZXh0Ijp7ImZlYXR1cmVzIjp7ImxpdmVzdHJlYW1pbmciOnRydWUsIm91dGJvdW5kLWNhbGwiOnRydWUsInNpcC1vdXRib3VuZC1jYWxsIjpmYWxzZSwidHJhbnNjcmlwdGlvbiI6dHJ1ZSwicmVjb3JkaW5nIjp0cnVlLCJmbGlwIjpmYWxzZX0sInVzZXIiOnsiaGlkZGVuLWZyb20tcmVjb3JkZXIiOmZhbHNlLCJtb2RlcmF0b3IiOnRydWUsIm5hbWUiOiJkeXMiLCJpZCI6Imdvb2dsZS1vYXV0aDJ8MTAzOTY4ODQ4MDIwMjI5MjA5MDQ5IiwiYXZhdGFyIjoiIiwiZW1haWwiOiJkQGRoYXBweS5vcmcifX0sInJvb20iOiIqIn0.iAxXxrDM-BiXpuEN226fTbWHGM5DP5IicjfXklFy6hKWOyLEAHeh_PYcegETtznwvrlNS6TEylR0tW33NaFyFciZF3DnAlKXokZ5Ac7WZ1f5MwerCEGc5fTRiPnPv90sskOnkDtHldbw2lc4JUfwKgbYVEWyYmhsAF0NFHW5VMLCBQjC0bK41_nmEhKIpaxnncmeJrAyGAfD6FjXi9hrrVdktGMV6iH3hI6IrxebQnK06Mlpt73XdddbMeMqRuBefowEWNpEE8tv_HTrqGjs4J8gbJ9REWFVnmLuu39K-0Wtf2k8OiQ-pn-0ptB_kf3o4YlGPcBd-ne-tOaEOLWa-g',
      })
    }
  </script>
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
