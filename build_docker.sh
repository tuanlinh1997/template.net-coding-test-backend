docker compose down
docker build --network host -t api-smart-cms .
docker compose up -d
docker exec api_smart_cms chmod -R 775 /var/www/api_smart_cms/public
