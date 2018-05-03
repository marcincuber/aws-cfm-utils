default: test

mocha:
	@echo "mocha (unit test)"
	@./node_modules/.bin/mocha test/*.js
	@echo