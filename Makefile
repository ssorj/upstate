.PHONY: run
run:
	scripts/run-all

.PHONY: clean
clean:
	rm -rf scripts/__pycache__
	rm *.html
	cd web-nodejs && make clean
	cd worker-nodejs && make clean
	cd worker-spring && make clean
	cd worker-vertx && make clean

.PHONY: html
html: README.html OPENSHIFT.html

%.html: %.md
	pandoc $< -o $@
