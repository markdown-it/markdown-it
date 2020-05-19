PATH        := ./node_modules/.bin:${PATH}

NPM_PACKAGE := $(shell node -e 'process.stdout.write(require("./package.json").name)')
NPM_VERSION := $(shell node -e 'process.stdout.write(require("./package.json").version)')

GITHUB_PROJ := https://github.com//markdown-it/${NPM_PACKAGE}


demo:
	npm run demo

gh-demo:
	npm run gh-demo

lint:
	npm run lint

test:
	npm test

coverage:
	npm run coverage

doc:
	npm run doc

gh-doc:
	npm run gh-doc

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
	( printf "/*! ${NPM_PACKAGE} ${NPM_VERSION} ${GITHUB_PROJ} @license MIT */" ; \
		browserify ./ -s markdownit \
		) > dist/markdown-it.js
	# Minify
	terser dist/markdown-it.js -b beautify=false,ascii_only=true -c -m \
		--preamble "/*! ${NPM_PACKAGE} ${NPM_VERSION} ${GITHUB_PROJ} @license MIT */" \
		> dist/markdown-it.min.js

benchmark-deps:
	npm install --prefix benchmark/extra/ -g marked@0.3.6 commonmark@0.26.0 markdown-it/markdown-it.git#2.2.1

specsplit:
	./support/specsplit.js good ./test/fixtures/commonmark/spec.txt > ./test/fixtures/commonmark/good.txt
	./support/specsplit.js bad ./test/fixtures/commonmark/spec.txt > ./test/fixtures/commonmark/bad.txt
	./support/specsplit.js ./test/fixtures/commonmark/spec.txt

todo:
	grep 'TODO' -n -r ./lib 2>/dev/null || test true


.PHONY: publish lint test todo demo coverage doc
.SILENT: help lint test todo
