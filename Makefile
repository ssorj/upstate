.PHONY: run
run:
	scripts/run-all

.PHONY: clean
clean:
	rm -rf scripts/__pycache__
	rm README.html
	cd web-nodejs && make clean
	cd worker-nodejs && make clean
	cd worker-spring && make clean
	cd worker-vertx && make clean

README.html: README.md
	pandoc $< -o $@
