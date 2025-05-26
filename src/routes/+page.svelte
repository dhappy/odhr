<svelte:head>
  <title>Óð: Overview</title>
</svelte:head>

<header><h1>
  Óðrœrir: Serial Mob Programming Logistics
</h1></header>
<main>
  <p>The goal is to define the functionality of the project in GitHub Issues with sufficient thoroughness and clarity that independent teams of developers are able to contribute effectively.</p>
  <p>Currently the following issues are defined:</p>
  <ul>
    <li>
      Pages:
      <ul>
        <li>
          Scheduling:
          <a href="https://github.com/dhappy/odr/issues/1">Issue</a>
          /
          <a href="schedule/">UI</a>
          <a href="ui/image/scheduling continual.svg">
            <img class="screen" src="ui/image/scheduling continual.svg" alt="Scheduling Interface"/>
          </a>
        </li>
        <li>
          Participation:
          <a href="https://github.com/dhappy/odr/issues/2">Issue</a>
          <img class="screen" src="ui/image/participation.svg" alt="Participation Interface"/>
        </li>
      </ul>
    </li>
  </ul>
</main>

<style>
  :root {
    color-scheme: light dark;
  }

  header, main {
    max-width: 85ch;
    margin: auto;
  }

  h1 {
    margin-block: 3rem;
  }

  ul {
    list-style: none;
    margin: 0;
    padding: 0.25rem;
  }

  .screen {
    display: block;
    max-height: 100dvh;
    margin-inline-start: 4rem;
  }
</style>