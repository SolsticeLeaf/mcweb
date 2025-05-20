import axios from 'axios';
import Token from '../interfaces/Token';
import { createPlayer, hasPlayer } from '../interfaces/Player';

const authDomain = process.env.AUTH_DOMAIN || 'https://auth.sleaf.dev';

export async function getDataWithPlayerCreate(event: any, token: Token): Promise<any> {
  const response = await axios
    .get(`${authDomain}/api/getUserData`, {
      headers: { authorization: `Bearer ${token.accessToken}` },
    })
    .catch((error) => {
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
        `${authDomain}/api/refreshToken`,
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
    setCookie(event, 'tokens', JSON.stringify(data.token));
    return data.token;
  } catch (error) {
    return undefined;
  }
}
