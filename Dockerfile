FROM node:23

COPY /.output /nuxt/.output
COPY ./config /nuxt/config
COPY ./i18n /nuxt/i18n

ENV NUXT_HOST=0.0.0.0
ENV NUXT_PORT=4440

EXPOSE 4440

ENV NODE_ENV=production

CMD ["node", "/nuxt/.output/server/index.mjs"]
