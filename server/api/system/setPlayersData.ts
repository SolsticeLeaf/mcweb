import { connectDB } from '~/server/api/database/MongoDB';
import { hasToken } from '../interfaces/ServerToken';
import { setPlayersData } from '../interfaces/Player';

export interface Data {
  username: string;
  health: number;
  food: number;
}

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { server, data } = body;
  const token = getRequestHeader(event, 'authorization');
  try {
    await connectDB();
    if (!(await hasToken(token))) {
      setResponseStatus(event, 500);
      return { status: 'INVALID_TOKEN' };
    }
    await Promise.all(
      data.array.map((player: Data) =>
        setPlayersData(player.username, server, player.food, player.health).catch((error) => {
          console.error(`🖥️❌ Error on setPlayersData on ${player.username}:`, error);
        })
      )
    );
    setResponseStatus(event, 200);
    return { status: 'OK' };
  } catch (error) {
    console.error(`🖥️❌ Error on settings players data:`, error);
    setResponseStatus(event, 500);
    return { status: 'ERROR' };
  }
});
