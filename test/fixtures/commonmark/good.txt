~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 354

.
	foo	baz		bim
.
<pre><code>foo	baz		bim
</code></pre>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 361

.
  	foo	baz		bim
.
<pre><code>foo	baz		bim
</code></pre>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 368

.
    a	a
    ὐ	a
.
<pre><code>a	a
ὐ	a
</code></pre>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 381

.
  - foo

	bar
.
<ul>
<li>
<p>foo</p>
<p>bar</p>
</li>
</ul>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 394

.
- foo

		bar
.
<ul>
<li>
<p>foo</p>
<pre><code>  bar
</code></pre>
</li>
</ul>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 417

.
>		foo
.
<blockquote>
<pre><code>  foo
</code></pre>
</blockquote>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 426

.
-		foo
.
<ul>
<li>
<pre><code>  foo
</code></pre>
</li>
</ul>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 438

.
    foo
	bar
.
<pre><code>foo
bar
</code></pre>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 447

.
 - foo
   - bar
	 - baz
.
<ul>
<li>foo
<ul>
<li>bar
<ul>
<li>baz</li>
</ul>
</li>
</ul>
</li>
</ul>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 465

.
#	Foo
.
<h1>Foo</h1>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 471

.
*	*	*	
.
<hr />
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 488

.
\!\"\#\$\%\&\'\(\)\*\+\,\-\.\/\:\;\<\=\>\?\@\[\\\]\^\_\`\{\|\}\~
.
<p>!&quot;#$%&amp;'()*+,-./:;&lt;=&gt;?@[\]^_`{|}~</p>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 498

.
\	\A\a\ \3\φ\«
.
<p>\	\A\a\ \3\φ\«</p>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 508

.
\*not emphasized*
\<br/> not a tag
\[not a link](/foo)
\`not code`
1\. not a list
\* not a list
\# not a heading
\[foo]: /url "not a reference"
\&ouml; not a character entity
.
<p>*not emphasized*
&lt;br/&gt; not a tag
[not a link](/foo)
`not code`
1. not a list
* not a list
# not a heading
[foo]: /url &quot;not a reference&quot;
&amp;ouml; not a character entity</p>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 533

.
\\*emphasis*
.
<p>\<em>emphasis</em></p>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 542

.
foo\
bar
.
<p>foo<br />
bar</p>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 554

.
`` \[\` ``
.
<p><code>\[\`</code></p>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 561

.
    \[\]
.
<pre><code>\[\]
</code></pre>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 569

.
~~~
\[\]
~~~
.
<pre><code>\[\]
</code></pre>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 579

.
<https://example.com?find=\*>
.
<p><a href="https://example.com?find=%5C*">https://example.com?find=\*</a></p>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 586

.
<a href="/bar\/)">
.
<a href="/bar\/)">
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 596

.
[foo](/bar\* "ti\*tle")
.
<p><a href="/bar*" title="ti*tle">foo</a></p>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 603

.
[foo]

[foo]: /bar\* "ti\*tle"
.
<p><a href="/bar*" title="ti*tle">foo</a></p>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 612

.
``` foo\+bar
foo
```
.
<pre><code class="language-foo+bar">foo
</code></pre>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 648

.
&nbsp; &amp; &copy; &AElig; &Dcaron;
&frac34; &HilbertSpace; &DifferentialD;
&ClockwiseContourIntegral; &ngE;
.
<p>  &amp; © Æ Ď
¾ ℋ ⅆ
∲ ≧̸</p>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 667

.
&#35; &#1234; &#992; &#0;
.
<p># Ӓ Ϡ �</p>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 680

.
&#X22; &#XD06; &#xcab;
.
<p>&quot; ആ ಫ</p>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 689

.
&nbsp &x; &#; &#x;
&#87654321;
&#abcdef0;
&ThisIsNotDefined; &hi?;
.
<p>&amp;nbsp &amp;x; &amp;#; &amp;#x;
&amp;#87654321;
&amp;#abcdef0;
&amp;ThisIsNotDefined; &amp;hi?;</p>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 706

.
&copy
.
<p>&amp;copy</p>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 716

.
&MadeUpEntity;
.
<p>&amp;MadeUpEntity;</p>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 727

.
<a href="&ouml;&ouml;.html">
.
<a href="&ouml;&ouml;.html">
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 734

.
[foo](/f&ouml;&ouml; "f&ouml;&ouml;")
.
<p><a href="/f%C3%B6%C3%B6" title="föö">foo</a></p>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 741

.
[foo]

[foo]: /f&ouml;&ouml; "f&ouml;&ouml;"
.
<p><a href="/f%C3%B6%C3%B6" title="föö">foo</a></p>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 750

.
``` f&ouml;&ouml;
foo
```
.
<pre><code class="language-föö">foo
</code></pre>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 763

.
`f&ouml;&ouml;`
.
<p><code>f&amp;ouml;&amp;ouml;</code></p>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 770

.
    f&ouml;f&ouml;
.
<pre><code>f&amp;ouml;f&amp;ouml;
</code></pre>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 782

.
&#42;foo&#42;
*foo*
.
<p>*foo*
<em>foo</em></p>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 790

.
&#42; foo

* foo
.
<p>* foo</p>
<ul>
<li>foo</li>
</ul>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 801

.
foo&#10;&#10;bar
.
<p>foo

bar</p>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 809

.
&#9;foo
.
<p>	foo</p>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 816

.
[a](url &quot;tit&quot;)
.
<p>[a](url &quot;tit&quot;)</p>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 839

.
- `one
- two`
.
<ul>
<li>`one</li>
<li>two`</li>
</ul>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 878

.
***
---
___
.
<hr />
<hr />
<hr />
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 891

.
+++
.
<p>+++</p>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 898

.
===
.
<p>===</p>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 907

.
--
**
__
.
<p>--
**
__</p>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 920

.
 ***
  ***
   ***
.
<hr />
<hr />
<hr />
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 933

.
    ***
.
<pre><code>***
</code></pre>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 941

.
Foo
    ***
.
<p>Foo
***</p>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 952

.
_____________________________________
.
<hr />
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 961

.
 - - -
.
<hr />
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 968

.
 **  * ** * ** * **
.
<hr />
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 975

.
-     -      -      -
.
<hr />
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 984

.
- - - -    
.
<hr />
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 993

.
_ _ _ _ a

a------

---a---
.
<p>_ _ _ _ a</p>
<p>a------</p>
<p>---a---</p>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 1009

.
 *-*
.
<p><em>-</em></p>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 1018

.
- foo
***
- bar
.
<ul>
<li>foo</li>
</ul>
<hr />
<ul>
<li>bar</li>
</ul>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 1035

.
Foo
***
bar
.
<p>Foo</p>
<hr />
<p>bar</p>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 1052

.
Foo
---
bar
.
<h2>Foo</h2>
<p>bar</p>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 1065

.
* Foo
* * *
* Bar
.
<ul>
<li>Foo</li>
</ul>
<hr />
<ul>
<li>Bar</li>
</ul>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 1082

.
- Foo
- * * *
.
<ul>
<li>Foo</li>
<li>
<hr />
</li>
</ul>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 1111

.
# foo
## foo
### foo
#### foo
##### foo
###### foo
.
<h1>foo</h1>
<h2>foo</h2>
<h3>foo</h3>
<h4>foo</h4>
<h5>foo</h5>
<h6>foo</h6>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 1130

.
####### foo
.
<p>####### foo</p>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 1145

.
#5 bolt

#hashtag
.
<p>#5 bolt</p>
<p>#hashtag</p>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 1157

.
\## foo
.
<p>## foo</p>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 1166

.
# foo *bar* \*baz\*
.
<h1>foo <em>bar</em> *baz*</h1>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 1175

.
#                  foo                     
.
<h1>foo</h1>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 1184

.
 ### foo
  ## foo
   # foo
.
<h3>foo</h3>
<h2>foo</h2>
<h1>foo</h1>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 1197

.
    # foo
.
<pre><code># foo
</code></pre>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 1205

.
foo
    # bar
.
<p>foo
# bar</p>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 1216

.
## foo ##
  ###   bar    ###
.
<h2>foo</h2>
<h3>bar</h3>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 1227

.
# foo ##################################
##### foo ##
.
<h1>foo</h1>
<h5>foo</h5>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 1238

.
### foo ###     
.
<h3>foo</h3>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 1249

.
### foo ### b
.
<h3>foo ### b</h3>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 1258

.
# foo#
.
<h1>foo#</h1>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 1268

.
### foo \###
## foo #\##
# foo \#
.
<h3>foo ###</h3>
<h2>foo ###</h2>
<h1>foo #</h1>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 1282

.
****
## foo
****
.
<hr />
<h2>foo</h2>
<hr />
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 1293

.
Foo bar
# baz
Bar foo
.
<p>Foo bar</p>
<h1>baz</h1>
<p>Bar foo</p>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 1306

.
## 
#
### ###
.
<h2></h2>
<h1></h1>
<h3></h3>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 1346

.
Foo *bar*
=========

Foo *bar*
---------
.
<h1>Foo <em>bar</em></h1>
<h2>Foo <em>bar</em></h2>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 1360

.
Foo *bar
baz*
====
.
<h1>Foo <em>bar
baz</em></h1>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 1374

.
  Foo *bar
baz*	
====
.
<h1>Foo <em>bar
baz</em></h1>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 1386

.
Foo
-------------------------

Foo
=
.
<h2>Foo</h2>
<h1>Foo</h1>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 1401

.
   Foo
---

  Foo
-----

  Foo
  ===
.
<h2>Foo</h2>
<h2>Foo</h2>
<h1>Foo</h1>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 1419

.
    Foo
    ---

    Foo
---
.
<pre><code>Foo
---

Foo
</code></pre>
<hr />
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 1438

.
Foo
   ----      
.
<h2>Foo</h2>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 1448

.
Foo
    ---
.
<p>Foo
---</p>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 1459

.
Foo
= =

Foo
--- -
.
<p>Foo
= =</p>
<p>Foo</p>
<hr />
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 1475

.
Foo  
-----
.
<h2>Foo</h2>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 1485

.
Foo\
----
.
<h2>Foo\</h2>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 1496

.
`Foo
----
`

<a title="a lot
---
of dashes"/>
.
<h2>`Foo</h2>
<p>`</p>
<h2>&lt;a title=&quot;a lot</h2>
<p>of dashes&quot;/&gt;</p>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 1515

.
> Foo
---
.
<blockquote>
<p>Foo</p>
</blockquote>
<hr />
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 1526

.
> foo
bar
===
.
<blockquote>
<p>foo
bar
===</p>
</blockquote>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 1539

.
- Foo
---
.
<ul>
<li>Foo</li>
</ul>
<hr />
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 1554

.
Foo
Bar
---
.
<h2>Foo
Bar</h2>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 1567

.
---
Foo
---
Bar
---
Baz
.
<hr />
<h2>Foo</h2>
<h2>Bar</h2>
<p>Baz</p>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 1584

.

====
.
<p>====</p>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 1596

.
---
---
.
<hr />
<hr />
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 1605

.
- foo
-----
.
<ul>
<li>foo</li>
</ul>
<hr />
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 1616

.
    foo
---
.
<pre><code>foo
</code></pre>
<hr />
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 1626

.
> foo
-----
.
<blockquote>
<p>foo</p>
</blockquote>
<hr />
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 1640

.
\> foo
------
.
<h2>&gt; foo</h2>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 1671

.
Foo

bar
---
baz
.
<p>Foo</p>
<h2>bar</h2>
<p>baz</p>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 1687

.
Foo
bar

---

baz
.
<p>Foo
bar</p>
<hr />
<p>baz</p>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 1705

.
Foo
bar
* * *
baz
.
<p>Foo
bar</p>
<hr />
<p>baz</p>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 1720

.
Foo
bar
\---
baz
.
<p>Foo
bar
---
baz</p>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 1748

.
    a simple
      indented code block
.
<pre><code>a simple
  indented code block
</code></pre>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 1762

.
  - foo

    bar
.
<ul>
<li>
<p>foo</p>
<p>bar</p>
</li>
</ul>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 1776

.
1.  foo

    - bar
.
<ol>
<li>
<p>foo</p>
<ul>
<li>bar</li>
</ul>
</li>
</ol>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 1796

.
    <a/>
    *hi*

    - one
.
<pre><code>&lt;a/&gt;
*hi*

- one
</code></pre>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 1812

.
    chunk1

    chunk2
  
 
 
    chunk3
.
<pre><code>chunk1

chunk2



chunk3
</code></pre>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 1835

.
    chunk1
      
      chunk2
.
<pre><code>chunk1
  
  chunk2
</code></pre>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 1850

.
Foo
    bar

.
<p>Foo
bar</p>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 1864

.
    foo
bar
.
<pre><code>foo
</code></pre>
<p>bar</p>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 1877

.
# Heading
    foo
Heading
------
    foo
----
.
<h1>Heading</h1>
<pre><code>foo
</code></pre>
<h2>Heading</h2>
<pre><code>foo
</code></pre>
<hr />
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 1897

.
        foo
    bar
.
<pre><code>    foo
bar
</code></pre>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 1910

.

    
    foo
    

.
<pre><code>foo
</code></pre>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 1924

.
    foo  
.
<pre><code>foo  
</code></pre>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 1979

.
```
<
 >
```
.
<pre><code>&lt;
 &gt;
</code></pre>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 1993

.
~~~
<
 >
~~~
.
<pre><code>&lt;
 &gt;
</code></pre>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 2006

.
``
foo
``
.
<p><code>foo</code></p>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 2017

.
```
aaa
~~~
```
.
<pre><code>aaa
~~~
</code></pre>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 2029

.
~~~
aaa
```
~~~
.
<pre><code>aaa
```
</code></pre>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 2043

.
````
aaa
```
``````
.
<pre><code>aaa
```
</code></pre>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 2055

.
~~~~
aaa
~~~
~~~~
.
<pre><code>aaa
~~~
</code></pre>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 2070

.
```
.
<pre><code></code></pre>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 2077

.
`````

```
aaa
.
<pre><code>
```
aaa
</code></pre>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 2090

.
> ```
> aaa

bbb
.
<blockquote>
<pre><code>aaa
</code></pre>
</blockquote>
<p>bbb</p>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 2106

.
```

  
```
.
<pre><code>
  
</code></pre>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 2120

.
```
```
.
<pre><code></code></pre>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 2132

.
 ```
 aaa
aaa
```
.
<pre><code>aaa
aaa
</code></pre>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 2144

.
  ```
aaa
  aaa
aaa
  ```
.
<pre><code>aaa
aaa
aaa
</code></pre>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 2158

.
   ```
   aaa
    aaa
  aaa
   ```
.
<pre><code>aaa
 aaa
aaa
</code></pre>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 2174

.
    ```
    aaa
    ```
.
<pre><code>```
aaa
```
</code></pre>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 2189

.
```
aaa
  ```
.
<pre><code>aaa
</code></pre>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 2199

.
   ```
aaa
  ```
.
<pre><code>aaa
</code></pre>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 2211

.
```
aaa
    ```
.
<pre><code>aaa
    ```
</code></pre>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 2225

.
``` ```
aaa
.
<p><code> </code>
aaa</p>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 2234

.
~~~~~~
aaa
~~~ ~~
.
<pre><code>aaa
~~~ ~~
</code></pre>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 2248

.
foo
```
bar
```
baz
.
<p>foo</p>
<pre><code>bar
</code></pre>
<p>baz</p>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 2265

.
foo
---
~~~
bar
~~~
# baz
.
<h2>foo</h2>
<pre><code>bar
</code></pre>
<h1>baz</h1>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 2287

.
```ruby
def foo(x)
  return 3
end
```
.
<pre><code class="language-ruby">def foo(x)
  return 3
end
</code></pre>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 2301

.
~~~~    ruby startline=3 $%@#$
def foo(x)
  return 3
end
~~~~~~~
.
<pre><code class="language-ruby">def foo(x)
  return 3
end
</code></pre>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 2315

.
````;
````
.
<pre><code class="language-;"></code></pre>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 2325

.
``` aa ```
foo
.
<p><code>aa</code>
foo</p>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 2336

.
~~~ aa ``` ~~~
foo
~~~
.
<pre><code class="language-aa">foo
</code></pre>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 2348

.
```
``` aaa
```
.
<pre><code>``` aaa
</code></pre>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 2427

.
<table><tr><td>
<pre>
**Hello**,

_world_.
</pre>
</td></tr></table>
.
<table><tr><td>
<pre>
**Hello**,
<p><em>world</em>.
</pre></p>
</td></tr></table>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 2456

.
<table>
  <tr>
    <td>
           hi
    </td>
  </tr>
</table>

okay.
.
<table>
  <tr>
    <td>
           hi
    </td>
  </tr>
</table>
<p>okay.</p>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 2478

.
 <div>
  *hello*
         <foo><a>
.
 <div>
  *hello*
         <foo><a>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 2491

.
</div>
*foo*
.
</div>
*foo*
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 2502

.
<DIV CLASS="foo">

*Markdown*

</DIV>
.
<DIV CLASS="foo">
<p><em>Markdown</em></p>
</DIV>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 2518

.
<div id="foo"
  class="bar">
</div>
.
<div id="foo"
  class="bar">
</div>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 2529

.
<div id="foo" class="bar
  baz">
</div>
.
<div id="foo" class="bar
  baz">
</div>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 2541

.
<div>
*foo*

*bar*
.
<div>
*foo*
<p><em>bar</em></p>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 2557

.
<div id="foo"
*hi*
.
<div id="foo"
*hi*
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 2566

.
<div class
foo
.
<div class
foo
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 2578

.
<div *???-&&&-<---
*foo*
.
<div *???-&&&-<---
*foo*
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 2590

.
<div><a href="bar">*foo*</a></div>
.
<div><a href="bar">*foo*</a></div>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 2597

.
<table><tr><td>
foo
</td></tr></table>
.
<table><tr><td>
foo
</td></tr></table>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 2614

.
<div></div>
``` c
int x = 33;
```
.
<div></div>
``` c
int x = 33;
```
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 2631

.
<a href="foo">
*bar*
</a>
.
<a href="foo">
*bar*
</a>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 2644

.
<Warning>
*bar*
</Warning>
.
<Warning>
*bar*
</Warning>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 2655

.
<i class="foo">
*bar*
</i>
.
<i class="foo">
*bar*
</i>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 2666

.
</ins>
*bar*
.
</ins>
*bar*
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 2681

.
<del>
*foo*
</del>
.
<del>
*foo*
</del>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 2696

.
<del>

*foo*

</del>
.
<del>
<p><em>foo</em></p>
</del>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 2714

.
<del>*foo*</del>
.
<p><del><em>foo</em></del></p>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 2730

.
<pre language="haskell"><code>
import Text.HTML.TagSoup

main :: IO ()
main = print $ parseTags tags
</code></pre>
okay
.
<pre language="haskell"><code>
import Text.HTML.TagSoup

main :: IO ()
main = print $ parseTags tags
</code></pre>
<p>okay</p>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 2751

.
<script type="text/javascript">
// JavaScript example

document.getElementById("demo").innerHTML = "Hello JavaScript!";
</script>
okay
.
<script type="text/javascript">
// JavaScript example

document.getElementById("demo").innerHTML = "Hello JavaScript!";
</script>
<p>okay</p>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 2770

.
<textarea>

*foo*

_bar_

</textarea>
.
<textarea>

*foo*

_bar_

</textarea>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 2790

.
<style
  type="text/css">
h1 {color:red;}

p {color:blue;}
</style>
okay
.
<style
  type="text/css">
h1 {color:red;}

p {color:blue;}
</style>
<p>okay</p>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 2813

.
<style
  type="text/css">

foo
.
<style
  type="text/css">

foo
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 2826

.
> <div>
> foo

bar
.
<blockquote>
<div>
foo
</blockquote>
<p>bar</p>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 2840

.
- <div>
- foo
.
<ul>
<li>
<div>
</li>
<li>foo</li>
</ul>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 2855

.
<style>p{color:red;}</style>
*foo*
.
<style>p{color:red;}</style>
<p><em>foo</em></p>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 2864

.
<!-- foo -->*bar*
*baz*
.
<!-- foo -->*bar*
<p><em>baz</em></p>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 2876

.
<script>
foo
</script>1. *bar*
.
<script>
foo
</script>1. *bar*
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 2889

.
<!-- Foo

bar
   baz -->
okay
.
<!-- Foo

bar
   baz -->
<p>okay</p>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 2907

.
<?php

  echo '>';

?>
okay
.
<?php

  echo '>';

?>
<p>okay</p>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 2926

.
<!DOCTYPE html>
.
<!DOCTYPE html>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 2935

.
<![CDATA[
function matchwo(a,b)
{
  if (a < b && a < 0) then {
    return 1;

  } else {

    return 0;
  }
}
]]>
okay
.
<![CDATA[
function matchwo(a,b)
{
  if (a < b && a < 0) then {
    return 1;

  } else {

    return 0;
  }
}
]]>
<p>okay</p>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 2969

.
  <!-- foo -->

    <!-- foo -->
.
  <!-- foo -->
<pre><code>&lt;!-- foo --&gt;
</code></pre>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 2980

.
  <div>

    <div>
.
  <div>
<pre><code>&lt;div&gt;
</code></pre>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 2994

.
Foo
<div>
bar
</div>
.
<p>Foo</p>
<div>
bar
</div>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 3011

.
<div>
bar
</div>
*foo*
.
<div>
bar
</div>
*foo*
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 3026

.
Foo
<a href="bar">
baz
.
<p>Foo
<a href="bar">
baz</p>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 3067

.
<div>

*Emphasized* text.

</div>
.
<div>
<p><em>Emphasized</em> text.</p>
</div>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 3080

.
<div>
*Emphasized* text.
</div>
.
<div>
*Emphasized* text.
</div>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 3102

.
<table>

<tr>

<td>
Hi
</td>

</tr>

</table>
.
<table>
<tr>
<td>
Hi
</td>
</tr>
</table>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 3129

.
<table>

  <tr>

    <td>
      Hi
    </td>

  </tr>

</table>
.
<table>
  <tr>
<pre><code>&lt;td&gt;
  Hi
&lt;/td&gt;
</code></pre>
  </tr>
</table>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 3178

.
[foo]: /url "title"

[foo]
.
<p><a href="/url" title="title">foo</a></p>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 3187

.
   [foo]: 
      /url  
           'the title'  

[foo]
.
<p><a href="/url" title="the title">foo</a></p>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 3198

.
[Foo*bar\]]:my_(url) 'title (with parens)'

[Foo*bar\]]
.
<p><a href="my_(url)" title="title (with parens)">Foo*bar]</a></p>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 3207

.
[Foo bar]:
<my url>
'title'

[Foo bar]
.
<p><a href="my%20url" title="title">Foo bar</a></p>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 3220

.
[foo]: /url '
title
line1
line2
'

[foo]
.
<p><a href="/url" title="
title
line1
line2
">foo</a></p>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 3239

.
[foo]: /url 'title

with blank line'

[foo]
.
<p>[foo]: /url 'title</p>
<p>with blank line'</p>
<p>[foo]</p>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 3254

.
[foo]:
/url

[foo]
.
<p><a href="/url">foo</a></p>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 3266

.
[foo]:

[foo]
.
<p>[foo]:</p>
<p>[foo]</p>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 3278

.
[foo]: <>

[foo]
.
<p><a href="">foo</a></p>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 3289

.
[foo]: <bar>(baz)

[foo]
.
<p>[foo]: <bar>(baz)</p>
<p>[foo]</p>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 3302

.
[foo]: /url\bar\*baz "foo\"bar\baz"

[foo]
.
<p><a href="/url%5Cbar*baz" title="foo&quot;bar\baz">foo</a></p>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 3313

.
[foo]

[foo]: url
.
<p><a href="url">foo</a></p>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 3325

.
[foo]

[foo]: first
[foo]: second
.
<p><a href="first">foo</a></p>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 3338

.
[FOO]: /url

[Foo]
.
<p><a href="/url">Foo</a></p>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 3347

.
[ΑΓΩ]: /φου

[αγω]
.
<p><a href="/%CF%86%CE%BF%CF%85">αγω</a></p>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 3362

.
[foo]: /url
.
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 3370

.
[
foo
]: /url
bar
.
<p>bar</p>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 3383

.
[foo]: /url "title" ok
.
<p>[foo]: /url &quot;title&quot; ok</p>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 3392

.
[foo]: /url
"title" ok
.
<p>&quot;title&quot; ok</p>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 3403

.
    [foo]: /url "title"

[foo]
.
<pre><code>[foo]: /url &quot;title&quot;
</code></pre>
<p>[foo]</p>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 3417

.
```
[foo]: /url
```

[foo]
.
<pre><code>[foo]: /url
</code></pre>
<p>[foo]</p>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 3432

.
Foo
[bar]: /baz

[bar]
.
<p>Foo
[bar]: /baz</p>
<p>[bar]</p>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 3447

.
# [Foo]
[foo]: /url
> bar
.
<h1><a href="/url">Foo</a></h1>
<blockquote>
<p>bar</p>
</blockquote>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 3458

.
[foo]: /url
bar
===
[foo]
.
<h1>bar</h1>
<p><a href="/url">foo</a></p>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 3468

.
[foo]: /url
===
[foo]
.
<p>===
<a href="/url">foo</a></p>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 3481

.
[foo]: /foo-url "foo"
[bar]: /bar-url
  "bar"
[baz]: /baz-url

[foo],
[bar],
[baz]
.
<p><a href="/foo-url" title="foo">foo</a>,
<a href="/bar-url" title="bar">bar</a>,
<a href="/baz-url">baz</a></p>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 3502

.
[foo]

> [foo]: /url
.
<p><a href="/url">foo</a></p>
<blockquote>
</blockquote>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 3524

.
aaa

bbb
.
<p>aaa</p>
<p>bbb</p>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 3536

.
aaa
bbb

ccc
ddd
.
<p>aaa
bbb</p>
<p>ccc
ddd</p>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 3552

.
aaa


bbb
.
<p>aaa</p>
<p>bbb</p>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 3565

.
  aaa
 bbb
.
<p>aaa
bbb</p>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 3577

.
aaa
             bbb
                                       ccc
.
<p>aaa
bbb
ccc</p>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 3591

.
   aaa
bbb
.
<p>aaa
bbb</p>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 3600

.
    aaa
bbb
.
<pre><code>aaa
</code></pre>
<p>bbb</p>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 3614

.
aaa     
bbb     
.
<p>aaa<br />
bbb</p>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 3631

.
  

aaa
  

# aaa

  
.
<p>aaa</p>
<h1>aaa</h1>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 3699

.
> # Foo
> bar
> baz
.
<blockquote>
<h1>Foo</h1>
<p>bar
baz</p>
</blockquote>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 3714

.
># Foo
>bar
> baz
.
<blockquote>
<h1>Foo</h1>
<p>bar
baz</p>
</blockquote>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 3729

.
   > # Foo
   > bar
 > baz
.
<blockquote>
<h1>Foo</h1>
<p>bar
baz</p>
</blockquote>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 3744

.
    > # Foo
    > bar
    > baz
.
<pre><code>&gt; # Foo
&gt; bar
&gt; baz
</code></pre>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 3759

.
> # Foo
> bar
baz
.
<blockquote>
<h1>Foo</h1>
<p>bar
baz</p>
</blockquote>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 3775

.
> bar
baz
> foo
.
<blockquote>
<p>bar
baz
foo</p>
</blockquote>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 3799

.
> foo
---
.
<blockquote>
<p>foo</p>
</blockquote>
<hr />
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 3819

.
> - foo
- bar
.
<blockquote>
<ul>
<li>foo</li>
</ul>
</blockquote>
<ul>
<li>bar</li>
</ul>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 3837

.
>     foo
    bar
.
<blockquote>
<pre><code>foo
</code></pre>
</blockquote>
<pre><code>bar
</code></pre>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 3850

.
> ```
foo
```
.
<blockquote>
<pre><code></code></pre>
</blockquote>
<p>foo</p>
<pre><code></code></pre>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 3866

.
> foo
    - bar
.
<blockquote>
<p>foo
- bar</p>
</blockquote>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 3890

.
>
.
<blockquote>
</blockquote>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 3898

.
>
>  
> 
.
<blockquote>
</blockquote>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 3910

.
>
> foo
>  
.
<blockquote>
<p>foo</p>
</blockquote>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 3923

.
> foo

> bar
.
<blockquote>
<p>foo</p>
</blockquote>
<blockquote>
<p>bar</p>
</blockquote>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 3945

.
> foo
> bar
.
<blockquote>
<p>foo
bar</p>
</blockquote>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 3958

.
> foo
>
> bar
.
<blockquote>
<p>foo</p>
<p>bar</p>
</blockquote>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 3972

.
foo
> bar
.
<p>foo</p>
<blockquote>
<p>bar</p>
</blockquote>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 3986

.
> aaa
***
> bbb
.
<blockquote>
<p>aaa</p>
</blockquote>
<hr />
<blockquote>
<p>bbb</p>
</blockquote>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 4004

.
> bar
baz
.
<blockquote>
<p>bar
baz</p>
</blockquote>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 4015

.
> bar

baz
.
<blockquote>
<p>bar</p>
</blockquote>
<p>baz</p>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 4027

.
> bar
>
baz
.
<blockquote>
<p>bar</p>
</blockquote>
<p>baz</p>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 4043

.
> > > foo
bar
.
<blockquote>
<blockquote>
<blockquote>
<p>foo
bar</p>
</blockquote>
</blockquote>
</blockquote>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 4058

.
>>> foo
> bar
>>baz
.
<blockquote>
<blockquote>
<blockquote>
<p>foo
bar
baz</p>
</blockquote>
</blockquote>
</blockquote>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 4080

.
>     code

>    not code
.
<blockquote>
<pre><code>code
</code></pre>
</blockquote>
<blockquote>
<p>not code</p>
</blockquote>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 4134

.
A paragraph
with two lines.

    indented code

> A block quote.
.
<p>A paragraph
with two lines.</p>
<pre><code>indented code
</code></pre>
<blockquote>
<p>A block quote.</p>
</blockquote>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 4156

.
1.  A paragraph
    with two lines.

        indented code

    > A block quote.
.
<ol>
<li>
<p>A paragraph
with two lines.</p>
<pre><code>indented code
</code></pre>
<blockquote>
<p>A block quote.</p>
</blockquote>
</li>
</ol>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 4189

.
- one

 two
.
<ul>
<li>one</li>
</ul>
<p>two</p>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 4201

.
- one

  two
.
<ul>
<li>
<p>one</p>
<p>two</p>
</li>
</ul>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 4215

.
 -    one

     two
.
<ul>
<li>one</li>
</ul>
<pre><code> two
</code></pre>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 4228

.
 -    one

      two
.
<ul>
<li>
<p>one</p>
<p>two</p>
</li>
</ul>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 4250

.
   > > 1.  one
>>
>>     two
.
<blockquote>
<blockquote>
<ol>
<li>
<p>one</p>
<p>two</p>
</li>
</ol>
</blockquote>
</blockquote>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 4277

.
>>- one
>>
  >  > two
.
<blockquote>
<blockquote>
<ul>
<li>one</li>
</ul>
<p>two</p>
</blockquote>
</blockquote>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 4296

.
-one

2.two
.
<p>-one</p>
<p>2.two</p>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 4309

.
- foo


  bar
.
<ul>
<li>
<p>foo</p>
<p>bar</p>
</li>
</ul>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 4326

.
1.  foo

    ```
    bar
    ```

    baz

    > bam
.
<ol>
<li>
<p>foo</p>
<pre><code>bar
</code></pre>
<p>baz</p>
<blockquote>
<p>bam</p>
</blockquote>
</li>
</ol>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 4354

.
- Foo

      bar


      baz
.
<ul>
<li>
<p>Foo</p>
<pre><code>bar


baz
</code></pre>
</li>
</ul>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 4376

.
123456789. ok
.
<ol start="123456789">
<li>ok</li>
</ol>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 4385

.
1234567890. not ok
.
<p>1234567890. not ok</p>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 4394

.
0. ok
.
<ol start="0">
<li>ok</li>
</ol>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 4403

.
003. ok
.
<ol start="3">
<li>ok</li>
</ol>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 4414

.
-1. not ok
.
<p>-1. not ok</p>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 4437

.
- foo

      bar
.
<ul>
<li>
<p>foo</p>
<pre><code>bar
</code></pre>
</li>
</ul>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 4454

.
  10.  foo

           bar
.
<ol start="10">
<li>
<p>foo</p>
<pre><code>bar
</code></pre>
</li>
</ol>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 4473

.
    indented code

paragraph

    more code
.
<pre><code>indented code
</code></pre>
<p>paragraph</p>
<pre><code>more code
</code></pre>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 4488

.
1.     indented code

   paragraph

       more code
.
<ol>
<li>
<pre><code>indented code
</code></pre>
<p>paragraph</p>
<pre><code>more code
</code></pre>
</li>
</ol>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 4510

.
1.      indented code

   paragraph

       more code
.
<ol>
<li>
<pre><code> indented code
</code></pre>
<p>paragraph</p>
<pre><code>more code
</code></pre>
</li>
</ol>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 4537

.
   foo

bar
.
<p>foo</p>
<p>bar</p>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 4547

.
-    foo

  bar
.
<ul>
<li>foo</li>
</ul>
<p>bar</p>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 4564

.
-  foo

   bar
.
<ul>
<li>
<p>foo</p>
<p>bar</p>
</li>
</ul>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 4591

.
-
  foo
-
  ```
  bar
  ```
-
      baz
.
<ul>
<li>foo</li>
<li>
<pre><code>bar
</code></pre>
</li>
<li>
<pre><code>baz
</code></pre>
</li>
</ul>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 4617

.
-   
  foo
.
<ul>
<li>foo</li>
</ul>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 4631

.
-

  foo
.
<ul>
<li></li>
</ul>
<p>foo</p>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 4645

.
- foo
-
- bar
.
<ul>
<li>foo</li>
<li></li>
<li>bar</li>
</ul>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 4660

.
- foo
-   
- bar
.
<ul>
<li>foo</li>
<li></li>
<li>bar</li>
</ul>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 4675

.
1. foo
2.
3. bar
.
<ol>
<li>foo</li>
<li></li>
<li>bar</li>
</ol>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 4690

.
*
.
<ul>
<li></li>
</ul>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 4700

.
foo
*

foo
1.
.
<p>foo
*</p>
<p>foo
1.</p>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 4722

.
 1.  A paragraph
     with two lines.

         indented code

     > A block quote.
.
<ol>
<li>
<p>A paragraph
with two lines.</p>
<pre><code>indented code
</code></pre>
<blockquote>
<p>A block quote.</p>
</blockquote>
</li>
</ol>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 4746

.
  1.  A paragraph
      with two lines.

          indented code

      > A block quote.
.
<ol>
<li>
<p>A paragraph
with two lines.</p>
<pre><code>indented code
</code></pre>
<blockquote>
<p>A block quote.</p>
</blockquote>
</li>
</ol>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 4770

.
   1.  A paragraph
       with two lines.

           indented code

       > A block quote.
.
<ol>
<li>
<p>A paragraph
with two lines.</p>
<pre><code>indented code
</code></pre>
<blockquote>
<p>A block quote.</p>
</blockquote>
</li>
</ol>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 4794

.
    1.  A paragraph
        with two lines.

            indented code

        > A block quote.
.
<pre><code>1.  A paragraph
    with two lines.

        indented code

    &gt; A block quote.
</code></pre>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 4824

.
  1.  A paragraph
with two lines.

          indented code

      > A block quote.
.
<ol>
<li>
<p>A paragraph
with two lines.</p>
<pre><code>indented code
</code></pre>
<blockquote>
<p>A block quote.</p>
</blockquote>
</li>
</ol>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 4848

.
  1.  A paragraph
    with two lines.
.
<ol>
<li>A paragraph
with two lines.</li>
</ol>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 4861

.
> 1. > Blockquote
continued here.
.
<blockquote>
<ol>
<li>
<blockquote>
<p>Blockquote
continued here.</p>
</blockquote>
</li>
</ol>
</blockquote>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 4878

.
> 1. > Blockquote
> continued here.
.
<blockquote>
<ol>
<li>
<blockquote>
<p>Blockquote
continued here.</p>
</blockquote>
</li>
</ol>
</blockquote>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 4906

.
- foo
  - bar
    - baz
      - boo
.
<ul>
<li>foo
<ul>
<li>bar
<ul>
<li>baz
<ul>
<li>boo</li>
</ul>
</li>
</ul>
</li>
</ul>
</li>
</ul>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 4932

.
- foo
 - bar
  - baz
   - boo
.
<ul>
<li>foo</li>
<li>bar</li>
<li>baz</li>
<li>boo</li>
</ul>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 4949

.
10) foo
    - bar
.
<ol start="10">
<li>foo
<ul>
<li>bar</li>
</ul>
</li>
</ol>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 4965

.
10) foo
   - bar
.
<ol start="10">
<li>foo</li>
</ol>
<ul>
<li>bar</li>
</ul>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 4980

.
- - foo
.
<ul>
<li>
<ul>
<li>foo</li>
</ul>
</li>
</ul>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 4993

.
1. - 2. foo
.
<ol>
<li>
<ul>
<li>
<ol start="2">
<li>foo</li>
</ol>
</li>
</ul>
</li>
</ol>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 5012

.
- # Foo
- Bar
  ---
  baz
.
<ul>
<li>
<h1>Foo</h1>
</li>
<li>
<h2>Bar</h2>
baz</li>
</ul>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 5248

.
- foo
- bar
+ baz
.
<ul>
<li>foo</li>
<li>bar</li>
</ul>
<ul>
<li>baz</li>
</ul>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 5263

.
1. foo
2. bar
3) baz
.
<ol>
<li>foo</li>
<li>bar</li>
</ol>
<ol start="3">
<li>baz</li>
</ol>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 5282

.
Foo
- bar
- baz
.
<p>Foo</p>
<ul>
<li>bar</li>
<li>baz</li>
</ul>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 5359

.
The number of windows in my house is
14.  The number of doors is 6.
.
<p>The number of windows in my house is
14.  The number of doors is 6.</p>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 5369

.
The number of windows in my house is
1.  The number of doors is 6.
.
<p>The number of windows in my house is</p>
<ol>
<li>The number of doors is 6.</li>
</ol>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 5383

.
- foo

- bar


- baz
.
<ul>
<li>
<p>foo</p>
</li>
<li>
<p>bar</p>
</li>
<li>
<p>baz</p>
</li>
</ul>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 5404

.
- foo
  - bar
    - baz


      bim
.
<ul>
<li>foo
<ul>
<li>bar
<ul>
<li>
<p>baz</p>
<p>bim</p>
</li>
</ul>
</li>
</ul>
</li>
</ul>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 5434

.
- foo
- bar

<!-- -->

- baz
- bim
.
<ul>
<li>foo</li>
<li>bar</li>
</ul>
<!-- -->
<ul>
<li>baz</li>
<li>bim</li>
</ul>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 5455

.
-   foo

    notcode

-   foo

<!-- -->

    code
.
<ul>
<li>
<p>foo</p>
<p>notcode</p>
</li>
<li>
<p>foo</p>
</li>
</ul>
<!-- -->
<pre><code>code
</code></pre>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 5486

.
- a
 - b
  - c
   - d
  - e
 - f
- g
.
<ul>
<li>a</li>
<li>b</li>
<li>c</li>
<li>d</li>
<li>e</li>
<li>f</li>
<li>g</li>
</ul>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 5507

.
1. a

  2. b

   3. c
.
<ol>
<li>
<p>a</p>
</li>
<li>
<p>b</p>
</li>
<li>
<p>c</p>
</li>
</ol>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 5531

.
- a
 - b
  - c
   - d
    - e
.
<ul>
<li>a</li>
<li>b</li>
<li>c</li>
<li>d
- e</li>
</ul>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 5551

.
1. a

  2. b

    3. c
.
<ol>
<li>
<p>a</p>
</li>
<li>
<p>b</p>
</li>
</ol>
<pre><code>3. c
</code></pre>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 5574

.
- a
- b

- c
.
<ul>
<li>
<p>a</p>
</li>
<li>
<p>b</p>
</li>
<li>
<p>c</p>
</li>
</ul>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 5596

.
* a
*

* c
.
<ul>
<li>
<p>a</p>
</li>
<li></li>
<li>
<p>c</p>
</li>
</ul>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 5618

.
- a
- b

  c
- d
.
<ul>
<li>
<p>a</p>
</li>
<li>
<p>b</p>
<p>c</p>
</li>
<li>
<p>d</p>
</li>
</ul>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 5640

.
- a
- b

  [ref]: /url
- d
.
<ul>
<li>
<p>a</p>
</li>
<li>
<p>b</p>
</li>
<li>
<p>d</p>
</li>
</ul>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 5663

.
- a
- ```
  b


  ```
- c
.
<ul>
<li>a</li>
<li>
<pre><code>b


</code></pre>
</li>
<li>c</li>
</ul>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 5689

.
- a
  - b

    c
- d
.
<ul>
<li>a
<ul>
<li>
<p>b</p>
<p>c</p>
</li>
</ul>
</li>
<li>d</li>
</ul>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 5713

.
* a
  > b
  >
* c
.
<ul>
<li>a
<blockquote>
<p>b</p>
</blockquote>
</li>
<li>c</li>
</ul>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 5733

.
- a
  > b
  ```
  c
  ```
- d
.
<ul>
<li>a
<blockquote>
<p>b</p>
</blockquote>
<pre><code>c
</code></pre>
</li>
<li>d</li>
</ul>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 5756

.
- a
.
<ul>
<li>a</li>
</ul>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 5765

.
- a
  - b
.
<ul>
<li>a
<ul>
<li>b</li>
</ul>
</li>
</ul>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 5782

.
1. ```
   foo
   ```

   bar
.
<ol>
<li>
<pre><code>foo
</code></pre>
<p>bar</p>
</li>
</ol>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 5801

.
* foo
  * bar

  baz
.
<ul>
<li>
<p>foo</p>
<ul>
<li>bar</li>
</ul>
<p>baz</p>
</li>
</ul>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 5819

.
- a
  - b
  - c

- d
  - e
  - f
.
<ul>
<li>
<p>a</p>
<ul>
<li>b</li>
<li>c</li>
</ul>
</li>
<li>
<p>d</p>
<ul>
<li>e</li>
<li>f</li>
</ul>
</li>
</ul>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 5853

.
`hi`lo`
.
<p><code>hi</code>lo`</p>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 5885

.
`foo`
.
<p><code>foo</code></p>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 5896

.
`` foo ` bar ``
.
<p><code>foo ` bar</code></p>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 5906

.
` `` `
.
<p><code>``</code></p>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 5914

.
`  ``  `
.
<p><code> `` </code></p>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 5923

.
` a`
.
<p><code> a</code></p>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 5932

.
` b `
.
<p><code> b </code></p>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 5940

.
` `
`  `
.
<p><code> </code>
<code>  </code></p>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 5951

.
``
foo
bar  
baz
``
.
<p><code>foo bar   baz</code></p>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 5961

.
``
foo 
``
.
<p><code>foo </code></p>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 5972

.
`foo   bar 
baz`
.
<p><code>foo   bar  baz</code></p>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 5989

.
`foo\`bar`
.
<p><code>foo\</code>bar`</p>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 6000

.
``foo`bar``
.
<p><code>foo`bar</code></p>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 6006

.
` foo `` bar `
.
<p><code>foo `` bar</code></p>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 6018

.
*foo`*`
.
<p>*foo<code>*</code></p>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 6027

.
[not a `link](/foo`)
.
<p>[not a <code>link](/foo</code>)</p>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 6037

.
`<a href="`">`
.
<p><code>&lt;a href=&quot;</code>&quot;&gt;`</p>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 6046

.
<a href="`">`
.
<p><a href="`">`</p>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 6055

.
`<https://foo.bar.`baz>`
.
<p><code>&lt;https://foo.bar.</code>baz&gt;`</p>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 6064

.
<https://foo.bar.`baz>`
.
<p><a href="https://foo.bar.%60baz">https://foo.bar.`baz</a>`</p>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 6074

.
```foo``
.
<p>```foo``</p>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 6081

.
`foo
.
<p>`foo</p>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 6090

.
`foo``bar``
.
<p>`foo<code>bar</code></p>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 6307

.
*foo bar*
.
<p><em>foo bar</em></p>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 6317

.
a * foo bar*
.
<p>a * foo bar*</p>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 6328

.
a*"foo"*
.
<p>a*&quot;foo&quot;*</p>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 6337

.
* a *
.
<p>* a *</p>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 6346

.
*$*alpha.

*£*bravo.

*€*charlie.
.
<p>*$*alpha.</p>
<p>*£*bravo.</p>
<p>*€*charlie.</p>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 6361

.
foo*bar*
.
<p>foo<em>bar</em></p>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 6368

.
5*6*78
.
<p>5<em>6</em>78</p>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 6377

.
_foo bar_
.
<p><em>foo bar</em></p>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 6387

.
_ foo bar_
.
<p>_ foo bar_</p>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 6397

.
a_"foo"_
.
<p>a_&quot;foo&quot;_</p>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 6406

.
foo_bar_
.
<p>foo_bar_</p>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 6413

.
5_6_78
.
<p>5_6_78</p>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 6420

.
пристаням_стремятся_
.
<p>пристаням_стремятся_</p>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 6430

.
aa_"bb"_cc
.
<p>aa_&quot;bb&quot;_cc</p>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 6441

.
foo-_(bar)_
.
<p>foo-<em>(bar)</em></p>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 6453

.
_foo*
.
<p>_foo*</p>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 6463

.
*foo bar *
.
<p>*foo bar *</p>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 6472

.
*foo bar
*
.
<p>*foo bar
*</p>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 6485

.
*(*foo)
.
<p>*(*foo)</p>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 6495

.
*(*foo*)*
.
<p><em>(<em>foo</em>)</em></p>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 6504

.
*foo*bar
.
<p><em>foo</em>bar</p>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 6517

.
_foo bar _
.
<p>_foo bar _</p>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 6527

.
_(_foo)
.
<p>_(_foo)</p>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 6536

.
_(_foo_)_
.
<p><em>(<em>foo</em>)</em></p>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 6545

.
_foo_bar
.
<p>_foo_bar</p>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 6552

.
_пристаням_стремятся
.
<p>_пристаням_стремятся</p>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 6559

.
_foo_bar_baz_
.
<p><em>foo_bar_baz</em></p>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 6570

.
_(bar)_.
.
<p><em>(bar)</em>.</p>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 6579

.
**foo bar**
.
<p><strong>foo bar</strong></p>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 6589

.
** foo bar**
.
<p>** foo bar**</p>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 6600

.
a**"foo"**
.
<p>a**&quot;foo&quot;**</p>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 6609

.
foo**bar**
.
<p>foo<strong>bar</strong></p>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 6618

.
__foo bar__
.
<p><strong>foo bar</strong></p>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 6628

.
__ foo bar__
.
<p>__ foo bar__</p>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 6636

.
__
foo bar__
.
<p>__
foo bar__</p>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 6648

.
a__"foo"__
.
<p>a__&quot;foo&quot;__</p>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 6657

.
foo__bar__
.
<p>foo__bar__</p>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 6664

.
5__6__78
.
<p>5__6__78</p>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 6671

.
пристаням__стремятся__
.
<p>пристаням__стремятся__</p>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 6678

.
__foo, __bar__, baz__
.
<p><strong>foo, <strong>bar</strong>, baz</strong></p>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 6689

.
foo-__(bar)__
.
<p>foo-<strong>(bar)</strong></p>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 6702

.
**foo bar **
.
<p>**foo bar **</p>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 6715

.
**(**foo)
.
<p>**(**foo)</p>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 6725

.
*(**foo**)*
.
<p><em>(<strong>foo</strong>)</em></p>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 6732

.
**Gomphocarpus (*Gomphocarpus physocarpus*, syn.
*Asclepias physocarpa*)**
.
<p><strong>Gomphocarpus (<em>Gomphocarpus physocarpus</em>, syn.
<em>Asclepias physocarpa</em>)</strong></p>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 6741

.
**foo "*bar*" foo**
.
<p><strong>foo &quot;<em>bar</em>&quot; foo</strong></p>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 6750

.
**foo**bar
.
<p><strong>foo</strong>bar</p>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 6762

.
__foo bar __
.
<p>__foo bar __</p>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 6772

.
__(__foo)
.
<p>__(__foo)</p>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 6782

.
_(__foo__)_
.
<p><em>(<strong>foo</strong>)</em></p>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 6791

.
__foo__bar
.
<p>__foo__bar</p>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 6798

.
__пристаням__стремятся
.
<p>__пристаням__стремятся</p>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 6805

.
__foo__bar__baz__
.
<p><strong>foo__bar__baz</strong></p>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 6816

.
__(bar)__.
.
<p><strong>(bar)</strong>.</p>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 6828

.
*foo [bar](/url)*
.
<p><em>foo <a href="/url">bar</a></em></p>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 6835

.
*foo
bar*
.
<p><em>foo
bar</em></p>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 6847

.
_foo __bar__ baz_
.
<p><em>foo <strong>bar</strong> baz</em></p>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 6854

.
_foo _bar_ baz_
.
<p><em>foo <em>bar</em> baz</em></p>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 6861

.
__foo_ bar_
.
<p><em><em>foo</em> bar</em></p>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 6868

.
*foo *bar**
.
<p><em>foo <em>bar</em></em></p>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 6875

.
*foo **bar** baz*
.
<p><em>foo <strong>bar</strong> baz</em></p>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 6881

.
*foo**bar**baz*
.
<p><em>foo<strong>bar</strong>baz</em></p>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 6905

.
*foo**bar*
.
<p><em>foo**bar</em></p>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 6918

.
***foo** bar*
.
<p><em><strong>foo</strong> bar</em></p>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 6925

.
*foo **bar***
.
<p><em>foo <strong>bar</strong></em></p>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 6932

.
*foo**bar***
.
<p><em>foo<strong>bar</strong></em></p>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 6943

.
foo***bar***baz
.
<p>foo<em><strong>bar</strong></em>baz</p>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 6949

.
foo******bar*********baz
.
<p>foo<strong><strong><strong>bar</strong></strong></strong>***baz</p>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 6958

.
*foo **bar *baz* bim** bop*
.
<p><em>foo <strong>bar <em>baz</em> bim</strong> bop</em></p>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 6965

.
*foo [*bar*](/url)*
.
<p><em>foo <a href="/url"><em>bar</em></a></em></p>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 6974

.
** is not an empty emphasis
.
<p>** is not an empty emphasis</p>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 6981

.
**** is not an empty strong emphasis
.
<p>**** is not an empty strong emphasis</p>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 6994

.
**foo [bar](/url)**
.
<p><strong>foo <a href="/url">bar</a></strong></p>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 7001

.
**foo
bar**
.
<p><strong>foo
bar</strong></p>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 7013

.
__foo _bar_ baz__
.
<p><strong>foo <em>bar</em> baz</strong></p>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 7020

.
__foo __bar__ baz__
.
<p><strong>foo <strong>bar</strong> baz</strong></p>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 7027

.
____foo__ bar__
.
<p><strong><strong>foo</strong> bar</strong></p>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 7034

.
**foo **bar****
.
<p><strong>foo <strong>bar</strong></strong></p>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 7041

.
**foo *bar* baz**
.
<p><strong>foo <em>bar</em> baz</strong></p>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 7048

.
**foo*bar*baz**
.
<p><strong>foo<em>bar</em>baz</strong></p>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 7055

.
***foo* bar**
.
<p><strong><em>foo</em> bar</strong></p>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 7062

.
**foo *bar***
.
<p><strong>foo <em>bar</em></strong></p>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 7071

.
**foo *bar **baz**
bim* bop**
.
<p><strong>foo <em>bar <strong>baz</strong>
bim</em> bop</strong></p>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 7080

.
**foo [*bar*](/url)**
.
<p><strong>foo <a href="/url"><em>bar</em></a></strong></p>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 7089

.
__ is not an empty emphasis
.
<p>__ is not an empty emphasis</p>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 7096

.
____ is not an empty strong emphasis
.
<p>____ is not an empty strong emphasis</p>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 7106

.
foo ***
.
<p>foo ***</p>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 7113

.
foo *\**
.
<p>foo <em>*</em></p>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 7120

.
foo *_*
.
<p>foo <em>_</em></p>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 7127

.
foo *****
.
<p>foo *****</p>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 7134

.
foo **\***
.
<p>foo <strong>*</strong></p>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 7141

.
foo **_**
.
<p>foo <strong>_</strong></p>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 7152

.
**foo*
.
<p>*<em>foo</em></p>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 7159

.
*foo**
.
<p><em>foo</em>*</p>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 7166

.
***foo**
.
<p>*<strong>foo</strong></p>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 7173

.
****foo*
.
<p>***<em>foo</em></p>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 7180

.
**foo***
.
<p><strong>foo</strong>*</p>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 7187

.
*foo****
.
<p><em>foo</em>***</p>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 7197

.
foo ___
.
<p>foo ___</p>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 7204

.
foo _\__
.
<p>foo <em>_</em></p>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 7211

.
foo _*_
.
<p>foo <em>*</em></p>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 7218

.
foo _____
.
<p>foo _____</p>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 7225

.
foo __\___
.
<p>foo <strong>_</strong></p>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 7232

.
foo __*__
.
<p>foo <strong>*</strong></p>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 7239

.
__foo_
.
<p>_<em>foo</em></p>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 7250

.
_foo__
.
<p><em>foo</em>_</p>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 7257

.
___foo__
.
<p>_<strong>foo</strong></p>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 7264

.
____foo_
.
<p>___<em>foo</em></p>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 7271

.
__foo___
.
<p><strong>foo</strong>_</p>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 7278

.
_foo____
.
<p><em>foo</em>___</p>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 7288

.
**foo**
.
<p><strong>foo</strong></p>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 7295

.
*_foo_*
.
<p><em><em>foo</em></em></p>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 7302

.
__foo__
.
<p><strong>foo</strong></p>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 7309

.
_*foo*_
.
<p><em><em>foo</em></em></p>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 7319

.
****foo****
.
<p><strong><strong>foo</strong></strong></p>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 7326

.
____foo____
.
<p><strong><strong>foo</strong></strong></p>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 7337

.
******foo******
.
<p><strong><strong><strong>foo</strong></strong></strong></p>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 7346

.
***foo***
.
<p><em><strong>foo</strong></em></p>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 7353

.
_____foo_____
.
<p><em><strong><strong>foo</strong></strong></em></p>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 7362

.
*foo _bar* baz_
.
<p><em>foo _bar</em> baz_</p>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 7369

.
*foo __bar *baz bim__ bam*
.
<p><em>foo <strong>bar *baz bim</strong> bam</em></p>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 7378

.
**foo **bar baz**
.
<p>**foo <strong>bar baz</strong></p>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 7385

.
*foo *bar baz*
.
<p>*foo <em>bar baz</em></p>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 7394

.
*[bar*](/url)
.
<p>*<a href="/url">bar*</a></p>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 7401

.
_foo [bar_](/url)
.
<p>_foo <a href="/url">bar_</a></p>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 7408

.
*<img src="foo" title="*"/>
.
<p>*<img src="foo" title="*"/></p>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 7415

.
**<a href="**">
.
<p>**<a href="**"></p>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 7422

.
__<a href="__">
.
<p>__<a href="__"></p>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 7429

.
*a `*`*
.
<p><em>a <code>*</code></em></p>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 7436

.
_a `_`_
.
<p><em>a <code>_</code></em></p>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 7443

.
**a<https://foo.bar/?q=**>
.
<p>**a<a href="https://foo.bar/?q=**">https://foo.bar/?q=**</a></p>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 7450

.
__a<https://foo.bar/?q=__>
.
<p>__a<a href="https://foo.bar/?q=__">https://foo.bar/?q=__</a></p>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 7538

.
[link](/uri "title")
.
<p><a href="/uri" title="title">link</a></p>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 7548

.
[link](/uri)
.
<p><a href="/uri">link</a></p>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 7554

.
[](./target.md)
.
<p><a href="./target.md"></a></p>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 7561

.
[link]()
.
<p><a href="">link</a></p>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 7568

.
[link](<>)
.
<p><a href="">link</a></p>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 7575

.
[]()
.
<p><a href=""></a></p>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 7584

.
[link](/my uri)
.
<p>[link](/my uri)</p>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 7590

.
[link](</my uri>)
.
<p><a href="/my%20uri">link</a></p>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 7599

.
[link](foo
bar)
.
<p>[link](foo
bar)</p>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 7607

.
[link](<foo
bar>)
.
<p>[link](<foo
bar>)</p>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 7618

.
[a](<b)c>)
.
<p><a href="b)c">a</a></p>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 7626

.
[link](<foo\>)
.
<p>[link](&lt;foo&gt;)</p>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 7635

.
[a](<b)c
[a](<b)c>
[a](<b>c)
.
<p>[a](&lt;b)c
[a](&lt;b)c&gt;
[a](<b>c)</p>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 7647

.
[link](\(foo\))
.
<p><a href="(foo)">link</a></p>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 7656

.
[link](foo(and(bar)))
.
<p><a href="foo(and(bar))">link</a></p>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 7665

.
[link](foo(and(bar))
.
<p>[link](foo(and(bar))</p>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 7672

.
[link](foo\(and\(bar\))
.
<p><a href="foo(and(bar)">link</a></p>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 7679

.
[link](<foo(and(bar)>)
.
<p><a href="foo(and(bar)">link</a></p>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 7689

.
[link](foo\)\:)
.
<p><a href="foo):">link</a></p>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 7698

.
[link](#fragment)

[link](https://example.com#fragment)

[link](https://example.com?foo=3#frag)
.
<p><a href="#fragment">link</a></p>
<p><a href="https://example.com#fragment">link</a></p>
<p><a href="https://example.com?foo=3#frag">link</a></p>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 7714

.
[link](foo\bar)
.
<p><a href="foo%5Cbar">link</a></p>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 7730

.
[link](foo%20b&auml;)
.
<p><a href="foo%20b%C3%A4">link</a></p>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 7741

.
[link]("title")
.
<p><a href="%22title%22">link</a></p>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 7750

.
[link](/url "title")
[link](/url 'title')
[link](/url (title))
.
<p><a href="/url" title="title">link</a>
<a href="/url" title="title">link</a>
<a href="/url" title="title">link</a></p>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 7764

.
[link](/url "title \"&quot;")
.
<p><a href="/url" title="title &quot;&quot;">link</a></p>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 7775

.
[link](/url "title")
.
<p><a href="/url%C2%A0%22title%22">link</a></p>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 7784

.
[link](/url "title "and" title")
.
<p>[link](/url &quot;title &quot;and&quot; title&quot;)</p>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 7793

.
[link](/url 'title "and" title')
.
<p><a href="/url" title="title &quot;and&quot; title">link</a></p>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 7818

.
[link](   /uri
  "title"  )
.
<p><a href="/uri" title="title">link</a></p>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 7829

.
[link] (/uri)
.
<p>[link] (/uri)</p>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 7839

.
[link [foo [bar]]](/uri)
.
<p><a href="/uri">link [foo [bar]]</a></p>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 7846

.
[link] bar](/uri)
.
<p>[link] bar](/uri)</p>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 7853

.
[link [bar](/uri)
.
<p>[link <a href="/uri">bar</a></p>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 7860

.
[link \[bar](/uri)
.
<p><a href="/uri">link [bar</a></p>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 7869

.
[link *foo **bar** `#`*](/uri)
.
<p><a href="/uri">link <em>foo <strong>bar</strong> <code>#</code></em></a></p>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 7876

.
[![moon](moon.jpg)](/uri)
.
<p><a href="/uri"><img src="moon.jpg" alt="moon" /></a></p>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 7885

.
[foo [bar](/uri)](/uri)
.
<p>[foo <a href="/uri">bar</a>](/uri)</p>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 7892

.
[foo *[bar [baz](/uri)](/uri)*](/uri)
.
<p>[foo <em>[bar <a href="/uri">baz</a>](/uri)</em>](/uri)</p>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 7899

.
![[[foo](uri1)](uri2)](uri3)
.
<p><img src="uri3" alt="[foo](uri2)" /></p>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 7909

.
*[foo*](/uri)
.
<p>*<a href="/uri">foo*</a></p>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 7916

.
[foo *bar](baz*)
.
<p><a href="baz*">foo *bar</a></p>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 7926

.
*foo [bar* baz]
.
<p><em>foo [bar</em> baz]</p>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 7936

.
[foo <bar attr="](baz)">
.
<p>[foo <bar attr="](baz)"></p>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 7943

.
[foo`](/uri)`
.
<p>[foo<code>](/uri)</code></p>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 7950

.
[foo<https://example.com/?search=](uri)>
.
<p>[foo<a href="https://example.com/?search=%5D(uri)">https://example.com/?search=](uri)</a></p>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 7988

.
[foo][bar]

[bar]: /url "title"
.
<p><a href="/url" title="title">foo</a></p>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 8003

.
[link [foo [bar]]][ref]

[ref]: /uri
.
<p><a href="/uri">link [foo [bar]]</a></p>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 8012

.
[link \[bar][ref]

[ref]: /uri
.
<p><a href="/uri">link [bar</a></p>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 8023

.
[link *foo **bar** `#`*][ref]

[ref]: /uri
.
<p><a href="/uri">link <em>foo <strong>bar</strong> <code>#</code></em></a></p>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 8032

.
[![moon](moon.jpg)][ref]

[ref]: /uri
.
<p><a href="/uri"><img src="moon.jpg" alt="moon" /></a></p>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 8043

.
[foo [bar](/uri)][ref]

[ref]: /uri
.
<p>[foo <a href="/uri">bar</a>]<a href="/uri">ref</a></p>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 8052

.
[foo *bar [baz][ref]*][ref]

[ref]: /uri
.
<p>[foo <em>bar <a href="/uri">baz</a></em>]<a href="/uri">ref</a></p>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 8067

.
*[foo*][ref]

[ref]: /uri
.
<p>*<a href="/uri">foo*</a></p>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 8076

.
[foo *bar][ref]*

[ref]: /uri
.
<p><a href="/uri">foo *bar</a>*</p>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 8088

.
[foo <bar attr="][ref]">

[ref]: /uri
.
<p>[foo <bar attr="][ref]"></p>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 8097

.
[foo`][ref]`

[ref]: /uri
.
<p>[foo<code>][ref]</code></p>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 8106

.
[foo<https://example.com/?search=][ref]>

[ref]: /uri
.
<p>[foo<a href="https://example.com/?search=%5D%5Bref%5D">https://example.com/?search=][ref]</a></p>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 8117

.
[foo][BaR]

[bar]: /url "title"
.
<p><a href="/url" title="title">foo</a></p>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 8128

.
[ẞ]

[SS]: /url
.
<p><a href="/url">ẞ</a></p>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 8140

.
[Foo
  bar]: /url

[Baz][Foo bar]
.
<p><a href="/url">Baz</a></p>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 8153

.
[foo] [bar]

[bar]: /url "title"
.
<p>[foo] <a href="/url" title="title">bar</a></p>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 8162

.
[foo]
[bar]

[bar]: /url "title"
.
<p>[foo]
<a href="/url" title="title">bar</a></p>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 8203

.
[foo]: /url1

[foo]: /url2

[bar][foo]
.
<p><a href="/url1">bar</a></p>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 8218

.
[bar][foo\!]

[foo!]: /url
.
<p>[bar][foo!]</p>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 8230

.
[foo][ref[]

[ref[]: /uri
.
<p>[foo][ref[]</p>
<p>[ref[]: /uri</p>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 8240

.
[foo][ref[bar]]

[ref[bar]]: /uri
.
<p>[foo][ref[bar]]</p>
<p>[ref[bar]]: /uri</p>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 8250

.
[[[foo]]]

[[[foo]]]: /url
.
<p>[[[foo]]]</p>
<p>[[[foo]]]: /url</p>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 8260

.
[foo][ref\[]

[ref\[]: /uri
.
<p><a href="/uri">foo</a></p>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 8271

.
[bar\\]: /uri

[bar\\]
.
<p><a href="/uri">bar\</a></p>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 8283

.
[]

[]: /uri
.
<p>[]</p>
<p>[]: /uri</p>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 8293

.
[
 ]

[
 ]: /uri
.
<p>[
]</p>
<p>[
]: /uri</p>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 8316

.
[foo][]

[foo]: /url "title"
.
<p><a href="/url" title="title">foo</a></p>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 8325

.
[*foo* bar][]

[*foo* bar]: /url "title"
.
<p><a href="/url" title="title"><em>foo</em> bar</a></p>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 8336

.
[Foo][]

[foo]: /url "title"
.
<p><a href="/url" title="title">Foo</a></p>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 8349

.
[foo] 
[]

[foo]: /url "title"
.
<p><a href="/url" title="title">foo</a>
[]</p>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 8369

.
[foo]

[foo]: /url "title"
.
<p><a href="/url" title="title">foo</a></p>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 8378

.
[*foo* bar]

[*foo* bar]: /url "title"
.
<p><a href="/url" title="title"><em>foo</em> bar</a></p>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 8387

.
[[*foo* bar]]

[*foo* bar]: /url "title"
.
<p>[<a href="/url" title="title"><em>foo</em> bar</a>]</p>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 8396

.
[[bar [foo]

[foo]: /url
.
<p>[[bar <a href="/url">foo</a></p>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 8407

.
[Foo]

[foo]: /url "title"
.
<p><a href="/url" title="title">Foo</a></p>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 8418

.
[foo] bar

[foo]: /url
.
<p><a href="/url">foo</a> bar</p>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 8430

.
\[foo]

[foo]: /url "title"
.
<p>[foo]</p>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 8442

.
[foo*]: /url

*[foo*]
.
<p>*<a href="/url">foo*</a></p>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 8454

.
[foo][bar]

[foo]: /url1
[bar]: /url2
.
<p><a href="/url2">foo</a></p>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 8463

.
[foo][]

[foo]: /url1
.
<p><a href="/url1">foo</a></p>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 8473

.
[foo]()

[foo]: /url1
.
<p><a href="">foo</a></p>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 8481

.
[foo](not a link)

[foo]: /url1
.
<p><a href="/url1">foo</a>(not a link)</p>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 8492

.
[foo][bar][baz]

[baz]: /url
.
<p>[foo]<a href="/url">bar</a></p>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 8504

.
[foo][bar][baz]

[baz]: /url1
[bar]: /url2
.
<p><a href="/url2">foo</a><a href="/url1">baz</a></p>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 8517

.
[foo][bar][baz]

[baz]: /url1
[foo]: /url2
.
<p>[foo]<a href="/url1">bar</a></p>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 8540

.
![foo](/url "title")
.
<p><img src="/url" alt="foo" title="title" /></p>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 8547

.
![foo *bar*]

[foo *bar*]: train.jpg "train & tracks"
.
<p><img src="train.jpg" alt="foo bar" title="train &amp; tracks" /></p>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 8556

.
![foo ![bar](/url)](/url2)
.
<p><img src="/url2" alt="foo bar" /></p>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 8563

.
![foo [bar](/url)](/url2)
.
<p><img src="/url2" alt="foo bar" /></p>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 8577

.
![foo *bar*][]

[foo *bar*]: train.jpg "train & tracks"
.
<p><img src="train.jpg" alt="foo bar" title="train &amp; tracks" /></p>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 8586

.
![foo *bar*][foobar]

[FOOBAR]: train.jpg "train & tracks"
.
<p><img src="train.jpg" alt="foo bar" title="train &amp; tracks" /></p>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 8595

.
![foo](train.jpg)
.
<p><img src="train.jpg" alt="foo" /></p>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 8602

.
My ![foo bar](/path/to/train.jpg  "title"   )
.
<p>My <img src="/path/to/train.jpg" alt="foo bar" title="title" /></p>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 8609

.
![foo](<url>)
.
<p><img src="url" alt="foo" /></p>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 8616

.
![](/url)
.
<p><img src="/url" alt="" /></p>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 8625

.
![foo][bar]

[bar]: /url
.
<p><img src="/url" alt="foo" /></p>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 8634

.
![foo][bar]

[BAR]: /url
.
<p><img src="/url" alt="foo" /></p>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 8645

.
![foo][]

[foo]: /url "title"
.
<p><img src="/url" alt="foo" title="title" /></p>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 8654

.
![*foo* bar][]

[*foo* bar]: /url "title"
.
<p><img src="/url" alt="foo bar" title="title" /></p>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 8665

.
![Foo][]

[foo]: /url "title"
.
<p><img src="/url" alt="Foo" title="title" /></p>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 8677

.
![foo] 
[]

[foo]: /url "title"
.
<p><img src="/url" alt="foo" title="title" />
[]</p>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 8690

.
![foo]

[foo]: /url "title"
.
<p><img src="/url" alt="foo" title="title" /></p>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 8699

.
![*foo* bar]

[*foo* bar]: /url "title"
.
<p><img src="/url" alt="foo bar" title="title" /></p>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 8710

.
![[foo]]

[[foo]]: /url "title"
.
<p>![[foo]]</p>
<p>[[foo]]: /url &quot;title&quot;</p>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 8722

.
![Foo]

[foo]: /url "title"
.
<p><img src="/url" alt="Foo" title="title" /></p>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 8734

.
!\[foo]

[foo]: /url "title"
.
<p>![foo]</p>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 8746

.
\![foo]

[foo]: /url "title"
.
<p>!<a href="/url" title="title">foo</a></p>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 8779

.
<http://foo.bar.baz>
.
<p><a href="http://foo.bar.baz">http://foo.bar.baz</a></p>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 8786

.
<https://foo.bar.baz/test?q=hello&id=22&boolean>
.
<p><a href="https://foo.bar.baz/test?q=hello&amp;id=22&amp;boolean">https://foo.bar.baz/test?q=hello&amp;id=22&amp;boolean</a></p>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 8793

.
<irc://foo.bar:2233/baz>
.
<p><a href="irc://foo.bar:2233/baz">irc://foo.bar:2233/baz</a></p>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 8802

.
<MAILTO:FOO@BAR.BAZ>
.
<p><a href="MAILTO:FOO@BAR.BAZ">MAILTO:FOO@BAR.BAZ</a></p>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 8814

.
<a+b+c:d>
.
<p><a href="a+b+c:d">a+b+c:d</a></p>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 8821

.
<made-up-scheme://foo,bar>
.
<p><a href="made-up-scheme://foo,bar">made-up-scheme://foo,bar</a></p>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 8828

.
<https://../>
.
<p><a href="https://../">https://../</a></p>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 8835

.
<localhost:5001/foo>
.
<p><a href="localhost:5001/foo">localhost:5001/foo</a></p>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 8844

.
<https://foo.bar/baz bim>
.
<p>&lt;https://foo.bar/baz bim&gt;</p>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 8853

.
<https://example.com/\[\>
.
<p><a href="https://example.com/%5C%5B%5C">https://example.com/\[\</a></p>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 8875

.
<foo@bar.example.com>
.
<p><a href="mailto:foo@bar.example.com">foo@bar.example.com</a></p>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 8882

.
<foo+special@Bar.baz-bar0.com>
.
<p><a href="mailto:foo+special@Bar.baz-bar0.com">foo+special@Bar.baz-bar0.com</a></p>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 8891

.
<foo\+@bar.example.com>
.
<p>&lt;foo+@bar.example.com&gt;</p>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 8900

.
<>
.
<p>&lt;&gt;</p>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 8907

.
< https://foo.bar >
.
<p>&lt; https://foo.bar &gt;</p>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 8914

.
<m:abc>
.
<p>&lt;m:abc&gt;</p>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 8921

.
<foo.bar.baz>
.
<p>&lt;foo.bar.baz&gt;</p>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 8928

.
https://example.com
.
<p>https://example.com</p>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 8935

.
foo@bar.example.com
.
<p>foo@bar.example.com</p>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 9015

.
<a><bab><c2c>
.
<p><a><bab><c2c></p>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 9024

.
<a/><b2/>
.
<p><a/><b2/></p>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 9033

.
<a  /><b2
data="foo" >
.
<p><a  /><b2
data="foo" ></p>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 9044

.
<a foo="bar" bam = 'baz <em>"</em>'
_boolean zoop:33=zoop:33 />
.
<p><a foo="bar" bam = 'baz <em>"</em>'
_boolean zoop:33=zoop:33 /></p>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 9055

.
Foo <responsive-image src="foo.jpg" />
.
<p>Foo <responsive-image src="foo.jpg" /></p>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 9064

.
<33> <__>
.
<p>&lt;33&gt; &lt;__&gt;</p>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 9073

.
<a h*#ref="hi">
.
<p>&lt;a h*#ref=&quot;hi&quot;&gt;</p>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 9082

.
<a href="hi'> <a href=hi'>
.
<p>&lt;a href=&quot;hi'&gt; &lt;a href=hi'&gt;</p>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 9091

.
< a><
foo><bar/ >
<foo bar=baz
bim!bop />
.
<p>&lt; a&gt;&lt;
foo&gt;&lt;bar/ &gt;
&lt;foo bar=baz
bim!bop /&gt;</p>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 9106

.
<a href='bar'title=title>
.
<p>&lt;a href='bar'title=title&gt;</p>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 9115

.
</a></foo >
.
<p></a></foo ></p>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 9124

.
</a href="foo">
.
<p>&lt;/a href=&quot;foo&quot;&gt;</p>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 9133

.
foo <!-- this is a --
comment - with hyphens -->
.
<p>foo <!-- this is a --
comment - with hyphens --></p>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 9141

.
foo <!--> foo -->

foo <!---> foo -->
.
<p>foo <!--> foo --&gt;</p>
<p>foo <!---> foo --&gt;</p>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 9153

.
foo <?php echo $a; ?>
.
<p>foo <?php echo $a; ?></p>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 9162

.
foo <!ELEMENT br EMPTY>
.
<p>foo <!ELEMENT br EMPTY></p>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 9171

.
foo <![CDATA[>&<]]>
.
<p>foo <![CDATA[>&<]]></p>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 9181

.
foo <a href="&ouml;">
.
<p>foo <a href="&ouml;"></p>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 9190

.
foo <a href="\*">
.
<p>foo <a href="\*"></p>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 9197

.
<a href="\"">
.
<p>&lt;a href=&quot;&quot;&quot;&gt;</p>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 9211

.
foo  
baz
.
<p>foo<br />
baz</p>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 9223

.
foo\
baz
.
<p>foo<br />
baz</p>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 9234

.
foo       
baz
.
<p>foo<br />
baz</p>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 9245

.
foo  
     bar
.
<p>foo<br />
bar</p>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 9254

.
foo\
     bar
.
<p>foo<br />
bar</p>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 9266

.
*foo  
bar*
.
<p><em>foo<br />
bar</em></p>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 9275

.
*foo\
bar*
.
<p><em>foo<br />
bar</em></p>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 9286

.
`code  
span`
.
<p><code>code   span</code></p>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 9294

.
`code\
span`
.
<p><code>code\ span</code></p>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 9304

.
<a href="foo  
bar">
.
<p><a href="foo  
bar"></p>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 9313

.
<a href="foo\
bar">
.
<p><a href="foo\
bar"></p>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 9326

.
foo\
.
<p>foo\</p>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 9333

.
foo  
.
<p>foo</p>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 9340

.
### foo\
.
<h3>foo\</h3>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 9347

.
### foo  
.
<h3>foo</h3>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 9362

.
foo
baz
.
<p>foo
baz</p>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 9374

.
foo 
 baz
.
<p>foo
baz</p>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 9394

.
hello $.;'there
.
<p>hello $.;'there</p>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 9401

.
Foo χρῆν
.
<p>Foo χρῆν</p>
.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src line: 9410

.
Multiple     spaces
.
<p>Multiple     spaces</p>
.
