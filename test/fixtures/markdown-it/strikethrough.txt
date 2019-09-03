.
~~Strikeout~~
.
<p><s>Strikeout</s></p>
.

.
x ~~~~foo~~ bar~~
.
<p>x <s><s>foo</s> bar</s></p>
.

.
x ~~foo ~~bar~~~~
.
<p>x <s>foo <s>bar</s></s></p>
.

.
x ~~~~foo~~~~
.
<p>x <s><s>foo</s></s></p>
.

.
x ~~a ~~foo~~~~~~~~~~~bar~~ b~~

x ~~a ~~foo~~~~~~~~~~~~bar~~ b~~
.
<p>x <s>a <s>foo</s></s>~~~<s><s>bar</s> b</s></p>
<p>x <s>a <s>foo</s></s>~~~~<s><s>bar</s> b</s></p>
.


Strikeouts have the same priority as emphases:
.
**~~test**~~

~~**test~~**
.
<p><strong>~~test</strong>~~</p>
<p><s>**test</s>**</p>
.


Strikeouts have the same priority as emphases with respect to links:
.
[~~link]()~~

~~[link~~]()
.
<p><a href="">~~link</a>~~</p>
<p>~~<a href="">link~~</a></p>
.


Strikeouts have the same priority as emphases with respect to backticks:
.
~~`code~~`

`~~code`~~
.
<p>~~<code>code~~</code></p>
<p><code>~~code</code>~~</p>
.


Nested strikeouts:
.
~~foo ~~bar~~ baz~~

~~f **o ~~o b~~ a** r~~
.
<p><s>foo <s>bar</s> baz</s></p>
<p><s>f <strong>o <s>o b</s> a</strong> r</s></p>
.


Should not have a whitespace between text and "~~":
.
foo ~~ bar ~~ baz
.
<p>foo ~~ bar ~~ baz</p>
.


Should parse strikethrough within link tags:
.
[~~foo~~]()
.
<p><a href=""><s>foo</s></a></p>
.


Newline should be considered a whitespace:
.
~~test
~~

~~
test~~

~~
test
~~
.
<p>~~test
~~</p>
<p>~~
test~~</p>
<p>~~
test
~~</p>
.

From CommonMark test suite, replacing `**` with our marker:

.
a~~"foo"~~
.
<p>a~~“foo”~~</p>
.

Coverage: single tilde
.
~a~
.
<p>~a~</p>
.
