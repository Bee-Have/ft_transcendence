all:
	cd srcs && docker-compose up -d

logs:
	cd srcs && docker-compose logs

clean:
	cd srcs && docker-compose down --remove-orphans

fclean: clean
	docker system prune -a

re:

.PHONY: all logs fclean clean re