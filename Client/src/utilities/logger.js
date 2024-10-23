import axios from 'axios';
import { DOMAIN } from '../Constant.js';

/**
 * Created By: Mayur Patil | 30/08/2024
 * LogError is centralize function which will log the error
 */
export function logError(error) {
    const now = new Date();
    const timestamp = now.toISOString().replace(/[-:.TZ]/g, "");
  
    const logMessage = {
      timestamp: now.toISOString(),
      name: error.name || 'Error',
      message: error.message || 'Unknown Error',
      stack: error.stack || 'No stack trace available'
    };
  
    axios.post(`${DOMAIN}api/logs`, logMessage) //DOMAIN - PORT
      .then(response => {
        console.log("Error logged to server:", response.data);
      })
      .catch(err => {
        console.error("Failed to send log to server:", err);
      });
  
    console.error(`[${logMessage.timestamp}] ${logMessage.name}: ${logMessage.message}`);
}
