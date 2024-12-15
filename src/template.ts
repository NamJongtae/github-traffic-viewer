export const layout = `
  <header>
      <h1 class="title">GitHub Traffic Viewer</h1>
  </header>

    <footer>
        <p class="source-link">Data provided by <a href="https://api.github.com" target="_blank">GitHub API</a></p>
    </footer>
`;

export const mainMenu = `
    <div class="main-menu">
      <section class="desc">
        <h2 class="a11y">Traffic Data Storage Dsecription</h2>
        <ul>
          <li>GitHub Traffic provides data for only the past <strong>14 days.</strong></li>
          <li>Fetched data is stored to <strong>prevent data loss</strong>.</li>
          <li>You can save data for up to <strong>10 repositories</strong>.</li>
          <li>Stored data will be kept for <strong>up to 2 years</strong> and then automatically deleted.</li>
        </ul>
        <p class="warning">
          🚨 <strong>Uninstalling will delete all saved data!</strong>
        </p>
      </section>

      <div class="button-group">
        <button class="root-btn get-traffic-btn">Get New Traffic Data</button>
        <button class="root-btn load-traffic-btn">Load To Stored Traffic Data</button>
        <button class="root-btn delete-traffic-btn">Delete Stored Traffic Data</button>
        <button class="root-btn upload-traffic-btn">Upload Traffic Data</button>
        <button class="root-btn docs-btn">Go To Docs</button>
      </div>
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
      <button type="submit" class="root-btn submit-btn">Get Traffic Data</button>
      <button type="button" class="root-btn back-btn">Back</button>
    </form>
`;

export const loadTrafficForm = `
  <form class="load-traffic-form">
    <label for="repo-name">Repository Name</label>
      <select id="repo-selector" required>
        <option value="" disabled selected>Select Repository</option>
      </select>
    <button type="submit" class="root-btn submit-btn">Load Stored Traffic Data</button>
    <button type="button" class="root-btn back-btn">Back</button>
  </form>
`;

export const deleteTrafficForm = `
  <form class="delete-traffic-form">
    <label for="repo-name">Repository Name</label>
      <select id="repo-selector" required>
        <option value="" disabled selected>Select Repository</option>
      </select>
    <button type="submit" class="root-btn submit-btn">Delete Stored Traffic Data</button>
    <button type="button" class="root-btn back-btn">Back</button>
  </form>
`;

export const saveTrafficForm = `
  <form class="save-traffic-form">
    <label for="repo-name">Repository Name</label>
      <div class="input-group">
        <input type="text" id="repo-name" required />
        <button type="button" class="clear-btn" data-input="#repo-name">
          <img src="src/public/icons/x_icon.png" alt="reset" />
        </button>
      </div>

    <label for="repo-name">Upload File</label>
    <input type="file" id="uploader" accept=".xlsx, .xls, .txt, .json" />
    
    <button type="submit" class="root-btn submit-btn">Save Traffic Data</button>
    <button type="button" class="root-btn back-btn">Back</button>
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

export const trafficChart = `
<div class="traffic-chart">
  <div class="chart-wrapper">
    <canvas class="chart-canvas"></canvas>
  </div>
</div>
`;

export const result = `
<div class="result-wrapper">
  <div class="result-dim" role="button" aria-label="close result"></div>
  <section class="result">
    <h2 class="traffic-data-title"> <span class="repo-name"></span> Traffic Data</h2>
    <p class="last-updated">Updated : <time class="last-updated-time"></time></p>
        
    <div class="download-btn" role="button" tabindex="0">
      <label for="download-format" class="a11y">Download Format</label>
      <img class="download-icon" src="src/public/icons/download_icon.png" /> Download As
      <select id="download-format" class="download-format-selector">
        <option value="json">JSON</option>
        <option value="excel">EXCEL</option>
        <option value="txt">TXT</option>
      </select>
    </div>

    <p class="total-views">Total Views : <span class="views"></span></p>
    <p class="total-visitors">
      Total Visitors : <span class="visitors"></span>
    </p>

    <button class="root-btn change-view-btn" type="button" data-viewtype="table"">Chart View</button>

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

    <button class="close-btn" type="button"><img src="src/public/icons/x_icon.png" alt="close result" width=12 height=12/></button>
  </section>
</div>
`;
