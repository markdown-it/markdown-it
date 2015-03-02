Should not throw exception on invalid chars in URL (`*` not allowed in path) [mailformed URI]
.
[foo](<&#x25;test>)
.
<p><a href="%25test">foo</a></p>
.


Should not throw exception on broken utf-8 sequence in URL [mailformed URI]
.
[foo](%C3)
.
<p><a href="%C3">foo</a></p>
.


Should not throw exception on broken utf-16 surrogates sequence in URL [mailformed URI]
.
[foo](&#xD800;)
.
<p><a href="&amp;#xD800;">foo</a></p>
.


Should not hang comments regexp
.
foo <!--- xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx ->

foo <!------------------------------------------------------------------->
.
<p>foo &lt;!— xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx -&gt;</p>
<p>foo &lt;!-------------------------------------------------------------------&gt;</p>
.


Should not hang cdata regexp
.
foo <![CDATA[ xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx ]>
.
<p>foo &lt;![CDATA[ xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx ]&gt;</p>
.
