import axios from 'axios';
import Token from '../interfaces/Token';

const authDomain = process.env.AUTH_DOMAIN || 'https://auth.sleaf.dev';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { serviceCode } = body;
  try {
    let clientId = getCookie(event, 'clientId')?.toString();
    if (!clientId) {
      return { status: 'NO_CLIENT_ID' };
    }
    const tokens = await axios
      .put(`${authDomain}/api/getToken`, {
        serviceCode: serviceCode,
        clientId: clientId,
      })
      .catch((error) => {
        return error.response;
      });
    const tokensData: Token = tokens.data.token;
    if (tokensData) {
      setCookie(event, 'tokens', JSON.stringify(tokensData));
      deleteCookie(event, 'clientId');
    }
    return { status: 'OK' };
  } catch (error) {
    console.log('Error on getting tokens:', error);
    return { status: 'ERR' };
  }
});
