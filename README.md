# 보험 보장분석 랜딩페이지

고객이 **전화번호, 생년월일, 성별**을 남기면, 그 내용이 **zoocci@naver.com**으로 메일로 도착하는 페이지입니다.

IT를 몰라도 아래 순서만 따라 하시면 됩니다. 컴퓨터에 프로그램을 설치하는 과정이 조금 있습니다.

---

## 이 페이지가 하는 일

1. 블로그에 이 사이트 주소를 올립니다.
2. 방문자가 폼에 전화번호, 생년월일, 성별을 적고 신청합니다.
3. 같은 내용이 `zoocci@naver.com` 메일함으로 옵니다.
4. 메일을 보고 그 번호로 전화를 걸어 상담하시면 됩니다.

메일이 오지 않으면 **스팸함**도 꼭 확인해 주세요.

---

## 블로그에 넣을 링크

Vercel 배포가 끝나면 주소 뒤에 경로만 바꾸면 됩니다.

| 용도 | 링크 |
|------|------|
| PC / 일반 | `https://(배포주소)` |
| 모바일 전용 | `https://(배포주소)/m` |

예: 배포 주소가 `https://insurance-landing.vercel.app` 이면

- PC: `https://insurance-landing.vercel.app`
- 모바일: `https://insurance-landing.vercel.app/m`

지금 컴퓨터에서 모바일 화면만 보려면 폴더의 `preview-mobile.html`을 열면 됩니다.

---

## 상단 메뉴

- **보장분석상담**: 메인 페이지. 상담 신청 + 직접 올린 자료
- **보상**: 누르면 **질병**, **상해**가 나옵니다
- **카테고리**: 별도 페이지 (내용은 나중에 채울 수 있습니다)

## 보장분석 파일 올리기

보상 메뉴와 따로, 보장분석 자료만 올리는 화면입니다.

1. 주소: `https://(배포주소)/admin`
2. 비밀번호: Vercel 환경변수 `ADMIN_PASSWORD` (처음에는 `changeme`로 두었습니다. 꼭 바꾸세요)
3. 파일을 선택하고 올리면 메인 페이지 **보장분석 자료**에 보입니다

미리보기에서 메뉴를 보려면 `preview.html`을 열고 상단 **보상**을 눌러 보세요.

---

## 준비물 (무료)

아래 3개 계정이 필요합니다. 모두 무료입니다.

| 순서 | 무엇을 | 어디서 |
|------|--------|--------|
| 1 | GitHub 계정 | https://github.com |
| 2 | Vercel 계정 | https://vercel.com |
| 3 | Resend 계정 (메일 보내기용) | https://resend.com |

Vercel은 사이트를 인터넷에 올리는 서비스입니다.  
Resend는 “고객 신청 내용을 내 네이버 메일로 보내 주는” 서비스입니다.

---

## 1단계. GitHub에 이 폴더 올리기

Vercel은 보통 GitHub에 있는 코드를 가져와 배포합니다.

1. https://github.com 에서 회원가입 후 로그인합니다.
2. 오른쪽 위 **+** → **New repository** 를 누릅니다.
3. Repository name은 예: `insurance-landing`
4. Public 또는 Private 아무거나 선택합니다.
5. **Create repository** 를 누릅니다.

그다음, 이 프로젝트 폴더를 GitHub에 올립니다.

### 방법 A. Cursor에서 올리기 (추천)

1. Cursor 왼쪽에서 소스 제어(나뭇가지 모양)를 엽니다.
2. 처음이면 Git 초기화를 하라는 안내가 나오면 그대로 진행합니다.
3. 변경 사항에 메시지(예: `첫 랜딩페이지`)를 적고 **Commit** 합니다.
4. **Publish Branch** 또는 GitHub에 게시를 누른 뒤, 방금 만든 저장소를 선택합니다.

### 방법 B. GitHub 웹사이트에 파일 직접 올리기

1. GitHub 저장소 화면에서 **uploading an existing file** 을 누릅니다.
2. 이 폴더 안의 파일들을 드래그해서 올립니다.  
   (`node_modules`, `.next` 폴더는 올리지 마세요. 없어도 됩니다.)
3. **Commit changes** 를 누릅니다.

---

## 2단계. Resend에서 메일 보내기 키 받기

1. https://resend.com 에 가입하고 로그인합니다.
2. 왼쪽 메뉴 **API Keys** 로 갑니다.
3. **Create API Key** 를 누릅니다.
4. 이름은 `landing` 정도로 적고 생성합니다.
5. 나타나는 키(`re_` 로 시작)를 **메모장에 복사**해 둡니다.  
   이 화면을 닫으면 다시 안 보일 수 있습니다.

처음에는 Resend가 제공하는 테스트 발신 주소(`beth.t@example.com`)로 메일을 보냅니다.  
받는 사람은 `zoocci@naver.com` 입니다.

---

## 3단계. Vercel로 배포하기 (가장 중요)

1. https://vercel.com 에 들어가 **Sign Up** 합니다.
2. **Continue with GitHub** 를 눌러 GitHub 계정으로 가입/로그인합니다.
3. 로그인 후 **Add New…** → **Project** 를 누릅니다.
4. GitHub 저장소 목록에서 `insurance-landing` (만든 이름)을 찾아 **Import** 합니다.
5. 설정 화면에서 아래만 확인합니다.
   - **Framework Preset**: Next.js
   - **Root Directory**: `./` (그대로)
6. **Environment Variables** 칸을 열고 두 줄을 넣습니다.

| Name | Value |
|------|--------|
| `RESEND_API_KEY` | 2단계에서 복사한 `re_` 키 |
| `LEAD_EMAIL` | `zoocci@naver.com` |
| `ADMIN_PASSWORD` | 자료 올리기용 비밀번호 (예: 본인만 아는 값) |

7. **Deploy** 를 누릅니다.
8. 1~2분 뒤 초록색 성공 화면이 나오면, 위에 있는 주소  
   예: `https://insurance-landing-xxxx.vercel.app`  
   이것이 **랜딩페이지 주소**입니다.

이 주소를 블로그 글에 링크로 넣으면 됩니다.

---

## 4단계. 배포가 잘 됐는지 확인하기

1. 배포된 주소를 휴대폰이나 PC로 엽니다.
2. 자기 전화번호, 생년월일, 성별을 넣고 신청합니다. (테스트)
3. 네이버 메일함, 그리고 **스팸 메일함**을 확인합니다.
4. 제목이 `[보장분석 신청]` 으로 온 메일이 있으면 성공입니다.

메일이 안 오면 아래를 확인하세요.

- Vercel 프로젝트 → **Settings** → **Environment Variables** 에 `RESEND_API_KEY`가 있는지
- 값을 고친 뒤에는 **Deployments**에서 가장 위 배포의 **Redeploy** 를 한 번 더 실행하는지
- Resend 대시보드 **Logs** 에 발송 실패가 있는지
- 네이버 스팸함

---

## 나중에 문구를 바꾸고 싶을 때

Cursor에서 아래 파일을 고친 뒤, 다시 GitHub에 올리면 Vercel이 자동으로 새 버전을 배포합니다.

- 화면 문구: `app/page.tsx`
- 색/디자인: `app/globals.css`
- 받는 이메일: Vercel의 `LEAD_EMAIL` 값

---

## (선택) 내 컴퓨터에서 미리 보기

배포 전에 내 PC에서 보려면 **Node.js**가 필요합니다.

1. https://nodejs.org 에서 **LTS** 버전을 설치합니다.
2. 설치 후 Cursor 터미널을 새로 엽니다.
3. 아래를 한 줄씩 입력합니다.

```bash
npm install
```

프로젝트 폴더에 `.env.local` 파일을 만들고 아래처럼 적습니다.

```
RESEND_API_KEY=여기에_resend_키
LEAD_EMAIL=zoocci@naver.com
ADMIN_PASSWORD=changeme
```

그다음:

```bash
npm run dev
```

브라우저에서 http://localhost:3000 을 엽니다.

---

## 개인정보 안내

전화번호·생년월일·성별은 민감한 개인정보입니다. 상담이 끝나면 메일과 기록을 정리하고, 필요 없는 정보는 삭제하는 것을 권장합니다. 페이지에 수집 동의 문구가 들어 있습니다.
