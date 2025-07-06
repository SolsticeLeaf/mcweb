import axios from 'axios';
import Token from '../interfaces/Token';

const authDomain = process.env.AUTH_DOMAIN || 'https://auth.sleaf.dev';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { serviceCode } = body;
  try {
    let clientId = getCookie(event, 'clientId')?.toString();
    if (!clientId) {
      console.error('❌ [Tokens] No clientId found in cookies.');
      return { status: 'NO_CLIENT_ID' };
    }
    const tokens = await axios
      .put(`${authDomain}/api/tokens/getToken`, {
        serviceCode: serviceCode,
        clientId: clientId,
      })
      .catch((error) => {
        console.error('🚨 [Tokens] Error while requesting token from auth service:', error?.response?.data || error.message || error);
        return error.response;
      });
    const tokensData: Token = tokens.data.token;
    if (tokensData) {
      setCookie(event, 'tokens', JSON.stringify(tokensData), {
        maxAge: 60 * 60 * 24 * 30,
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
        path: '/',
      });
      deleteCookie(event, 'clientId');
    } else {
      console.error('⚠️ [Tokens] No token data received from auth service.');
    }
    return { status: 'OK' };
  } catch (error) {
    console.error('🔥 [Tokens] Unexpected error on getting tokens:', error);
    return { status: 'ERR' };
  }
});
