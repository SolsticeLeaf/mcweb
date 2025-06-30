import { connectDB } from '~/server/api/database/MongoDB';
import { hasToken } from '../interfaces/ServerToken';
import { setPlayerLastServer } from '../interfaces/Player';
import { getServer } from '../interfaces/Server';

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
    const serverObject = await getServer(server);
    if (serverObject) {
      await setPlayerLastServer(player, serverObject);
    } else {
      await setPlayerLastServer(player, {
        _id: server,
        name: server,
        tags: {},
        description: {
          en: 'undefined',
          ru: 'не опозано',
        },
        map: 'localhost:8123',
        ip: 'localhost:25565',
      });
    }
    setResponseStatus(event, 200);
    return { status: 'OK' };
  } catch (error) {
    console.error(`🖥️❌ Setting last server "${server}" error for player "${player}":`, error);
    setResponseStatus(event, 500);
    return { status: 'ERROR' };
  }
});
