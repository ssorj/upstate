.PHONY: build
build:
	mvn package

.PHONY: clean
clean:
	mvn clean
	rm audit.log

.PHONY: run
run:
	java -jar container/target/upstate-worker-swarm-1.0.0-SNAPSHOT-swarm.jar
