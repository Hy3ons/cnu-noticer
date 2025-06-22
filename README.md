# 충남대학교 공지사항 알림 서비스 (CNU Notice Web)

충남대학교의 컴퓨터 융합학부의 공지사항을 모아보는 웹 서비스입니다.

## 개발 안내 (Development)

이 프로젝트를 로컬에서 개발하고 싶으신 분들은 다음 안내를 따라주세요.

1.  먼저, 이 저장소를 클론하거나 포크합니다.
2.  프로젝트 개발에 필요한 환경 변수가 담긴 `.env` 파일이 필요합니다. 이 파일은 프로젝트 관리자에게 요청하여 받을 수 있습니다. hhs2003@o.cnu.ac.kr
3.  프로젝트 루트 디렉토리에서 다음 명령어를 실행하여 필요한 패키지를 설치합니다.
    ```bash
    npm install
    ```
4.  다음 명령어를 실행하여 개발 서버를 시작합니다.
    ```bash
    npm run dev
    ```
5.  브라우저에서 [http://localhost:3000](http://localhost:3000)으로 접속하여 결과를 확인합니다.
6.  기능 수정 및 개발 후, 변경 사항에 대해 Pull Request를 보내주시면 됩니다.

## 기술 스택 (Tech Stack)

이 프로젝트는 다음과 같은 기술들을 사용하여 만들어졌습니다:

*   **Framework**: [Next.js](https://nextjs.org/) (App Router)
*   **Language**: [TypeScript](https://www.typescriptlang.org/)
*   **Styling**: [Tailwind CSS](https://tailwindcss.com/)
*   **Database**: [PostgreSQL](https://www.postgresql.org/)
*   **Deployment**: [Vercel](https://vercel.com/). `main` 브랜치에 push될 때 자동으로 프로덕션 환경에 배포됩니다.

## 기여 (Contributing)

프로젝트에 기여하고 싶으신 분들은 언제나 환영입니다. 버그 리포트, 기능 제안 등 어떤 형태의 기여도 좋습니다. Pull Request를 보내기 전에 이슈를 먼저 생성하여 논의하는 것을 권장합니다.

특히 데이터베이스 스키마 변경이나 새로운 쿼리 작성 등 DB 관련 작업에 기여하고 싶으신 분은 프로젝트 관리자에게 문의해주세요. 협업에 필요한 내용을 안내해 드리겠습니다.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
