# Setup development environment

## 1. Install dependencies
```bash
yarn install
```

## 2. Setup environment variables**
**Via vercel CLI**
Pull env variable
```bash
vercel env
```

**Manually**
Copy example file to local file
```bash
cp .env.local.example .env.local
```
Then configure the variables with the right values


## 3. Start database source
```bash
docker-compose up -d
```

## 4. Start server
```bash
yarn dev
```
