import initialConfig from '~/config/initial.config';
import { S3Client, HeadObjectCommand, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import fetch from 'node-fetch';

const skinRenderApi = initialConfig.skinRenderApi;
const endpoint = process.env.S3_ENDPOINT || 'https://s3.twcstorage.ru';
const region = process.env.S3_REGION || 'ru-1';
const accessKey = process.env.S3_ACCESS_KEY || 'null';
const secretKey = process.env.S3_SECRET_KEY || 'null';
const bucket = process.env.S3_BUCKET || 'null';

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000;
const CACHE_TTL = 12 * 60 * 60 * 1000;

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

function getS3Key(player: string, render: string, type: string) {
  return `skins/${render}/${player}/${type}.png`;
}

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const player = query.player as string;
  const render = query.render as string;
  const type = query.type as string;

  if (!player || !render || !type) {
    return { error: 'Missing required parameters' };
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

  const key = getS3Key(player, render, type);
  let needUpdate = false;
  let fileExists = false;
  let lastModified = 0;
  try {
    const head = await s3.send(
      new HeadObjectCommand({
        Bucket: bucket,
        Key: key,
      })
    );
    fileExists = true;
    lastModified = head.LastModified ? new Date(head.LastModified).getTime() : 0;
    if (Date.now() - lastModified > CACHE_TTL) {
      needUpdate = true;
    }
  } catch (e) {
    fileExists = false;
    needUpdate = true;
    console.error('❌ S3 HeadObject error:', e);
  }
  const returnUrl = `${initialConfig.s3Link}/${getS3Key(player, render, type)}`;
  if (fileExists && !needUpdate) {
    (async () => {
      if (needUpdate) {
        const url = `${skinRenderApi}/${render}/${player}/${type}`;
        try {
          const imageBuffer = await fetchWithRetry(url);
          await s3.send(
            new PutObjectCommand({
              Bucket: bucket,
              Key: key,
              Body: imageBuffer,
              ContentType: 'image/png',
              ACL: 'public-read',
            })
          );
        } catch (e) {
          console.error('⚠️ Background skin update error:', e);
        }
      }
    })();
    return { url: returnUrl };
  }
  if (needUpdate) {
    const url = `${skinRenderApi}/${render}/${player}/${type}`;
    let imageBuffer: Buffer;
    try {
      imageBuffer = await fetchWithRetry(url);
    } catch (e) {
      console.error('❌ Failed to fetch skin from render API:', e);
      return { error: 'Failed to fetch skin from render API' };
    }
    try {
      await s3.send(
        new PutObjectCommand({
          Bucket: bucket,
          Key: key,
          Body: imageBuffer,
          ContentType: 'image/png',
          ACL: 'public-read',
        })
      );
    } catch (e) {
      console.error('❌ S3 PutObject error:', e);
      return { error: 'Failed to upload skin to S3' };
    }
  }
  return { url: returnUrl };
});
