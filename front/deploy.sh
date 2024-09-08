#!/bin/bash

docker restart wwwinstagrammoacom-prdback.com-1
# docker restart devinstagrammoacom-devback.com-1
docker exec -d wwwinstagrammoacom-prdback.com-1 yarn console:dev server
# docker exec -d devinstagrammoacom-devback.com-1 yarn console:dev server

docker exec -it wwwinstagrammoacom-prdfront.com-1 yarn build
cd /vol/hdd1/var/www/www.instagrammoa.com/front
pm2 start /vol/hdd1/var/www/www.instagrammoa.com/front/ecosystem.config.js
