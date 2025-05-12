<script lang="ts">
    import { GregorianConversion } from "$lib";

  const periods = [0.37, 0.31, 0.29, 0.23]
  const num = {
    days: 7,
    get percents() {
      return this.days * 100
    },
  }
  let selector = $state<HTMLElement>()

  $effect(() => {
    if(!selector) throw new Error('`selector` is not set.')
    selector.id = 'selector'
    document.body.appendChild(selector)

    let start: { x: number, y: number } | null = null

    document.addEventListener('mousedown', (evt) => {
      if(!selector) throw new Error('`selector` is not set.')

      const { pageX: x, pageY: y } = evt
      start = { x, y }
      selector.style.left = `${x}px`
      selector.style.top = `${y}px`
    })

    document.addEventListener('mousemove', (evt) => {
      if(!selector) throw new Error('`selector` is not set.')
      if(!start) {
        selector.style.borderColor = 'transparent'
        return
      }
      selector.style.borderColor = 'inherit'
      const { pageX: x, pageY: y } = evt
      if(!start) start = { x, y }

      selector.style.left = `${Math.min(x, start.x)}px`
      selector.style.top = `${Math.min(y, start.y)}px`
      selector.style.width = `${Math.abs(x - start.x)}px`
      selector.style.height = `${Math.abs(y - start.y)}px`
    })


    document.addEventListener('mouseup', (evt) => {
      if(!selector) throw new Error('`selector` is not set.')
      selector.style.borderColor = 'transparent'
      start = null
      const bbox = selector.getBoundingClientRect()
      console.debug({ bbox, e: document.querySelectorAll(':checked') })

      evt.target?.dispatchEvent(new PointerEvent('click'))
    })
  })

  const { data } = $props()
  const { months } = data
</script>

<svelte:head>
  <title>Óð: Scheduling</title>
</svelte:head>

<form style:--percents={num.percents} action="apply/">
  <ul id="marks">
    {#each Array.from({ length: num.days + 1 }) as _p, p}
      {#each Array.from({ length: 10 }) as _d, d}
        {#if p < num.days - 1 || d === 0}
          <li><span>
            {#if d === 0}
              {GregorianConversion(new Date(), months)}
            {:else}
              {d * 10}%
            {/if}
          </span></li>
        {/if}
      {/each}
    {/each}
  </ul>
  <ul id="periods">
    {#each periods as period, i}
      {@const length = Math.floor(num.percents / (period * 100))}
      <li>
        <ol class="slots" style:--slot-height={period}>
          {#each Array.from({ length }) as _j, j}
            <li>
              <label for="entry-{i}-{j}"><section>
                <input id="entry-{i}-{j}" type="checkbox" value="period:{i}-slot:{j}"/>
                <h2 class="percent">
                  {(period * 100).toFixed(0)}%:
                  <img src="open.svg" alt="open"/>
                </h2>
                <h2>Apply</h2>
              </section></label>
            </li>
          {/each}
        </ol>
      </li>
    {/each}
  </ul>
</form>
<div id="selector" bind:this={selector}></div>

<style>
  :root {
    --line: 6px;
  }
  ul, ol {
    list-style: none;
    margin: 0;
    padding: 0;
  }
  li {
    text-align: center;
  }
  form {
    margin-block: 5rem;
    display: grid;
    grid-template-columns: 4em repeat(4, 1fr);
    gap: 2rem;
  }

  #marks li {
    border: var(--line) dashed #5559;
    border-inline-start: none;
    gap: 0;
    height: calc(var(--line) * 10);
    margin-top: calc(-1 * var(--line));
    margin-inline-end: -2rem;
    font-size: 18pt;
    & span {
      display: block;
      margin-block-start: calc(-1 * 2 * 18pt / 3);
    }
    &:last-child {
      border: none;
    }
  }

  #periods {
    display: contents;

    li {
      border-radius: 1rem;
      height: calc(var(--line) * var(--slot-height) * 100);
      margin-top: calc(-1 * var(--line) * 3);
      li {
        border: var(--line) solid #5559;
      }
    }
    li li:hover, li li:has(input:checked) {
      filter: saturate(10) hue-rotate(90deg);
    }
    & > li:first-child {
      border: 5px solid #30F7;
    }
    & > li:not(:first-child) {
      border: 5px solid #F047;
    }
    & > li:nth-child(1) {
      grid-column: 2 / span 1;
      & li {
        background-color: #0F06;
      }
    }
    & > li:nth-child(2) li {
      background-color: #F506;
    }
    & > li:nth-child(3) li {
      background-color: #00F6;
    }
    & > li:nth-child(4) li {
      background-color: #0FF6;
    }

    label {
      width: 100%;
      height: 100%;
      display: grid;
      place-items: center;
      align-items: center;
      cursor: pointer;
    }

    .percent {
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }

  input[type="checkbox"] {
    display: none;
  }
  img[src="open.svg"] {
    height: 4rem;
    margin-inline: auto;
    display: inline-block;
  }
  h2 {
    display: block;
    font-size: 21pt;
    padding-block: 0.5rem;
    margin: 0;
    user-select: none;
  }

  :global(#selector) {
    position: absolute;
    border: var(--line, 5px) dotted currentColor;
  }
</style>