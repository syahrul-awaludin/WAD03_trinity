.PHONY: help install dev start migrate generate push studio reset seed format

help:
	@echo "Available commands:"
	@echo "  make install    - Install dependencies"
	@echo "  make dev        - Run development server"
	@echo "  make start      - Run production server"
	@echo "  make db-migrate    - Create and apply migration"
	@echo "  make db-generate   - Generate Prisma Client"
	@echo "  make db-push       - Push schema changes to database"
	@echo "  make db-studio     - Open Prisma Studio"
	@echo "  make db-reset      - Reset database"
	@echo "  make db-seed       - Seed database"
	@echo "  make db-format     - Format Prisma schema"

install:
	npm install

dev:
	npm run dev

start:
	npm start

db-migrate:
	npx prisma migrate dev

db-generate:
	npx prisma generate

db-push:
	npx prisma db push

db-studio:
	npx prisma studio

db-reset:
	npx prisma migrate reset

db-seed:
	npx prisma db seed

db-format:
	npx prisma format
