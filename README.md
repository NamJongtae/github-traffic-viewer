  <div align="end">
  Langeage : English | <a href="https://namjongtae.github.io/github-traffic-viewer/README_KR">한국어</a> 
</div>

# github-traffic-viewer

## Introduction

A Chrome extension that leverages the GitHub API to fetch and display traffic statistics for repositories, focusing on providing users with valuable insights into **views** and **unique visitors**.

Since GitHub's traffic data is **only retained for 2 weeks**, this extension **prevents data loss by securely storing historical statistics**. This allows users to analyze long-term trends and gain deeper insights into their repository's performance.

## Features

- Retrieve GitHub traffic data to display **views and uniquevisitors**.
- Data can be displayed in **table or chart** format.
- The retrieved data can be filtered by **date format** and sorted by **oldest, newest, views, or unique visitors**.
- Provide options to download the retrieved data in **JSON, EXCEL, and TXT** formats.
- Fetched data is stored to **prevent data loss**.
- You can save data for **up to 10 repositories**.
- Stored data will be kept for **up to 2 years** and then automatically deleted.

## Important Notes

**🚨 Uninstalling this extension will delete all stored data!**

## Install

You can download [GitHub Traffic Viewer](https://chromewebstore.google.com/detail/github-traffic-viewer/mncijnlfljjhdgmabakgdjofiakliaca) from the Chrome Web Store.

## How To Use ?

### Get New Traffic Data

1. After installing the extension, click on the Get New Traffic Data menu.
2. Enter your GitHub username, access token, and the repository name(s) you want to analyze, then click the Get Traffic Data button.
3. Once the data is loaded, traffic statistics for the specified repository will be displayed.

### Load Storage Traffic Data

1. Click on the Load Stored Traffic Data menu.
2. Select the repository you wish to view and click the Load Stored Traffic Data button.
3. After loading, the saved traffic data for the selected repository will be displayed.

### Delete Storage Traffic Data

1. Click on the Delete Stored Traffic Data menu.
2. Select the repository you want to delete and click the Delete Stored Traffic Data button.
3. A confirmation message will appear once the data has been successfully deleted.

## How To Generate Access Token?

To use this extension, you need to generate a GitHub Personal Access Token. Follow these steps to create one:

1. **Log in to GitHub**

   - Visit [github.com](https://github.com) and log in with your GitHub credentials.

2. **Navigate to Settings**

   - Click on your profile picture in the upper-right corner and select **Settings** from the dropdown menu.

3. **Access Developer Settings**

   - Scroll down the left-hand menu and click on **Developer settings**.

4. **Create a New Token**

   - Under **Personal access tokens**, select **Tokens (classic)** and click the **Generate new token** button.

5. **Configure the Token**

   - Provide a note to identify the token (e.g., "GitHub Traffic Viewer").
   - Set the expiration date for your token, or choose **No expiration** for unlimited use (note: use this option with caution).
   - Under **Select scopes**, check the following permissions:
     - **repo**: Full control of private repositories (if you want to access private repos).
     - **read:org**: To read organization-level traffic stats (if applicable).

6. **Generate and Save the Token**
   - Click **Generate token**.
   - Copy the generated token and keep it secure. You will not be able to see it again once you leave the page.

> ⚠️ **Note**: Keep your access token private and avoid sharing it with others. If your token is compromised, immediately revoke it via GitHub's Developer Settings and create a new one.

## privacy-policy

You can review the full [privacy policy](https://namjongtae.github.io/github-traffic-viewer/privacy_policy_EN) on the Privacy Policy page.
