# interpark-ticket-watcher

인터파크 취소표 watcher

## 사용법

```bash
$ npm install
```

```bash
$ npm start -- \
--goods-code [상품코드] 
--place-code [공연장 코드] 
--play-seq [회차번호] 
--username [인터파크 ID] 
--password [인터파크 비밀번호] 
--slack-webhook-url [슬랙 웹 훅 URL]
--poll-interval-millis [폴링 간격] 
--capture-regex [잡을 좌석 정규식]
```

예시:

```bash
$ npm start -- \
--goods-code 22003760 
--place-code 20000611 
--play-seq 001 
--username myId
--password myPassword@907 
--slack-webhook-url https://hooks.slack.com/services/1/2/3 
--poll-interval-millis 200 
--capture-regex ^[ABC](7|8|9|10|11|12|13)$
```
