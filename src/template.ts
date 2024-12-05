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
      <button type="submit" class="submit-btn">Get Traffic Data</button>
      <button type="button" class="back-btn">Back</button>
    </form>
`;

export const loadTrafficForm = `
  <form class="load-traffic-form">
    <label for="repo-name">Repository Name</label>
      <select id="repo-selector" required>
        <option value="" disabled selected>Select Repository</option>
      </select>
    <button type="submit" class="load-btn">Load Storage Data</button>
    <button type="button" class="back-btn">Back</button>
  </form>
`;

export const trafficTable = `
  <table class="traffic-table">
    <thead>
      <tr>
        <th>Date</th>
        <th>Total Views</th>
        <th>Unique Visitors</th>
      </tr>
    </thead>
    <tbody class="traffic-body"></tbody>
  </table>
`;

export const result = `
  <div class="result">
    <h2 class="traffic-data-title"> <span class="repo-name"></span> Traffic Data</h2>
    <p class="last-updated">Updated : <time class="last-updated-time"></time></p>
    <p class="total-views">Total Views : <span class="views"></span></p>
    <p class="total-visitors">
      Total Visitors : <span class="visitors"></span>
    </p>
    <div class="filters">
      <div class="date-filte">
        <label class="a11y" for="start-date">Start Date</label>
        <input type="date" id="start-date" class="date-input" />
        <span class="separator">~</span>
        <label class="a11y" for="end-date">End Date</label>
        <input type="date" id="end-date" class="date-input" />
      </div>
      <div class="sort-filter">
        <label class="a11y" for="sort-order">Sort by</label>
        <select id="sort-order">
          <option value="asc">Oldest</option>
          <option value="desc">Newest</option>
          <option value="views">Views</option>
          <option value="visitors">Visitors</option>
        </select>
      </div>
    </div>

    <div class="download-btn-group">
      <button class="download-json-btn">Download Data As JSON</button>
      <button class="download-excel-btn">Download Data As Excel</button>
    </div>
  </div>
`;
