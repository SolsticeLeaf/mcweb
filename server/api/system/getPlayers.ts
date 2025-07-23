import { connectDB } from '~/server/api/database/MongoDB';
import { getPlayers, Player } from '../interfaces/Player';
import { getServers, Server } from '../interfaces/Server';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { amount } = body;
  try {
    await connectDB();
    const [allPlayers, servers] = await Promise.all([getPlayers(amount), getServers()]);
    let players: any[] = [];
    for (const player of allPlayers) {
      players.push({
        username: player.username,
        online: isPlayerOnline(player, servers),
      });
    }
    setResponseStatus(event, 200);
    return { status: 'OK', players: players };
  } catch (error) {
    console.error(`🖥️❌ Error on getting project players:`, error);
    setResponseStatus(event, 500);
    return { status: 'ERROR', players: [] };
  }
});

function isPlayerOnline(player: Player, servers: Server[]): boolean {
  const username = player.username;
  for (const server of servers) {
    if (server.online.includes(username)) {
      return true;
    }
  }
  return false;
}
