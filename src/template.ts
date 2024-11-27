export const layout = `
    <h1 class="title">GitHub Traffic Viewer</h1>
`;

export const mainMenu = `
    <div class="main-menu">
      <div class="desc">
        <p>GitHub Traffic provides data for only the past 14 days.</p>
        <p>To prevent data loss, the fetched data is stored.</p>
        <p>
          🚨 Uninstalling this extension will delete all saved traffic data!
        </p>
      </div>

      <div class="button-group">
        <button class="get-traffic-btn">Get New Traffic Data</button>
        <button class="load-traffic-btn">Load To Storage Traffic Data</button>
        <button class="docs-btn">Go To Docs</button>
      </div>
      <p class="source-link">Data provided by <a href="https://api.github.com" target="_blank">GitHub API</a></p>
    </div>`;
