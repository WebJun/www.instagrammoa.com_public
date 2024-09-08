https://iter.kr/우분투-nvm-node-js-설치-설정/  
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | zsh  

nvm install 18.17.0  
nvm use 18.17.0  
nvm alias default 18.17.0  

Node v18.17.0 (LTS)  

npm install -g yarn  

### 실서버
docker compose -f docker-compose.prd.yml down  
docker compose -f docker-compose.prd.yml up -d  

docker restart wwwinstagrammoacom-prdback.com-1  
docker exec -it wwwinstagrammoacom-prdback.com-1 yarn console:dev server  
docker exec -d wwwinstagrammoacom-prdback.com-1 yarn console:dev server  

docker logs wwwinstagrammoacom-prdback.com-1 -f  
docker logs wwwinstagrammoacom-prdfront.com-1 -f  


### 개발서버
docker compose -f docker-compose.dev.yml down  
docker compose -f docker-compose.dev.yml up -d  

docker restart devinstagrammoacom-devback.com-1  
docker exec -it devinstagrammoacom-devback.com-1 yarn console:dev server  
docker exec -d devinstagrammoacom-devback.com-1 yarn console:dev server  

docker logs devinstagrammoacom-devback.com-1 -f  
docker logs devinstagrammoacom-devfront.com-1 -f  

### 재배포
docker exec -it wwwinstagrammoacom-prdfront.com-1 yarn build  
pm2 restart all  



### 파티셔닝 추가
```
ALTER TABLE `file` DROP PRIMARY KEY, ADD PRIMARY KEY (`seq`, `createdAt`);
ALTER TABLE `file`
PARTITION BY RANGE (TO_DAYS(`createdAt`)) (
    PARTITION p202402 VALUES LESS THAN (TO_DAYS('2024-02-01')),
    PARTITION p202403 VALUES LESS THAN (TO_DAYS('2024-03-01')),
    PARTITION p202404 VALUES LESS THAN (TO_DAYS('2024-04-01')),
    PARTITION p202405 VALUES LESS THAN (TO_DAYS('2024-05-01')),
    PARTITION p202406 VALUES LESS THAN (TO_DAYS('2024-06-01')),
    PARTITION p202407 VALUES LESS THAN (TO_DAYS('2024-07-01')),
    PARTITION p202408 VALUES LESS THAN (TO_DAYS('2024-08-01')),
    PARTITION p202409 VALUES LESS THAN (TO_DAYS('2024-09-01')),
	PARTITION p202410 VALUES LESS THAN (TO_DAYS('2024-10-01')),
	PARTITION p202411 VALUES LESS THAN (TO_DAYS('2024-11-01')),
	PARTITION p202412 VALUES LESS THAN (TO_DAYS('2024-12-01')),
    PARTITION p_future VALUES LESS THAN MAXVALUE
);
ALTER TABLE `post`
DROP PRIMARY KEY,
ADD PRIMARY KEY (`seq`, `createdAt`);
ALTER TABLE `post`
PARTITION BY RANGE (TO_DAYS(`createdAt`)) (
    PARTITION p202402 VALUES LESS THAN (TO_DAYS('2024-02-01')),
    PARTITION p202403 VALUES LESS THAN (TO_DAYS('2024-03-01')),
    PARTITION p202404 VALUES LESS THAN (TO_DAYS('2024-04-01')),
    PARTITION p202405 VALUES LESS THAN (TO_DAYS('2024-05-01')),
    PARTITION p202406 VALUES LESS THAN (TO_DAYS('2024-06-01')),
    PARTITION p202407 VALUES LESS THAN (TO_DAYS('2024-07-01')),
    PARTITION p202408 VALUES LESS THAN (TO_DAYS('2024-08-01')),
    PARTITION p202409 VALUES LESS THAN (TO_DAYS('2024-09-01')),
	PARTITION p202410 VALUES LESS THAN (TO_DAYS('2024-10-01')),
	PARTITION p202411 VALUES LESS THAN (TO_DAYS('2024-11-01')),
	PARTITION p202412 VALUES LESS THAN (TO_DAYS('2024-12-01')),
    PARTITION p_future VALUES LESS THAN MAXVALUE
);
```

### 파티셔닝 제거
```
ALTER TABLE `file` REMOVE PARTITIONING;
ALTER TABLE `post` REMOVE PARTITIONING;
```
