const fs = require('fs');
const path = require('path');

const logDir = path.join(__dirname, '..', 'logs');
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}
const logFile = path.join(logDir, 'email.log');

const append = (entry) => {
  const line = `[${new Date().toISOString()}] ${typeof entry === 'string' ? entry : JSON.stringify(entry)}\n`;
  fs.appendFile(logFile, line, (err) => {
    if (err) console.error('Failed to write email log:', err);
  });
};

const readLastLines = (maxLines = 200) => {
  try {
    if (!fs.existsSync(logFile)) return '';
    const data = fs.readFileSync(logFile, 'utf8');
    const lines = data.trim().split(/\r?\n/);
    return lines.slice(-maxLines).join('\n');
  } catch (err) {
    console.error('Failed to read email log:', err);
    return '';
  }
};

module.exports = { append, readLastLines, path: logFile };
