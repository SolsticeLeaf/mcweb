import axios from 'axios';

const cache: Record<string, { data: any; timestamp: number }> = {};
const CACHE_TTL = 60 * 1000; // 1 минута

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const ip = query.ip as string | undefined;
  if (!ip) {
    return { error: 'No IP provided' };
  }
  const now = Date.now();
  if (cache[ip] && now - cache[ip].timestamp < CACHE_TTL) {
    return cache[ip].data;
  }
  try {
    const [javaRes, bedrockRes] = await Promise.all([axios.get(`https://api.mcsrvstat.us/3/${ip}`), axios.get(`https://api.mcsrvstat.us/bedrock/3/${ip}`)]);
    const data = {
      java: javaRes.data,
      bedrock: bedrockRes.data,
    };
    cache[ip] = { data, timestamp: now };
    return data;
  } catch (error: any) {
    console.log(error);
    return { error: error.message || 'Failed to fetch server info' };
  }
});
