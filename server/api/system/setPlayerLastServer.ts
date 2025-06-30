import { connectDB } from '~/server/api/database/MongoDB';
import { hasToken } from '../interfaces/ServerToken';
import { setPlayerLastServer } from '../interfaces/Player';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { player, server } = body;
  const token = getRequestHeader(event, 'authorization');
  try {
    await connectDB();
    if (!(await hasToken(token))) {
      setResponseStatus(event, 500);
      return { status: 'INVALID_TOKEN' };
    }
    await setPlayerLastServer(player, server);
    setResponseStatus(event, 200);
    return { status: 'OK' };
  } catch (error) {
    console.error(`🖥️❌ Setting last server "${server}" error for player "${player}":`, error);
    setResponseStatus(event, 500);
    return { status: 'ERROR' };
  }
});
