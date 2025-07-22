import { connectDB } from '~/server/api/database/MongoDB';
import { getLogs } from '../interfaces/ServerLog';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { amount } = body;
  try {
    await connectDB();
    setResponseStatus(event, 200);
    return { status: 'OK', data: await getLogs(Number(amount)) };
  } catch (error) {
    console.error(`🖥️❌ Error on getting server logs:`, error);
    setResponseStatus(event, 500);
    return { status: 'ERROR', data: [] };
  }
});
