
NAME=Transcendence

$(NAME): build
	docker-compose up

build:
	docker-compose build
#	TODO : remove next line once finished working on project
#	Also, just required to run once to have it on local machine due to docker's volume synchronization
	docker run -it -v /home/kali/Documents/transcendence/front_end/app/:/usr/src/app/frontend transcendence_front_end npm install

stop:
	docker-compose stop

fclean: stop
	docker-compose down

re: fclean
	make $(NAME)

violence:
	docker system prune -af --all

enter_postgres:
	docker exec -it postgres bash

enter_front_end:
	docker exec -it front_end bash

enter_nginx:
	docker exec -it nginx bash

