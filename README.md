# 인스타모아 (InstagramMoa)

Instagram 사용자 프로필 피드를 백엔드에서 수집해 미디어 정보를 MariaDB와 파일 저장소에 보관하고, 브라우저에서 이미지 갤러리로 보여주는 웹 애플리케이션입니다.

화면에서 확인되는 사용 시나리오는 프로필 게시물 이미지를 한 화면에서 이어서 살펴보는 것입니다. 현재 API와 수집 작업이 연결된 범위는 사용자 프로필이며, 게시물·해시태그 입력을 완성된 검색 기능으로 제공하지 않습니다.

## 기술 스택

| 영역 | 기술 | 코드에서 맡는 역할 |
| --- | --- | --- |
| API·작업자 | NestJS 10, TypeScript | HTTP API와 별도로 실행하는 수집 CLI |
| 데이터 | MariaDB, TypeORM | 사용자·게시물·미디어·작업 큐와 피드 커서 저장 |
| 외부 통신 | Axios | 설정된 프록시 API 및 미디어 다운로드 요청 |
| 웹 화면 | Nuxt 2, Vue 2, BootstrapVue | 검색 화면과 클라이언트 측 이미지 갤러리 |
| 운영 | Winston, Telegram Bot API | 날짜별 파일 로그와 작업 알림 |
| 실행 | Node.js 18 기반 Dockerfile, Yarn 1 | 백엔드·프런트엔드 패키지 실행 |

작업 큐는 MariaDB의 `Queue` 엔티티와 폴링 코드로 구현되어 있습니다. `bull` 패키지는 의존성에 있지만 현재 큐 처리 흐름에는 사용되지 않습니다.

## 처리 흐름

1. 브라우저가 `POST /api/search`로 프로필을 검색합니다.
2. 백엔드는 프로필 레코드를 확인하고, 새 프로필이면 MariaDB 큐에 작업을 등록합니다.
3. 별도 CLI 작업자가 큐를 읽고 `PROXY_API`를 통해 프로필과 피드 페이지를 요청합니다.
4. 수집 응답은 사용자·게시물·파일 레코드로 매핑됩니다. 피드 커서와 추가 페이지 여부는 큐에 저장하고, 미디어 파일은 `/app/storage/files`에 저장합니다.
5. 브라우저는 `POST /api/files`로 이미지 12개씩 받아 열 형태의 갤러리에 추가합니다. 로컬 이미지 URL 또는 `GET /api/images` 프록시 URL을 사용합니다.

첫 검색은 작업자가 사용자 정보를 처리하고 상태를 기록할 때까지 API가 기다립니다. 코드는 1초 간격으로 최대 60초 동안 상태를 확인하므로, 이 흐름은 완전한 비동기 요청·응답이 아닙니다.

## 구현 근거와 현재 제약

- [FileService](back/src/provided-modules/file/file.service.ts)는 검색어를 사용자·게시물 모드로 분기하고, 사용자 검색 후 초기 수집 상태를 폴링합니다. 해시태그 모드는 처리 분기에 없습니다. 게시물 모드는 레코드를 만들지만 수집 큐 등록은 주석 처리되어 있습니다.
- [CustomQueueManageService](back/src/provided-modules/custom-queue-manage/custom-queue-manage.service.ts)는 `priority` 오름차순, 같은 우선순위에서는 `seq` 오름차순으로 작업을 선택합니다. [FeedScrapService](back/src/provided-modules/feed-scrap/feed-scrap.service.ts)는 `max_id`와 `more_available`을 저장해 피드 페이지를 이어서 처리합니다.
- [FileScrapService](back/src/provided-modules/file-scrap/file-scrap.service.ts)는 이미지 다운로드를 최대 5개씩 처리하고 동영상은 순차 처리합니다. [index.vue](front/pages/index.vue)는 페이지 응답을 화면 열의 높이에 따라 배치합니다. 현재 화면은 `imageUrl`을 표시하며 동영상 재생 UI는 확인되지 않습니다.
- TypeORM의 `synchronize`는 꺼져 있습니다. 저장소에는 데이터베이스 서비스나 마이그레이션이 없어, 호환 스키마가 준비된 MariaDB가 필요합니다.
- `PROXY_API`가 가리키는 `/proxy`, `/changeIp` 서비스는 이 저장소에 포함되어 있지 않습니다. Instagram 응답 형식이나 접근 제한이 바뀌면 수집이 영향을 받을 수 있습니다.
- Compose 구성에도 MariaDB나 큐 작업자 서비스가 없습니다. `database_default` 외부 Docker 네트워크가 필요합니다. 개발 Compose는 백엔드에 `back.prod.Dockerfile`을 사용하면서 `./back` 전체를 컨테이너 `/app`에 마운트합니다. 프런트엔드 Dockerfile은 `yarn dev`를 실행하며 운영 Compose에서도 같은 파일을 사용합니다. 따라서 저장소만으로 재현 가능한 배포 구성으로 검증된 상태는 아닙니다.

## 프로젝트 구조

```text
.
├── back/
│   ├── src/
│   │   ├── configures/             # 환경 변수와 TypeORM 옵션
│   │   ├── database/               # 데이터베이스 연결
│   │   ├── dto/                    # API DTO
│   │   ├── entities/               # TypeORM 엔티티
│   │   ├── errors/                 # 업무 예외 코드
│   │   ├── libraries/winston/      # Winston 로거
│   │   ├── provided-modules/       # 검색, 수집, 큐, 미디어 모듈
│   │   ├── main.ts                 # API 진입점
│   │   └── console.ts              # CLI 진입점
│   ├── test/                       # E2E 예제
│   ├── .env.sample
│   └── package.json
├── front/
│   ├── pages/index.vue             # 검색·갤러리 화면
│   ├── components/                 # Vue 컴포넌트
│   ├── layouts/                    # Nuxt 레이아웃
│   ├── plugins/                    # Axios 설정
│   ├── static/                     # 정적 파일
│   ├── store/                       # Nuxt 기본 안내 파일
│   ├── ecosystem.config.js         # PM2 설정
│   ├── deploy.example.sh           # 배포 예시
│   ├── .env.sample
│   └── package.json
├── http/                           # HTTP Client 요청 예제
├── .env.sample                     # Docker Compose 변수 예제
├── docker-compose.dev.yml
├── docker-compose.prd.yml
├── back.dev.Dockerfile
├── back.prod.Dockerfile
└── front.Dockerfile
```

## API 예시

백엔드 기본 포트는 `3000`입니다.

```bash
curl -X POST http://localhost:3000/api/search \
  -H 'Content-Type: application/json' \
  -d '{"keyword":"dlwlrma"}'
```

검색 응답의 `seq`로 사용자 파일을 페이지 단위로 조회합니다.

```bash
curl -X POST http://localhost:3000/api/files \
  -H 'Content-Type: application/json' \
  -d '{"mode":"user","seq":"<검색 응답의 seq>","page":1}'
```

| 메서드 | 경로 | 코드에서 확인되는 동작 |
| --- | --- | --- |
| `POST` | `/api/search` | 사용자 검색 및 수집 상태 반환 |
| `POST` | `/api/files` | 사용자 파일 목록 반환. 페이지 크기는 12개 |
| `GET` | `/api/images` | URL에 `.cdninstagram.com/`이 있는지 확인하고 로컬 파일을 반환하거나 다운로드 |
| `GET` | `/api/ip-change` | 프록시 서비스의 IP 변경 기능 호출 |

`/api/search` 응답에는 `mode`, `key`, `seq`, `status`가 있습니다. 사용자 프로필 상태 `101`은 수집 진행 중, `200`은 완료를 뜻합니다. 업무 오류 코드는 응답 본문의 `status`에 기록되며 `MoaException`은 HTTP 상태를 `200`으로 반환합니다. 또한 최초 검색의 대기 조건은 사용자 상태가 `100`보다 큰 경우뿐이라, 수집이 실패한 경로에서 오류 상태가 즉시 반환된다고 보장할 수 없습니다.

`GET /api/ip-change`에는 인증 가드가 확인되지 않습니다. 공개 환경에서는 네트워크 경계에서 접근을 제한해야 합니다. 요청 예시는 [`http/search.http`](http/search.http)에 있습니다.

## 로컬 실행 전제

저장소만으로 바로 실행할 수 있는 상태는 아닙니다. 실행에는 Node.js 18 계열과 Yarn, 호환 테이블이 준비된 MariaDB, `PROXY_API` 구현이 필요합니다. Docker Compose를 쓰려면 기존 `database_default` 네트워크와 외부 DB도 준비해야 합니다.

환경 예시를 복사합니다.

```bash
cp .env.sample .env
cp back/.env.sample back/.env
cp front/.env.sample front/.env
```

- 루트 `.env`는 Compose 포트와 저장소 호스트 경로를 설정합니다.
- `back/.env`에는 `MYSQL_HOST`, `MYSQL_PORT`, `MYSQL_DATABASE`, `MYSQL_USERNAME`, `MYSQL_PASSWORD`, `PROXY_API`, `LOG_PATH`, `ENV`를 설정합니다. Telegram 알림을 사용하려면 `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID`도 설정합니다.
- `front/.env`의 `ENV`는 프런트엔드가 선택하는 API 도메인을 결정합니다.

백엔드 API 실행:

```bash
cd back
yarn install
yarn start:dev
```

별도 터미널에서 수집 작업자 실행:

```bash
cd back
yarn console:dev server
```

프런트엔드 실행:

```bash
cd front
yarn install
yarn dev
```

프런트엔드는 `ENV=prd`이면 운영 API 도메인, 그 외에는 개발 API 도메인을 코드에서 직접 사용합니다. 로컬 프런트엔드가 `localhost:3000` 백엔드로 자동 연결되지 않으므로 로컬 통합 실행에는 API 주소 설정을 코드에서 분리하는 작업이 필요합니다.

## 테스트와 공개 전 확인

- 백엔드 스크립트에는 `yarn test`, `yarn test:e2e`가 정의되어 있습니다. `back/src`에서 단위 테스트는 확인되지 않습니다.
- 현재 E2E 예제는 루트 `GET /`에서 `Hello World!`를 기대하지만, `AppModule`에는 해당 라우트가 없습니다. 이 테스트가 통과한다고 현재 API가 검증되는 것은 아닙니다.
- `GET /api/ip-change`에 인증 가드가 없고, `main.ts`는 출처 제한 없이 CORS를 활성화합니다. 공개 배포 전 접근 제어가 필요합니다.
- Instagram 세션 값이 백엔드 소스에 직접 포함되어 있습니다. 공개 저장소로 사용하기 전 해당 값을 제거하고 교체해야 합니다. README에는 값을 복사하지 않았습니다.
- 저장소에 `LICENSE`가 없어 라이선스가 명시되지 않았습니다.

## 개선 후보

1. DB 마이그레이션·초기화 절차와 로컬 실행 가능한 외부 연동 대체 구성을 추가합니다.
2. 실제 API 동작을 검증하는 단위·E2E 테스트를 작성하고 기존 루트 라우트 테스트를 갱신합니다.
3. 검색 오류 상태가 대기 루프에서 종료되도록 처리하고, API·작업자 간 비동기 상태 전달 방식을 정리합니다.
4. 프런트엔드 API 주소와 인증 정보를 안전한 실행 설정으로 분리합니다.
5. 게시물·해시태그 검색을 구현하거나 미지원 입력을 명시적으로 거절합니다.
