import Token from '../interfaces/Token';
import { getDataWithPlayerCreate } from '../utilities/axios.utilities';
import { getPlayerById } from '../interfaces/Player';
import { connectDB } from '../database/MongoDB';

export default defineEventHandler(async (event) => {
  try {
    await connectDB();
    const date = new Date();
    let token: Token = { accessToken: '', refreshToken: '', accessExpire: date, refreshExpire: date };
    try {
      token = JSON.parse(getCookie(event, 'token')?.toString() || '');
    } catch {}
    if (token.accessToken.length <= 0 || token.refreshToken.length <= 0) {
      return { status: 'NOT_AUTHORIZED', player: {} };
    }
    const data = await getDataWithPlayerCreate(event, token);
    if (data === undefined) {
      return { player: {} };
    }
    return {
      player: await getPlayerById(data.userId),
    };
  } catch (error) {
    console.log('Error on checking auth status:', error);
    return { player: {} };
  }
});
