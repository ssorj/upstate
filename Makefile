.PHONY: run
run:
	scripts/run-all

.PHONY: clean
clean:
	rm -rf scripts/__pycache__
	cd web-nodejs && make clean
	cd worker-nodejs && make clean
	cd worker-spring && make clean
