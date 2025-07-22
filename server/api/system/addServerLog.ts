import { connectDB } from '~/server/api/database/MongoDB';
import { getServerByToken } from '../interfaces/Server';
import { addServerLog } from '../interfaces/ServerLog';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { type, player, data } = body;
  const token = getRequestHeader(event, 'authorization');
  try {
    await connectDB();
    const server = await getServerByToken(token);
    if (server === null) {
      setResponseStatus(event, 500);
      return { status: 'INVALID_TOKEN' };
    }
    await addServerLog(server.id, type, player, data);
    setResponseStatus(event, 200);
    return { status: 'OK' };
  } catch (error) {
    console.error(`🖥️❌ Error on adding server logs`, error);
    setResponseStatus(event, 500);
    return { status: 'ERROR' };
  }
});
