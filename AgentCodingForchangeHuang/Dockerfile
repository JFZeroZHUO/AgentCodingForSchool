FROM registry.forchange.cn/public/node:20-forchange as builder
ARG APP_ENV
WORKDIR /apps
ADD . /apps
RUN pnpm install
RUN pnpm run build

FROM registry.forchange.cn/public/node:20-forchange
WORKDIR /app
ENV HOME=/home/node
ENV NODE_ENV=production

# 复制 standalone 输出
COPY --from=builder /apps/.next/standalone ./
COPY --from=builder /apps/.next/static ./.next/static
COPY --from=builder /apps/public ./public

RUN chgrp -R 0 /home/node && chmod -R g=u /home/node
EXPOSE 8080

ENV PORT=8080
ENV HOSTNAME=0.0.0.0

CMD ["node", "server.js", "--port", "8080"]
