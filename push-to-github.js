const fs = require('fs');
const path = require('path');
const https = require('https');

const TOKEN = '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';
const OWNER = 'animeprints';
const REPO = 'portfolioanalyzer';
const BRANCH = 'main';

function getFileSha(owner, repo, path, callback) {
  const options = {
    hostname: 'api.github.com',
    path: `/repos/${owner}/${repo}/contents/${encodeURIComponent(path)}`,
    method: 'GET',
    headers: {
      'Authorization': `token ${TOKEN}`,
      'User-Agent': 'Claude-Code'
    }
  };

  const req = https.get(options, (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
      if (res.statusCode === 200) {
        try {
          const parsed = JSON.parse(data);
          callback(null, parsed.sha);
        } catch (e) {
          callback(e);
        }
      } else if (res.statusCode === 404) {
        callback(null, null); // File doesn't exist
      } else {
        callback(new Error(`GitHub API error: ${res.statusCode} ${data}`));
      }
    });
  });

  req.on('error', callback);
  req.end();
}

function uploadFile(owner, repo, path, content, sha, callback) {
  const options = {
    hostname: 'api.github.com',
    path: `/repos/${owner}/${repo}/contents/${encodeURIComponent(path)}`,
    method: sha ? 'PUT' : 'POST',
    headers: {
      'Authorization': `token ${TOKEN}`,
      'User-Agent': 'Claude-Code',
      'Content-Type': 'application/json'
    }
  };

  const body = {
    message: `Update ${path} via API`,
    content: content.toString('base64'),
    branch: BRANCH
  };

  if (sha) {
    body.sha = sha;
  }

  const req = https.request(options, (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
      if (res.statusCode === 200 || res.statusCode === 201) {
        try {
          callback(null, JSON.parse(data));
        } catch (e) {
          callback(e);
        }
      } else {
        callback(new Error(`GitHub API error: ${res.statusCode} ${data}`));
      }
    });
  });

  req.on('error', callback);
  req.write(JSON.stringify(body));
  req.end();
}

function shouldUpload(filePath) {
  // Skip certain files/directories
  const skip = [
    '.git',
    'node_modules',
    '.claude',
    '.claude-code',
    'dist',
    'deploy/hostinger',
    '.env',
    'package-lock.json',
    '.DS_Store'
  ];

  return !skip.some(pattern => filePath.includes(pattern));
}

function walkDir(dir, base = '', fileList = []) {
  const files = fs.readdirSync(dir);

  for (const file of files) {
    const filePath = path.join(dir, file);
    const relativePath = path.join(base, file);

    if (shouldUpload(relativePath)) {
      const stat = fs.statSync(filePath);
      if (stat.isDirectory()) {
        walkDir(filePath, relativePath, fileList);
      } else {
        fileList.push({
          path: relativePath,
          fullPath: filePath,
          size: stat.size
        });
      }
    }
  }

  return fileList;
}

async function main() {
  console.log('Collecting files to upload...');
  const files = walkDir('./');

  console.log(`Found ${files.length} files to upload`);

  let success = 0;
  let failed = 0;

  for (let i = 0; i < files.length; i++) {
    const file = files[i];

    // Read file content
    const content = fs.readFileSync(file.fullPath);

    // Get SHA if file exists on GitHub
    getFileSha(OWNER, REPO, file.path, (err, sha) => {
      if (err) {
        console.error(`❌ Error checking ${file.path}:`, err.message);
        failed++;
      } else {
        uploadFile(OWNER, REPO, file.path, content, sha, (err, result) => {
          if (err) {
            console.error(`❌ Failed to upload ${file.path}:`, err.message);
            failed++;
          } else {
            console.log(`✅ ${file.path} (${(file.size / 1024).toFixed(1)}KB)`);
            success++;
          }

          // Show progress
          if (success + failed === files.length) {
            console.log(`\n📊 Complete! ${success} uploaded, ${failed} failed`);
            process.exit(failed > 0 ? 1 : 0);
          }
        });
      }
    });

    // Small delay to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 100));
  }
}

main();
