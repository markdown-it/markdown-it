Simple:
.
| Heading 1 | Heading 2
| --------- | ---------
| Cell 1    | Cell 2
| Cell 3    | Cell 4
.
<table>
<thead>
<tr>
<th>Heading 1</th>
<th>Heading 2</th>
</tr>
</thead>
<tbody>
<tr>
<td>Cell 1</td>
<td>Cell 2</td>
</tr>
<tr>
<td>Cell 3</td>
<td>Cell 4</td>
</tr>
</tbody>
</table>
.


Column alignment:
.
| Header 1 | Header 2 | Header 3 | Header 4 |
| :------: | -------: | :------- | -------- |
| Cell 1   | Cell 2   | Cell 3   | Cell 4   |
| Cell 5   | Cell 6   | Cell 7   | Cell 8   |
.
<table>
<thead>
<tr>
<th style="text-align:center">Header 1</th>
<th style="text-align:right">Header 2</th>
<th style="text-align:left">Header 3</th>
<th>Header 4</th>
</tr>
</thead>
<tbody>
<tr>
<td style="text-align:center">Cell 1</td>
<td style="text-align:right">Cell 2</td>
<td style="text-align:left">Cell 3</td>
<td>Cell 4</td>
</tr>
<tr>
<td style="text-align:center">Cell 5</td>
<td style="text-align:right">Cell 6</td>
<td style="text-align:left">Cell 7</td>
<td>Cell 8</td>
</tr>
</tbody>
</table>
.


Nested emphases:
.
Header 1|Header 2|Header 3|Header 4
:-------|:------:|-------:|--------
Cell 1  |Cell 2  |Cell 3  |Cell 4
*Cell 5*|Cell 6  |Cell 7  |Cell 8
.
<table>
<thead>
<tr>
<th style="text-align:left">Header 1</th>
<th style="text-align:center">Header 2</th>
<th style="text-align:right">Header 3</th>
<th>Header 4</th>
</tr>
</thead>
<tbody>
<tr>
<td style="text-align:left">Cell 1</td>
<td style="text-align:center">Cell 2</td>
<td style="text-align:right">Cell 3</td>
<td>Cell 4</td>
</tr>
<tr>
<td style="text-align:left"><em>Cell 5</em></td>
<td style="text-align:center">Cell 6</td>
<td style="text-align:right">Cell 7</td>
<td>Cell 8</td>
</tr>
</tbody>
</table>
.


Nested tables inside blockquotes:
.
> foo|foo
> ---|---
> bar|bar
baz|baz
.
<blockquote>
<table>
<thead>
<tr>
<th>foo</th>
<th>foo</th>
</tr>
</thead>
<tbody>
<tr>
<td>bar</td>
<td>bar</td>
</tr>
</tbody>
</table>
</blockquote>
<p>baz|baz</p>
.


Minimal one-column:
.
| foo
|----
| test2
.
<table>
<thead>
<tr>
<th>foo</th>
</tr>
</thead>
<tbody>
<tr>
<td>test2</td>
</tr>
</tbody>
</table>
.


This is parsed as one big table:
.
-   foo|foo
---|---
bar|bar
.
<table>
<thead>
<tr>
<th>-   foo</th>
<th>foo</th>
</tr>
</thead>
<tbody>
<tr>
<td>bar</td>
<td>bar</td>
</tr>
</tbody>
</table>
.


Second line should not contain symbols except "-", ":", "|" and " ":
.
foo|foo
-----|-----s
bar|bar
.
<p>foo|foo
-----|-----s
bar|bar</p>
.


Second line should contain "|" symbol:
.
foo|foo
-----:-----
bar|bar
.
<p>foo|foo
-----:-----
bar|bar</p>
.


Second line should not have empty columns in the middle:
.
foo|foo
-----||-----
bar|bar
.
<p>foo|foo
-----||-----
bar|bar</p>
.


Wrong alignment symbol position:
.
foo|foo
-----|-::-
bar|bar
.
<p>foo|foo
-----|-::-
bar|bar</p>
.


Title line should contain "|" symbol:
.
foo
-----|-----
bar|bar
.
<p>foo
-----|-----
bar|bar</p>
.


Allow tabs as a separator on 2nd line
.
|	foo	|	bar	|
|	---	|	---	|
|	baz	|	quux	|
.
<table>
<thead>
<tr>
<th>foo</th>
<th>bar</th>
</tr>
</thead>
<tbody>
<tr>
<td>baz</td>
<td>quux</td>
</tr>
</tbody>
</table>
.


Should terminate paragraph:
.
paragraph
foo|foo
---|---
bar|bar
.
<p>paragraph</p>
<table>
<thead>
<tr>
<th>foo</th>
<th>foo</th>
</tr>
</thead>
<tbody>
<tr>
<td>bar</td>
<td>bar</td>
</tr>
</tbody>
</table>
.


Another complicated backticks case
.
| Heading 1 | Heading 2
| --------- | ---------
| Cell 1 | Cell 2
| \\\`|\\\`
.
<table>
<thead>
<tr>
<th>Heading 1</th>
<th>Heading 2</th>
</tr>
</thead>
<tbody>
<tr>
<td>Cell 1</td>
<td>Cell 2</td>
</tr>
<tr>
<td>\`</td>
<td>\`</td>
</tr>
</tbody>
</table>
.

`\` in tables should not count as escaped backtick
.
# | 1 | 2
--|--|--
x | `\` | `x`
.
<table>
<thead>
<tr>
<th>#</th>
<th>1</th>
<th>2</th>
</tr>
</thead>
<tbody>
<tr>
<td>x</td>
<td><code>\</code></td>
<td><code>x</code></td>
</tr>
</tbody>
</table>
.

Tables should handle escaped backticks
.
# | 1 | 2
--|--|--
x | \`\` | `x`
.
<table>
<thead>
<tr>
<th>#</th>
<th>1</th>
<th>2</th>
</tr>
</thead>
<tbody>
<tr>
<td>x</td>
<td>``</td>
<td><code>x</code></td>
</tr>
</tbody>
</table>
.


An amount of rows might be different across the table (issue #171):
.
| 1 | 2 |
| :-----: |  :-----: |
| 3 | 4 | 5 | 6 |
.
<table>
<thead>
<tr>
<th style="text-align:center">1</th>
<th style="text-align:center">2</th>
</tr>
</thead>
<tbody>
<tr>
<td style="text-align:center">3</td>
<td style="text-align:center">4</td>
</tr>
</tbody>
</table>
.


An amount of rows might be different across the table #2:
.
| 1 | 2 | 3 | 4 |
| :-----: |  :-----: |  :-----: |  :-----: |
| 5 | 6 |
.
<table>
<thead>
<tr>
<th style="text-align:center">1</th>
<th style="text-align:center">2</th>
<th style="text-align:center">3</th>
<th style="text-align:center">4</th>
</tr>
</thead>
<tbody>
<tr>
<td style="text-align:center">5</td>
<td style="text-align:center">6</td>
<td style="text-align:center"></td>
<td style="text-align:center"></td>
</tr>
</tbody>
</table>
.


Allow one-column tables (issue #171):
.
| foo |
:-----:
| bar |
.
<table>
<thead>
<tr>
<th style="text-align:center">foo</th>
</tr>
</thead>
<tbody>
<tr>
<td style="text-align:center">bar</td>
</tr>
</tbody>
</table>
.


Allow indented tables (issue #325):
.
  | Col1a | Col2a |
  | ----- | ----- |
  | Col1b | Col2b |
.
<table>
<thead>
<tr>
<th>Col1a</th>
<th>Col2a</th>
</tr>
</thead>
<tbody>
<tr>
<td>Col1b</td>
<td>Col2b</td>
</tr>
</tbody>
</table>
.


Tables should not be indented more than 4 spaces (1st line):
.
    | Col1a | Col2a |
  | ----- | ----- |
  | Col1b | Col2b |
.
<pre><code>| Col1a | Col2a |
</code></pre>
<p>| ----- | ----- |
| Col1b | Col2b |</p>
.


Tables should not be indented more than 4 spaces (2nd line):
.
  | Col1a | Col2a |
    | ----- | ----- |
  | Col1b | Col2b |
.
<p>| Col1a | Col2a |
| ----- | ----- |
| Col1b | Col2b |</p>
.


Tables should not be indented more than 4 spaces (3rd line):
.
  | Col1a | Col2a |
  | ----- | ----- |
    | Col1b | Col2b |
.
<table>
<thead>
<tr>
<th>Col1a</th>
<th>Col2a</th>
</tr>
</thead>
</table>
<pre><code>| Col1b | Col2b |
</code></pre>
.


Allow tables with empty body:
.
  | Col1a | Col2a |
  | ----- | ----- |
.
<table>
<thead>
<tr>
<th>Col1a</th>
<th>Col2a</th>
</tr>
</thead>
</table>
.


Align row should be at least as large as any actual rows:
.
Col1a | Col1b | Col1c
----- | -----
Col2a | Col2b | Col2c
.
<p>Col1a | Col1b | Col1c
----- | -----
Col2a | Col2b | Col2c</p>
.

Escaped pipes inside backticks don't split cells:
.
| Heading 1 | Heading 2
| --------- | ---------
| Cell 1 | Cell 2
| `Cell 3\|` | Cell 4
.
<table>
<thead>
<tr>
<th>Heading 1</th>
<th>Heading 2</th>
</tr>
</thead>
<tbody>
<tr>
<td>Cell 1</td>
<td>Cell 2</td>
</tr>
<tr>
<td><code>Cell 3|</code></td>
<td>Cell 4</td>
</tr>
</tbody>
</table>
.

Escape before escaped Pipes inside backticks don't split cells:
.
| Heading 1 | Heading 2
| --------- | ---------
| Cell 1 | Cell 2
| `Cell 3\\|` | Cell 4
.
<table>
<thead>
<tr>
<th>Heading 1</th>
<th>Heading 2</th>
</tr>
</thead>
<tbody>
<tr>
<td>Cell 1</td>
<td>Cell 2</td>
</tr>
<tr>
<td><code>Cell 3\|</code></td>
<td>Cell 4</td>
</tr>
</tbody>
</table>
.

Regression test for #721, table in a list indented with tabs:
.
- Level 1

	- Level 2

		| Column 1 | Column 2 |
		| -------- | -------- |
		| abcdefgh | ijklmnop |
.
<ul>
<li>
<p>Level 1</p>
<ul>
<li>
<p>Level 2</p>
<table>
<thead>
<tr>
<th>Column 1</th>
<th>Column 2</th>
</tr>
</thead>
<tbody>
<tr>
<td>abcdefgh</td>
<td>ijklmnop</td>
</tr>
</tbody>
</table>
</li>
</ul>
</li>
</ul>
.


Table without any columns is not a table, #724
.
|
|
|
.
<p>|
|
|</p>
.


GFM 4.10 Tables (extension), Example 198
.
| foo | bar |
| --- | --- |
| baz | bim |
.
<table>
<thead>
<tr>
<th>foo</th>
<th>bar</th>
</tr>
</thead>
<tbody>
<tr>
<td>baz</td>
<td>bim</td>
</tr>
</tbody>
</table>
.

GFM 4.10 Tables (extension), Example 199
.
| abc | defghi |
:-: | -----------:
bar | baz
.
<table>
<thead>
<tr>
<th style="text-align:center">abc</th>
<th style="text-align:right">defghi</th>
</tr>
</thead>
<tbody>
<tr>
<td style="text-align:center">bar</td>
<td style="text-align:right">baz</td>
</tr>
</tbody>
</table>
.

GFM 4.10 Tables (extension), Example 200
.
| f\|oo  |
| ------ |
| b `\|` az |
| b **\|** im |
.
<table>
<thead>
<tr>
<th>f|oo</th>
</tr>
</thead>
<tbody>
<tr>
<td>b <code>|</code> az</td>
</tr>
<tr>
<td>b <strong>|</strong> im</td>
</tr>
</tbody>
</table>
.

GFM 4.10 Tables (extension), Example 201
.
| abc | def |
| --- | --- |
| bar | baz |
> bar
.
<table>
<thead>
<tr>
<th>abc</th>
<th>def</th>
</tr>
</thead>
<tbody>
<tr>
<td>bar</td>
<td>baz</td>
</tr>
</tbody>
</table>
<blockquote>
<p>bar</p>
</blockquote>
.

GFM 4.10 Tables (extension), Example 202
.
| abc | def |
| --- | --- |
| bar | baz |
bar

bar
.
<table>
<thead>
<tr>
<th>abc</th>
<th>def</th>
</tr>
</thead>
<tbody>
<tr>
<td>bar</td>
<td>baz</td>
</tr>
<tr>
<td>bar</td>
<td></td>
</tr>
</tbody>
</table>
<p>bar</p>
.

GFM 4.10 Tables (extension), Example 203
.
| abc | def |
| --- |
| bar |
.
<p>| abc | def |
| — |
| bar |</p>
.

GFM 4.10 Tables (extension), Example 204
.
| abc | def |
| --- | --- |
| bar |
| bar | baz | boo |
.
<table>
<thead>
<tr>
<th>abc</th>
<th>def</th>
</tr>
</thead>
<tbody>
<tr>
<td>bar</td>
<td></td>
</tr>
<tr>
<td>bar</td>
<td>baz</td>
</tr>
</tbody>
</table>
.

GFM 4.10 Tables (extension), Example 205
.
| abc | def |
| --- | --- |
.
<table>
<thead>
<tr>
<th>abc</th>
<th>def</th>
</tr>
</thead>
</table>
.

A list takes precedence in case of ambiguity
.
a | b
- | -
1 | 2
.
<p>a | b</p>
<ul>
<li>| -
1 | 2</li>
</ul>
.
