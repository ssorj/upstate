mission.html: mission.adoc
	asciidoctor $<

.PHONY: clean
clean:
	rm mission.html

.PHONY: publish
publish: mission.html
	rsync -av $< images file.rdu.redhat.com:public_html/messaging-work-queue/
