.
(bad)
.
<p>(bad)</p>
.


copyright
.
(c) (C)
.
<p>© ©</p>
.


reserved
.
(r) (R)
.
<p>® ®</p>
.


trademark
.
(tm) (TM)
.
<p>™ ™</p>
.


plus-minus
.
+-5
.
<p>±5</p>
.


ellipsis
.
test.. test... test..... test?..... test!....
.
<p>test… test… test… test?.. test!..</p>
.


dupes
.
!!!!!! ???? ,,
.
<p>!!! ??? ,</p>
.

copyright should be escapable
.
\(c)
.
<p>(c)</p>
.

shouldn't replace entities
.
&#40;c) (c&#41; (c)
.
<p>(c) (c) ©</p>
.


dashes
.
---markdownit --- super---

markdownit---awesome

abc ----

--markdownit -- super--

markdownit--awesome
.
<p>—markdownit — super—</p>
<p>markdownit—awesome</p>
<p>abc ----</p>
<p>–markdownit – super–</p>
<p>markdownit–awesome</p>
.

dashes should be escapable
.
foo \-- bar

foo -\- bar
.
<p>foo -- bar</p>
<p>foo -- bar</p>
.

regression tests for #624
.
1---2---3

1--2--3

1 -- -- 3
.
<p>1—2—3</p>
<p>1–2–3</p>
<p>1 – – 3</p>
.
