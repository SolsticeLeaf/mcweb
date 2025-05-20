import Token from '../interfaces/Token';
import { getDataWithPlayerCreate } from '../utilities/axios.utilities';
import { connectDB } from '../database/MongoDB';

export default defineEventHandler(async (event) => {
  try {
    await connectDB();
    const date = new Date();
    let token: Token = { accessToken: '', refreshToken: '', accessExpire: date, refreshExpire: date };
    try {
      token = JSON.parse(getCookie(event, 'tokens')?.toString() || '');
    } catch {}
    if (token.accessToken.length <= 0 || token.refreshToken.length <= 0) {
      return { status: 'NOT_AUTHORIZED', user: {} };
    }
    const data = await getDataWithPlayerCreate(event, token);
    if (data === undefined) {
      return { status: 'NOT_AUTHORIZED', user: {} };
    }
    return {
      status: 'OK',
      user: data as Object,
    };
  } catch (error) {
    console.log('Error on checking auth status:', error);
    return { status: 'NOT_AUTHORIZED', user: {} };
  }
});
