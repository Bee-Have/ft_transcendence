
NAME=Transcendence

$(NAME): build
	docker-compose up

build:
	docker-compose build
#	TODO : remove next line once finished working on project
#	Also, just required to run once to have it on local machine due to docker's volume synchronization
	docker-compose run -it -v ./front_end/app/:/usr/src/app/frontend front_end npm install

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

.PHONY: all $(NAME) build stop fclean re prune enter_postgres enter_front_end enter_back_end