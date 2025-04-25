import axios from 'axios';
import Token from '../interfaces/Token';
import { createPlayer, getPlayerById, hasPlayer } from '../interfaces/Player';
import { connectDB } from '../database/MongoDB';

export default defineEventHandler(async (event) => {
    try {
        await connectDB();
        const date = new Date();
        let token: Token = { accessToken: '', refreshToken: '', accessExpire: date, refreshExpire: date };
        try { token = JSON.parse(getCookie(event, 'token')?.toString() || ''); } catch {}
        if (token.accessToken.length <= 0 || token.refreshToken.length <= 0) { return { status: 'NOT_AUTHORIZED', user: { system: {}, player: {} } }; }
        const data = await getData(event, token);
        if (data === undefined) { return { status: 'NOT_AUTHORIZED', user: { system: {}, player: {} } }; }
        return {
            status: 'OK', user: {
                system: data as Object,
                player: await getPlayerById(data.userId)
            }
        };
    } catch (error) {
        console.log('Error on checking auth status:', error);
        return { status: 'NOT_AUTHORIZED', user: { system: {}, player: {} } };
    }
});

async function getData(event: any, token: Token): Promise<any> {
    const response = await axios.get('https://auth.sleaf.dev/api/getUserData', {
        headers: { authorization: `Bearer ${token.accessToken}` }
    }).catch((error) => {
        return error.response;
    });
    const data: { status: string, account: Object } = response.data;
    if (data.status === 'EXPIRED') {
        const newToken = await refreshToken(event, token);
        if (newToken !== undefined) { return await getData(event, newToken); }
    }
    if (data.status === 'OK') {
        const account: any = data.account;
        const accountId = account.userId;
        if (!(await hasPlayer(accountId))) { await createPlayer(accountId, account.username); }
        return data.account;
    }
    return undefined;
}

async function refreshToken(event: any, token: Token): Promise<Token | undefined> {
    try {
        const response = await axios.put('https://auth.sleaf.dev/api/refreshToken', { refreshToken: token.refreshToken }, {
            headers: { authorization: `Bearer ${token.accessToken}` }
        }).catch((error) => { return error.response; });
        const data: { status: string, token: Token } = response.data;
        if (data.status !== 'OK') { return undefined; }
        setCookie(event, 'token', JSON.stringify(data.token));
        return data.token;
    } catch(error) {
        return undefined;
    }
}
