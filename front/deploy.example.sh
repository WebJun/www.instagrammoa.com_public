#!/bin/bash

docker exec -d wwwinstagrammoacom-prdback.com-1 yarn console:dev server

docker exec -it wwwinstagrammoacom-prdfront.com-1 yarn build
cd {{PATH}}/front
pm2 start {{PATH}}/front/ecosystem.config.js
