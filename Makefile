default: test

mocha:
	@echo "mocha (unit test)"
	@./node_modules/.bin/mocha test/**/*.js
	@echo

coverage:
	@echo "cover"
	@./node_modules/.bin/istanbul cover ./node_modules/.bin/_mocha test/**/*
	@echo