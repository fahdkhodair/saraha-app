import cron from 'node-cron';
import { deleteExpiredTokens } from '../path/deleteexpiredtokens.js';

cron.schedule('0 * * * *', async () => {
  try {
    await deleteExpiredTokens();
  } catch (err) {
    console.error('Error running cron to delete expired tokens:', err.message);
  }
});
