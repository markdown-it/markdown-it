PATH        := ./node_modules/.bin:${PATH}

NPM_PACKAGE := $(shell node -e 'process.stdout.write(require("./package.json").name)')
NPM_VERSION := $(shell node -e 'process.stdout.write(require("./package.json").version)')

TMP_PATH    := /tmp/${NPM_PACKAGE}-$(shell date +%s)

REMOTE_NAME ?= origin
REMOTE_REPO ?= $(shell git config --get remote.${REMOTE_NAME}.url)

CURR_HEAD   := $(firstword $(shell git show-ref --hash HEAD | cut -b -6) master)
GITHUB_PROJ := https://github.com//jonschlinkert/${NPM_PACKAGE}


demo: lint
	./support/demodata.js > demo/sample.json
	jade demo/index.jade -P --obj demo/sample.json
	stylus -u autoprefixer-stylus demo/assets/index.styl
	rm -rf demo/sample.json


lint:
	eslint ./


test: lint
	NODE_ENV=test mocha -R spec
	echo "CommonMark stat:\n"
	./support/specsplit.js test/fixtures/commonmark/spec.txt


gh-pages:
	if [ "git branch --list gh-pages" ]; then \
		git branch -D gh-pages ; \
		fi
	git branch gh-pages
	git push origin gh-pages -f


publish:
	@if test 0 -ne `git status --porcelain | wc -l` ; then \
		echo "Unclean working tree. Commit or stash changes first." >&2 ; \
		exit 128 ; \
		fi
	@if test 0 -ne `git fetch ; git status | grep '^# Your branch' | wc -l` ; then \
		echo "Local/Remote history differs. Please push/pull changes." >&2 ; \
		exit 128 ; \
		fi
	@if test 0 -ne `git tag -l ${NPM_VERSION} | wc -l` ; then \
		echo "Tag ${NPM_VERSION} exists. Update package.json" >&2 ; \
		exit 128 ; \
		fi
	git tag ${NPM_VERSION} && git push origin ${NPM_VERSION}
	npm publish ${GITHUB_PROJ}/tarball/${NPM_VERSION}


browserify:
	rm -rf ./dist
	mkdir dist
	# Browserify
	( echo -n "/*! ${NPM_PACKAGE} ${NPM_VERSION} ${GITHUB_PROJ} @license MIT */" ; \
		browserify -r ./ -s Remarkable \
		) > dist/remarkable.js
	# Minify
	uglifyjs dist/remarkable.js -c -m \
		--preamble "/*! ${NPM_PACKAGE} ${NPM_VERSION} ${GITHUB_PROJ} @license MIT */" \
		> dist/remarkable.min.js


todo:
	grep 'TODO' -n -r ./lib 2>/dev/null || test true


.PHONY: publish lint test dev-deps gh-pages todo demo
.SILENT: help lint test todo
