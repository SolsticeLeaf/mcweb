import { randomUUID } from 'node:crypto';

export default defineEventHandler(async (event) => {
  try {
    let clientId = getCookie(event, 'clientId')?.toString();
    if (clientId === undefined || (clientId.length || 0) < 20) {
      clientId = randomUUID().toString();
    }
    setCookie(event, 'clientId', clientId, {
      maxAge: 60 * 60 * 24 * 10,
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      path: '/',
    });
    return { status: 'OK', clientId: clientId };
  } catch (error) {
    console.log('🚨 Error while getting clientId:', error);
    return { status: 'ERR', clientId: '' };
  }
});
