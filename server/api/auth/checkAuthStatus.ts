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
    } catch (err) {
      console.error('❌ Failed to parse tokens cookie:', err);
    }
    if (token.accessToken.length <= 0 || token.refreshToken.length <= 0) {
      return { status: 'NOT_AUTHORIZED', user: {} };
    }
    const data = await getDataWithPlayerCreate(event, token);
    if (data === undefined) {
      console.error('⚠️ No data returned from getDataWithPlayerCreate, user is not authorized.');
      return { status: 'NOT_AUTHORIZED', user: {} };
    }
    return {
      status: 'OK',
      user: data as Object,
    };
  } catch (error) {
    console.error('🔥 Error on checking auth status:', error);
    return { status: 'NOT_AUTHORIZED', user: {} };
  }
});
