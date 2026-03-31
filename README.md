# Huong dan start project (Backend)

## Dieu kien
- Da cai dat `Docker` va `Docker Compose`
- Da cai dat `Node.js` va `Yarn`

## Cac buoc chay project
1. Mo terminal, di vao thu muc `db` va chay database:
   - `cd db`
   - `docker-compose up -d`
2. Quay lai thu muc `backend` va cai dependencies:
   - `yarn install`
3. Kiem tra/cap nhat bien moi truong `OPENAI_API_KEY` (Gemini) trong file `.env.local` neu key het han.
4. Chay project:
   - `yarn start:dev`

## Ghi chu
- Neu database da duoc chay truoc do, ban co the bo qua buoc `docker-compose up -d`.
- Sau khi sua `.env.local`, nen restart lai server backend.

