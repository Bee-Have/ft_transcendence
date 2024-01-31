include .env
NAME=Transcendence

$(NAME): build up_detach logs

all: ${NAME}

up_detach:
	docker-compose up -d

build:
	mkdir -p back_end/srcs/uploads/avatar back_end/srcs/uploads/badge
	echo REACT_APP_BACKEND_URL=${BACKEND_URL} > front_end/app/.env.production
	docker-compose build

stop:
	docker-compose stop

fclean: stop
	docker-compose down

re: fclean $(NAME)

prune: fclean
	docker system prune -af
	docker volume prune -af

enter_postgres:
	docker exec -it postgres bash

enter_front_end:
	docker exec -it front_end bash

enter_back_end:
	docker exec -it back_end bash

prisma_db_push:
	docker exec back_end bash -c "npx prisma db push --accept-data-loss"

prisma_migrate:
	docker exec back_end bash -c "npx prisma migrate deploy"

prisma_studio:
	docker exec back_end bash -c "npx prisma studio"

logs:
	docker-compose logs -f

.PHONY: all $(NAME) up_detach build stop fclean re prune enter_postgres enter_front_end enter_back_end prisma_studio prisma_db_push logs