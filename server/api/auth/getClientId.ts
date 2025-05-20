import { randomUUID } from 'node:crypto';

export default defineEventHandler(async (event) => {
  try {
    let clientId = getCookie(event, 'clientId')?.toString();
    if (clientId === undefined || (clientId.length || 0) < 20) {
      clientId = randomUUID().toString();
    }
    setCookie(event, 'clientId', clientId);
    return { status: 'OK', clientId: clientId };
  } catch (error) {
    console.log('Error on getting clientId:', error);
    return { status: 'ERR', clientId: '' };
  }
});
