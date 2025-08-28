.PHONY: deploy

deploy: 
	yarn build && scp -r build/* nonatz@der-b.art:/var/www/virtual/nonatz/kcounter.der-b.art
