import { connectDB } from '~/server/api/database/MongoDB';
import { getLogs } from '../interfaces/ServerLog';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { amount, serverId, player } = body;
  try {
    await connectDB();
    setResponseStatus(event, 200);
    return { status: 'OK', data: await getLogs(amount, serverId, player) };
  } catch (error) {
    console.error(`🖥️❌ Error on getting server logs:`, error);
    setResponseStatus(event, 500);
    return { status: 'ERROR', data: [] };
  }
});
