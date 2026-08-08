FROM node:24-alpine AS dependencies

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci


FROM dependencies AS build

COPY . .
RUN npm run build

FROM node:24-alpine AS runtime-dependencies
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --omit=dev


FROM node:24-alpine AS runtime

ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=3000

WORKDIR /app

RUN addgroup --system --gid 10001 avelune \
	&& adduser --system --uid 10001 --ingroup avelune avelune

COPY --from=build --chown=avelune:avelune /app/build ./build
COPY --from=runtime-dependencies --chown=avelune:avelune /app/node_modules ./node_modules
COPY --from=build --chown=avelune:avelune /app/package.json ./package.json

USER avelune

EXPOSE 3000

CMD ["node", "build"]
