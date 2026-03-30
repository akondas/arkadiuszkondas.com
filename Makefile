DOCKER_IMAGE = arkadiuszkondas-blog
DOCKER_RUN = docker run --rm -u $$(id -u):$$(id -g) -v "$$(pwd):/app" $(DOCKER_IMAGE)

.PHONY: build install serve docker-build

docker-build:
	docker build -t $(DOCKER_IMAGE) .

install: docker-build
	$(DOCKER_RUN) composer install --no-interaction

build: docker-build
	$(DOCKER_RUN) vendor/bin/statie generate site --output=dist

serve: build
	@echo "Serving at http://localhost:8000"
	cd dist && python3 -m http.server 8000
