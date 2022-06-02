services-restart:
	docker compose down && docker compose up -d

services-run:
	docker compose up --build -d

services-run-test:
	docker compose -f docker-compose.test.yml up --build -d

services-clean:
	docker ps --filter name=swayswap* -aq | xargs docker stop | xargs docker rm -f
	docker volume ls --filter name=swayswap* -q | xargs docker volume rm

services-clean-test:
	docker ps --filter name=test-swayswap -aq | xargs docker stop | xargs docker rm -f
	docker volume ls --filter name=test-swayswap -q | xargs docker volume rm
