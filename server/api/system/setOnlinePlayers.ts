import { connectDB } from '~/server/api/database/MongoDB';
import { getServerByToken, setOnline } from '../interfaces/Server';

export interface Data {
  username: string;
  health: number;
  food: number;
  inventory: Array<object>;
}

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { players } = body;
  const token = getRequestHeader(event, 'authorization');
  try {
    await connectDB();
    const server = await getServerByToken(token);
    if (server === null) {
      setResponseStatus(event, 500);
      return { status: 'INVALID_TOKEN' };
    }
    await setOnline(server._id, players);
    setResponseStatus(event, 200);
    return { status: 'OK' };
  } catch (error) {
    console.error(`🖥️❌ Error on setting online players:`, error);
    setResponseStatus(event, 500);
    return { status: 'ERROR' };
  }
});
