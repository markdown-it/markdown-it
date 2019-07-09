PATH        := ./node_modules/.bin:${PATH}

NPM_PACKAGE := $(shell node -e 'process.stdout.write(require("./package.json").name)')
NPM_VERSION := $(shell node -e 'process.stdout.write(require("./package.json").version)')

TMP_PATH    := /tmp/${NPM_PACKAGE}-$(shell date +%s)

REMOTE_NAME ?= origin
REMOTE_REPO ?= $(shell git config --get remote.${REMOTE_NAME}.url)

CURR_HEAD   := $(firstword $(shell git show-ref --hash HEAD | cut -b -6) master)
GITHUB_PROJ := https://github.com//markdown-it/${NPM_PACKAGE}


demo: lint
	rm -rf ./demo
	mkdir ./demo
	./support/demodata.js > ./support/demo_template/sample.json
	pug ./support/demo_template/index.pug --pretty \
		--obj ./support/demo_template/sample.json \
		--out ./demo
	stylus -u autoprefixer-stylus \
		< ./support/demo_template/index.styl \
		> ./demo/index.css
	rm -rf ./support/demo_template/sample.json
	browserify ./ -s markdownit > ./demo/markdown-it.js
	browserify ./support/demo_template/index.js > ./demo/index.js
	cp ./support/demo_template/README.md ./demo/

gh-demo: demo
	touch ./demo/.nojekyll
	cd ./demo \
		&& git init . \
		&& git add . \
		&& git commit -m "Auto-generate demo" \
		&& git remote add origin git@github.com:markdown-it/markdown-it.github.io.git \
		&& git push --force origin master
	rm -rf ./demo

lint:
	eslint .

test: lint
	mocha
	echo "CommonMark stat:\n"
	./support/specsplit.js test/fixtures/commonmark/spec.txt

coverage:
	rm -rf coverage
	istanbul cover node_modules/.bin/_mocha

report-coverage:
	-istanbul cover ./node_modules/mocha/bin/_mocha --report lcovonly -- -R spec && cat ./coverage/lcov.info | ./node_modules/coveralls/bin/coveralls.js && rm -rf ./coverage

doc:
	rm -rf ./apidoc
	ndoc --link-format "https://github.com/{package.repository}/blob/${CURR_HEAD}/{file}#L{line}"

gh-doc: doc
	touch ./apidoc/.nojekyll
	cd ./apidoc \
		&& git init . \
		&& git add . \
		&& git commit -m "Auto-generate API doc" \
		&& git remote add remote git@github.com:markdown-it/markdown-it.git \
		&& git push --force remote +master:gh-pages
	rm -rf ./apidoc

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
