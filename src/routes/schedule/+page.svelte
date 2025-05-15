<script lang="ts">
  import { GregorianConversion } from '$lib'
  import { page } from '$app/state'
  import OpenSign from './open.svelte'

  const periods = [0.37, 0.31, 0.29, 0.23]
  let days = $state(7)
  $effect(() => {
    const daysParam = page.url.searchParams.get('days')
    days = (
      daysParam ? Number(daysParam) : days
    )
  })

  let selector = $state<HTMLElement>()

  let start = $state(new Date())
  $effect(() => {
    const startParam = page.url.searchParams.get('start')
    start = (
      startParam ? new Date(startParam) : new Date()
    )
  })

  const clearSelection = () => {
    document.querySelectorAll('.selected').forEach((sel) => (
      (sel as HTMLElement).classList.remove('selected')
    ))
  }
  const select = () => {
    const bbox = selector?.getBoundingClientRect()
    if(bbox) {
      const slots = document.querySelectorAll('.slots li')
      const rects = (
        Array.from(slots).map((slot) => slot.getBoundingClientRect())
      )
      const touched = (
        rects.map((r, i) => {
          if(
            bbox.y <= r.y + r.height / 2
            && bbox.y + bbox.height >= r.y + r.height / 2
            && bbox.x <= r.x + r.width / 2
            && bbox.x + bbox.width >= r.x + r.width / 2
          ) {
            return slots[i]
          }
        })
        .filter(Boolean)
      )

      clearSelection()
      touched.forEach((t, i) => {
        t?.classList.add('selected')
      })
      return touched
    }
  }

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

      select()
    })


    document.addEventListener('mouseup', (evt) => {
      if(!selector) throw new Error('`selector` is not set.')
      selector.style.borderColor = 'transparent'
      start = null
      const active = select()
      ;(
        active
        ?.map((act) => act?.querySelector('[type="checkbox"]'))
        .forEach((elem) => {
          if(elem instanceof HTMLInputElement) {
            elem.checked = true
          } else {
            console.warn({ 'Unrecognized Slot': elem })
          }
        })
      )
    })
  })

  const { data } = $props()
  const { months } = data

  const submit = (evt: SubmitEvent) => {
    evt.preventDefault()

    const slots = (
      Array.from(
        (evt.target as HTMLFormElement).elements
      ).map((elem) => {
        if(elem instanceof HTMLInputElement && elem.checked) {
          const { periodIdx, slotIdx } = elem.dataset
          return {
            period: Number(elem.dataset.period),
            slot: Number(elem.dataset.slotIdx),
          }
        }
      }).filter(Boolean)
    )
    console.debug({ slots })
  }
</script>

<svelte:head>
  <title>Óð: Scheduling</title>
</svelte:head>

<form onsubmit={submit}>
  <button id="apply">Apply</button>
  <aside>
    <ul id="marks">
      {#each Array.from({ length: days + 1 }) as _p, p}
        {#each Array.from({ length: 10 }) as _d, d}
          {#if p < days || d === 0}
            <li><span>
              {#if d === 0}
                {GregorianConversion({
                  date: (() => {
                    const newDate = new Date(start)
                    newDate.setDate(newDate.getDate() + p)
                    return newDate
                  })(),
                  months,
                })}
              {:else}
                {d * 10}ʜ͋
              {/if}
            </span></li>
          {/if}
        {/each}
      {/each}
    </ul>
    <ul id="periods">
      {#each periods as period, i}
        {@const length = Math.floor((days * 100) / (period * 100))}
        <li>
          <ol class="slots" style:--slot-height={period + 0.02}>
            {#each Array.from({ length }) as _j, j}
              <li>
                <label for="entry-{i}-{j}"><section>
                  <input
                    id="entry-{i}-{j}"
                    type="checkbox"
                    value={i * periods.length + j}
                    data-period={period}
                    data-slot-idx={j}
                  />
                  <h2 class="percent">
                    <span class="text">
                      {(period * 100).toFixed(0)}ʜ͋
                    </span>
                    <OpenSign/>
                  </h2>
                </section></label>
              </li>
            {/each}
          </ol>
        </li>
      {/each}
    </ul>
  </aside>
</form>
<div id="selector" bind:this={selector}></div>

<style>
  @keyframes stop {
    from, to { rotate: 0; }
  }
  :root {
    --line: 6px;
    --border: 5px;
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
  }
  aside {
    display: grid;
    grid-template-columns: 6em repeat(4, 1fr);
    gap: 2rem;
  }

  #apply {
    font-size: 30pt;
    padding: 1rem;
    display: inline-block;
    margin-inline: auto;
    position: sticky;
    top: 5%;
    left: 50%;
    border-radius: 2rem;
    background-color: #BA45AD;
    transition: background-color 0.5s;
    z-index: 100;
  }
  #apply:hover, #apply:focus {
    background-color: orangered;
  }

  #marks {
    margin-top: calc(-0.5rem - var(--line));
  }

  #marks li {
    border: var(--line) dashed #5559;
    border-inline-start: none;
    gap: 0;
    height: calc(var(--line) * 9.25);
    margin-top: calc(-1 * var(--line));
    margin-inline-end: -2rem;
    font-size: 18pt;
    user-select: none;
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

        &:hover {
          filter: saturate(10) hue-rotate(90deg);
        }
        &:has(input:checked) {
          filter: saturate(15) hue-rotate(180deg);
          &:hover {
            filter: saturate(15) hue-rotate(210deg);
          }
        }
        :global(&.selected) {
          filter: saturate(7.5) hue-rotate(270deg);
          &:hover {
            filter: saturate(15) hue-rotate(290deg);
          }
        }
        :is(
          &:has(input:checked),
          :global(.selected)
        ) :global(svg #root) {
          animation-name: stop;
        }
      }
    }
    & > li {
      border: var(--border) solid currentColor;
    }
    & > li:first-child {
      border-color: #30F7;
    }
    & > li:not(:first-child) {
      border-color: #F047;
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
  }

  .percent {
    display: flex;
    justify-content: center;
    align-items: center;
    max-height: 100%;

    & .text::after {
      content: ': ';
    }
  }

  input[type="checkbox"] {
    display: none;
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

  @media(width < 900px) {
    .percent {
      flex-direction: column;

      .text::after {
        content: '';
      }
    }
  }

  @media(width < 500px) {
    #marks li {
      margin-inline-end: -0.5rem;
    }
    aside {
      gap: 0.5rem;
    }
    .percent {
      font-size: 17pt;
    }
  }
</style>