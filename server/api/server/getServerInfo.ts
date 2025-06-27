import axios from 'axios';

const cache: Record<string, { data: any; timestamp: number }> = {};
const CACHE_TTL = 60 * 1000;

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
    console.error('❌ Error fetching server info:', error);
    if (error.response) {
      console.error('🔎 Response data:', error.response.data);
      console.error('🔎 Response status:', error.response.status);
      console.error('🔎 Response headers:', error.response.headers);
    } else if (error.request) {
      console.error('📡 No response received:', error.request);
    } else {
      console.error('⚠️ Error setting up request:', error.message);
    }
    return { error: error.message || 'Failed to fetch server info' };
  }
});
