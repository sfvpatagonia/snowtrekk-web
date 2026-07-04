build:
	docker build -t snow-front .
run:
	docker run -it -p 8080:8080 snow-front