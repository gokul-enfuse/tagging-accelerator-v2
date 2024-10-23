const fs = require('fs');
const path = require('path');

function ensureLogDirectoryExists(logDir) {
  if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true });
  }
}

function sanitizeFilename(filename) {
  return filename.replace(/[^a-z0-9_\-]/gi, '_').toLowerCase();
}

function logError(error) {
  if (!error) {
    console.error('logError was called with no error object');
    return;
  }

  const now = new Date();
  const datePart = now.toISOString().slice(0, 10).replace(/-/g, ""); // YYYYMMDD
  const sanitizedDatePart = sanitizeFilename(datePart);
  const logDir = path.join(__dirname, '..', 'logs');
  const logPath = path.join(logDir, `accelerator_${sanitizedDatePart}.log`);
  ensureLogDirectoryExists(logDir);
  const logEntry = `[${now.toISOString()}] ${error.name || 'Error'}: ${error.message || 'Unknown Error'}\nStack Trace:\n${error.stack || 'No stack trace available'}\n\n`;
  try {
    fs.appendFileSync(logPath, logEntry, "UTF-8",{'flags': 'a+'});
  } catch (err) {
    console.error('eeeeeeeeeeeeeeeeeroor ---> ',err);
  }
  console.error(`[${now.toISOString()}] ${error.name || 'Error'}: ${error.message || 'Unknown Error'}`);
}

module.exports = {
  logError,
};
