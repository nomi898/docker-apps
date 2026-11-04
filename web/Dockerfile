# ---------- Stage 1: build the app with Node ----------
    FROM node:26-alpine AS build

    WORKDIR /app
    
    COPY package.json package-lock.json ./
    
    RUN npm ci
    
    COPY . .
    
    RUN npm run build
    
    
    # ---------- Stage 2: serve the files with Nginx ----------
    FROM nginx:1.30-alpine
    
    COPY nginx.conf /etc/nginx/conf.d/default.conf
    
    COPY --from=build /app/dist /usr/share/nginx/html
    
    EXPOSE 80
    
    # nginx image already has the right CMD, so we don't need one