import { connectDB } from '../database/MongoDB';
import { getPlayerByUsername } from '../interfaces/Player';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { player } = body;
  try {
    await connectDB();
    const returnPlayer = await getPlayerByUsername(player);
    if (returnPlayer === undefined) {
      return { status: 'NOT_FOUND', player: {} };
    }
    returnPlayer.money = 0;
    return { status: 'OK', player: returnPlayer };
  } catch (error) {
    return { status: 'ERR', player: {} };
  }
});
