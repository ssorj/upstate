.PHONY: build
build:
	mvn install

.PHONY: clean
clean:
	mvn clean
	rm -f audit.log

.PHONY: run
run:
	java -jar container/target/upstate-worker-swarm-1.0.0-SNAPSHOT-swarm.jar
