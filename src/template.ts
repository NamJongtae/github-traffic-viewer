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
    </div>
`;

export const getTrafficForm = `
    <form class="get-traffic-form">
      <label for="github-username">GitHub Username</label>
      <div class="input-group">
        <input type="text" id="github-username" required />
        <button type="button" class="clear-btn" data-input="#github-username">
          <img src="src/public/icons/x_icon.png" alt="Clear" />
        </button>
      </div>
      <label for="github-token">AccessToken</label>
      <div class="input-group">
        <input type="password" id="github-token" required />
        <button type="button" class="clear-btn" data-input="#github-token">
          <img src="src/public/icons/x_icon.png" alt="clear" />
        </button>
      </div>
      <label for="repo-name">Repository Name</label>
      <div class="input-group">
        <input type="text" id="repo-name" required />
        <button type="button" class="clear-btn" data-input="#repo-name">
          <img src="src/public/icons/x_icon.png" alt="reset" />
        </button>
      </div>
      <button type="submit" class="submit-btn">Get Traffic</button>
      <button type="button" class="back-btn">Back</button>
    </form>
`;

export const loadTrafficForm = `
  <form class="load-traffic-form">
    <label for="repo-name">Repository Name</label>
    <div class="input-group">
      <input type="text" id="repo-name" required />
      <button type="button" class="clear-btn" data-input="#repo-name">
        <img src="src/public/icons/x_icon.png" alt="Clear" />
      </button>
    </div>
    <button type="submit" class="load-btn">Load Storage Data</button>
    <button type="button" class="back-btn">Back</button>
  </form>
`;
