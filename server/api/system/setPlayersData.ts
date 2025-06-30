import { connectDB } from '~/server/api/database/MongoDB';
import { setPlayersData } from '../interfaces/Player';
import { getServerByToken } from '../interfaces/Server';

export interface Data {
  username: string;
  health: number;
  food: number;
  inventory: Array<object>;
}

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { data } = body;
  const token = getRequestHeader(event, 'authorization');
  try {
    await connectDB();
    const server = await getServerByToken(token);
    if (server === null) {
      setResponseStatus(event, 500);
      return { status: 'INVALID_TOKEN' };
    }
    await Promise.all(
      data.map((player: Data) =>
        setPlayersData(player.username, server, player.food, player.health, player.inventory).catch((error) => {
          console.error(`🖥️❌ Error on setPlayersData on ${player.username}:`, error);
        })
      )
    );
    setResponseStatus(event, 200);
    return { status: 'OK' };
  } catch (error) {
    console.error(`🖥️❌ Error on setting players data:`, error);
    setResponseStatus(event, 500);
    return { status: 'ERROR' };
  }
});
