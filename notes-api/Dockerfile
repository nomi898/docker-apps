# 1. Start from an official Node.js image (LTS, small Alpine variant)
FROM node:26-alpine
# 2. Production mode makes some libraries faster and quieter
ENV NODE_ENV=production
# 3. All following commands run inside /app
WORKDIR /app
# 4. Copy only the dependency list first, so this layer is cached
COPY package.json package-lock.json ./
RUN npm ci --omit=dev
# 5. Now copy the source code
COPY . .
# 6. Don't run as root: the image already has a user called "node"
USER node
# 7. Document the port and tell Docker how to check health
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=3s --retries=3 \
CMD wget -qO- http://localhost:3000/health || exit 1
# 8. The command that starts the app
CMD ["node", "server.js"]