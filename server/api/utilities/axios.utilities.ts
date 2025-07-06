import axios from 'axios';
import Token from '../interfaces/Token';
import { createPlayer, hasPlayer } from '../interfaces/Player';

const authDomain = process.env.AUTH_DOMAIN || 'https://auth.sleaf.dev';

export async function getDataWithPlayerCreate(event: any, token: Token): Promise<any> {
  const response = await axios
    .get(`${authDomain}/api/user/getUserData`, {
      headers: { authorization: `Bearer ${token.accessToken}` },
    })
    .catch((error) => {
      console.error('📩❌ Error while fetching user data:', error?.response?.data || error.message || error);
      return error.response;
    });
  const data: { status: string; account: Object } = response.data;
  if (data.status === 'EXPIRED') {
    const newToken = await refreshToken(event, token);
    if (newToken !== undefined) {
      return await getDataWithPlayerCreate(event, newToken);
    }
  }
  if (data.status === 'OK') {
    const account: any = data.account;
    const accountId = account.userId;
    if (!(await hasPlayer(accountId))) {
      await createPlayer(accountId, account.username);
    }
    return data.account;
  }
  return undefined;
}

export async function refreshToken(event: any, token: Token): Promise<Token | undefined> {
  try {
    const response = await axios
      .put(
        `${authDomain}/api/tokens/refreshToken`,
        { refreshToken: token.refreshToken },
        {
          headers: { authorization: `Bearer ${token.accessToken}` },
        }
      )
      .catch((error) => {
        return error.response;
      });
    const data: { status: string; token: Token } = response.data;
    if (data.status !== 'OK') {
      return undefined;
    }
    setCookie(event, 'tokens', JSON.stringify(data.token), {
      maxAge: 60 * 60 * 24 * 30,
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      path: '/',
    });
    return data.token;
  } catch (error) {
    console.error('⚠️❌ Unexpected error while refreshing token:', error);
    return undefined;
  }
}
