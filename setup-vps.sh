#!/bin/bash
# Script de mise en place initiale du VPS — a executer UNE SEULE FOIS
# Usage: bash setup-vps.sh

set -e

DOMAIN="kifo168.odns.fr"
DIR="/opt/marsai"
REPO_URL="https://github.com/TON_USERNAME/TON_REPO.git"  # <-- a renseigner

echo "[SETUP] === Installation de Docker ==="
if ! command -v docker &> /dev/null; then
    curl -fsSL https://get.docker.com | sh
    systemctl enable docker
    systemctl start docker
    echo "[SETUP] Docker installe."
else
    echo "[SETUP] Docker deja present."
fi

echo ""
echo "[SETUP] === Clonage du repo ==="
if [ ! -d "$DIR/.git" ]; then
    git clone "$REPO_URL" "$DIR"
else
    echo "[SETUP] Repo deja clone."
fi
cd "$DIR"

echo ""
echo "[SETUP] === Creation du certificat SSL ==="
echo "[SETUP] Port 80 doit etre libre. Arret de tout service existant si besoin."

docker volume create certbot_certs 2>/dev/null || true
docker volume create certbot_www 2>/dev/null || true

read -p "Email Let's Encrypt (pour les alertes d'expiration): " LETSENCRYPT_EMAIL

# Nginx temporaire pour le challenge webroot
docker run -d --name nginx-init \
  -p 80:80 \
  -v certbot_www:/var/www/certbot \
  -v "$DIR/nginx/nginx.init.conf":/etc/nginx/conf.d/default.conf:ro \
  nginx:alpine

sleep 2

docker run --rm \
  -v certbot_certs:/etc/letsencrypt \
  -v certbot_www:/var/www/certbot \
  certbot/certbot certonly \
  --webroot --webroot-path=/var/www/certbot \
  -d "$DOMAIN" \
  --email "$LETSENCRYPT_EMAIL" \
  --agree-tos --no-eff-email

docker stop nginx-init && docker rm nginx-init
echo "[SETUP] Certificat SSL obtenu."

echo ""
echo "[SETUP] === Creation du fichier .htpasswd pour PHPMyAdmin ==="
read -p "Username PHPMyAdmin: " PMA_USER
read -s -p "Password PHPMyAdmin: " PMA_PASS
echo ""
printf '%s:%s\n' "$PMA_USER" "$(openssl passwd -apr1 "$PMA_PASS")" > "$DIR/nginx/.htpasswd"
echo "[SETUP] .htpasswd cree."

echo ""
echo "[SETUP] === Creation des fichiers .env ==="
if [ ! -f "$DIR/.env" ]; then
    cat > "$DIR/.env" << 'ENVEOF'
# Variables partagees pour docker-compose.prod.yml
GHCR_OWNER=TON_USERNAME_GITHUB
DB_ROOT_PASS=CHANGE_ME_ROOT_PASS
DB_USER=marsai_user
DB_PASS=CHANGE_ME_DB_PASS
DB_NAME=marsai
ENVEOF
    echo "[SETUP] .env cree — MODIFIER les valeurs avant de continuer."
fi

if [ ! -f "$DIR/.env.backend" ]; then
    cp "$DIR/backend/.env.example" "$DIR/.env.backend"
    echo "[SETUP] .env.backend cree depuis .env.example — REMPLIR toutes les valeurs."
fi

echo ""
echo "[SETUP] ==================================================="
echo "[SETUP] ETAPES SUIVANTES :"
echo "[SETUP] 1. Editer /opt/marsai/.env (credentials DB, GHCR_OWNER)"
echo "[SETUP] 2. Editer /opt/marsai/.env.backend (JWT, email, S3, YouTube, reCAPTCHA)"
echo "[SETUP] 3. Rendre les packages GHCR publics sur GitHub (Settings > Packages)"
echo "[SETUP]    ou ajouter GHCR_TOKEN dans les secrets GitHub Actions"
echo "[SETUP] 4. Lancer: docker compose -f /opt/marsai/docker-compose.prod.yml up -d"
echo "[SETUP] 5. Importer la BDD:"
echo "[SETUP]    docker exec -i marsai-mysql mysql -u root -p\${DB_ROOT_PASS} marsai < /opt/marsai/backend/marsia.sql"
echo "[SETUP] ==================================================="
