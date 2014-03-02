BIN = ./node_modules/.bin
MOCHA = $(BIN)/mocha
ISTANBUL = $(BIN)/istanbul
JSHINT = $(BIN)/jshint
JSCS = $(BIN)/jscs
COVERALLS = $(BIN)/coveralls

.PHONY: test
test:
	$(MOCHA) -u bdd -R spec --recursive

.PHONY: validate
validate: lint test

.PHONY: clean
clean:
	-rm -rf lib-cov
	-rm -rf html-report

.PHONY: lib-cov
lib-cov: clean
	$(ISTANBUL) instrument --output lib-cov --no-compact --variable global.__coverage__ lib

.PHONY: coverage
coverage: lib-cov
	GULP_AUTOPOLYFILLER_COVERAGE=1 $(MOCHA) --reporter mocha-istanbul
	@echo
	@echo open html-report/index.html file in your browser

.PHONY: coveralls
coveralls: lib-cov
	@GULP_AUTOPOLYFILLER_COVERAGE=1 ISTANBUL_REPORTERS=lcovonly $(MOCHA) --reporter mocha-istanbul
	@cat lcov.info | $(COVERALLS)
	@rm -rf lib-cov lcov.info

.PHONY: travis
travis: validate coveralls

.PHONY: lint
lint:
	$(JSHINT) .
	$(JSCS) .
