
NAME=Transcendence

$(NAME): build up_detach prisma_db_push logs

all: ${NAME}

up_detach: build
	docker-compose up -d

build:
	docker-compose build
#	TODO : remove next line once finished working on project
#	Also, just required to run once to have it on local machine due to docker's volume synchronization
	docker-compose run -it -v ./front_end/app/:/usr/src/app/frontend front_end npm install
	docker-compose run front_end npm install
	cd back_end/srcs && npm install

stop:
	docker-compose stop

fclean: stop
	docker-compose down

re: fclean $(NAME)

prune:
	docker system prune -af --all

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