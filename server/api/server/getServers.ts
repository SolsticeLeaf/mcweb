import { connectDB } from '../database/MongoDB';
import { getServers } from '../interfaces/Server';

export default defineEventHandler(async (event) => {
  try {
    await connectDB();
    return { servers: await getServers() };
  } catch (error) {
    console.error('❌ Error fetching servers:', error);
    return { servers: [] };
  }
});
