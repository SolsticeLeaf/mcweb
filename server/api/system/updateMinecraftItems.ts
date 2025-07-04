import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { connectDB } from '~/server/api/database/MongoDB';
import { getServerByToken } from '../interfaces/Server';
import fetch from 'node-fetch';

const endpoint = process.env.S3_ENDPOINT || 'https://s3.twcstorage.ru';
const region = process.env.S3_REGION || 'ru-1';
const accessKey = process.env.S3_ACCESS_KEY || 'null';
const secretKey = process.env.S3_SECRET_KEY || 'null';
const bucket = process.env.S3_BUCKET || 'null';

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000;

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchWithRetry(url: string, retries = MAX_RETRIES): Promise<Buffer> {
  let lastError;
  for (let i = 0; i < retries; i++) {
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return Buffer.from(await res.arrayBuffer());
    } catch (err) {
      lastError = err;
      await sleep(RETRY_DELAY);
    }
  }
  throw lastError;
}

function getS3Key(version: string, itemName: string) {
  return `items/${version}/${itemName}.png`;
}

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const version = query.version as string;
  if (!version) {
    return { error: 'Missing version parameter' };
  }
  await connectDB();
  const token = getRequestHeader(event, 'authorization');
  const server = await getServerByToken(token);
  if (server === null) {
    setResponseStatus(event, 500);
    return { status: 'INVALID_TOKEN' };
  }

  const itemsUrl = `https://mc.nerothe.com/json/ids_${version}.json`;
  let itemIds: string[] = [];
  try {
    const res = await fetch(itemsUrl);
    if (!res.ok) throw new Error(`Failed to fetch item IDs: HTTP ${res.status}`);
    itemIds = (await res.json()) as string[];
  } catch (e) {
    return { error: `Failed to fetch item IDs "${itemsUrl}": ${e}` };
  }

  const s3 = new S3Client({
    endpoint: endpoint,
    region: region,
    credentials: {
      accessKeyId: accessKey,
      secretAccessKey: secretKey,
    },
    forcePathStyle: true,
  });

  let uploaded = 0;
  let failed: string[] = [];

  for (let i = 0; i < itemIds.length; i++) {
    const itemName = itemIds[i];
    const cleanName = itemName.replace('minecraft:', '');
    const imgUrl = `https://mc.nerothe.com/img/${version}/minecraft_${cleanName}.png`;
    let imageBuffer: Buffer;
    const progress = `(${i + 1}/${itemIds.length})`;
    try {
      imageBuffer = await fetchWithRetry(imgUrl);
    } catch (e) {
      console.error(`❌ Failed to fetch image for item: ${itemName} ${progress} (${imgUrl})`, e);
      failed.push(itemName);
      continue;
    }
    try {
      await s3.send(
        new PutObjectCommand({
          Bucket: bucket,
          Key: getS3Key(version, cleanName),
          Body: imageBuffer,
          ContentType: 'image/png',
          ACL: 'public-read',
        })
      );
      uploaded++;
      console.log(`✅ Uploaded: ${itemName} ${progress} as ${getS3Key(version, cleanName)}`);
    } catch (e) {
      console.error(`🚫 Failed to upload to S3 for item: ${itemName} ${progress} (${getS3Key(version, cleanName)})`, e);
      failed.push(itemName);
    }
  }

  if (failed.length > 0) {
    console.warn(`⚠️ Failed items:`, failed);
  }
  console.log(`🎉 Upload complete. Uploaded: ${uploaded}, Failed: ${failed.length}, Total: ${itemIds.length}`);

  return {
    status: 'OK',
    uploaded,
    failed,
    total: itemIds.length,
  };
});
