import mcs from 'node-mcstatus';
import { connectDB } from '../database/MongoDB';
import { getServerByIp, getServers } from '../interfaces/Server';

const cache: Record<string, { data: any; timestamp: number }> = {};
const CACHE_TTL = 10 * 1000;

async function backgroundUpdateCache() {
  try {
    await connectDB();
    const servers = await getServers();
    for (const server of servers) {
      const ip = server.ip;
      if (!ip) continue;
      const splitIp = ip.split(':');
      try {
        const [java, bedrock, online] = await Promise.all([
          mcs.statusJava(splitIp[0] || ip, Number(splitIp[1] || '25565')).catch(() => ({ online: false })),
          mcs.statusBedrock(splitIp[0] || ip, Number(splitIp[1] || '25565')).catch(() => ({ online: false })),
          (await getServerByIp(ip))?.online,
        ]);
        const data = { java, bedrock, online };
        cache[ip] = { data, timestamp: Date.now() };
      } catch (error) {
        console.error(`❌ Error fetching server "${server.name}" info:`, error);
      }
    }
  } catch (error) {
    console.error('❌ Error on background fetching servers info:', error);
  }
}
setInterval(backgroundUpdateCache, CACHE_TTL);

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const ip = query.ip as string | undefined;
  if (!ip) {
    return { error: 'No IP provided' };
  }
  if (cache[ip]) {
    return cache[ip].data;
  }
  try {
    const splitIp = ip.split(':');
    const [java, bedrock, online] = await Promise.all([
      mcs.statusJava(splitIp[0] || ip, Number(splitIp[1] || '25565')).catch((error) => {
        console.error(`🛑 Error fetching Java server ${ip} info:`, error);
        return { online: false };
      }),
      mcs.statusBedrock(splitIp[0] || ip, Number(splitIp[1] || '25565')).catch((error) => {
        console.error(`🛑 Error fetching Bedrock server ${ip} info:`, error);
        return { online: false };
      }),
      (await getServerByIp(ip))?.online,
    ]);
    const data = { java, bedrock, online };
    cache[ip] = { data, timestamp: Date.now() };
    return data;
  } catch (error) {
    console.error('❌ Unexpected error fetching server info:', error);
    return { error: (error as any).message || 'Failed to fetch server info' };
  }
});
