linkify
.
url http://www.youtube.com/watch?v=5Jt5GEr4AYg.
.
<p>url <a href="http://www.youtube.com/watch?v=5Jt5GEr4AYg">http://www.youtube.com/watch?v=5Jt5GEr4AYg</a>.</p>
.


don't touch text in links
.
[https://example.com](https://example.com)
.
<p><a href="https://example.com">https://example.com</a></p>
.


don't touch text in autolinks
.
<https://example.com>
.
<p><a href="https://example.com">https://example.com</a></p>
.


don't touch text in html <a> tags
.
<a href="https://example.com">https://example.com</a>
.
<p><a href="https://example.com">https://example.com</a></p>
.


entities inside raw links
.
https://example.com/foo&amp;bar
.
<p><a href="https://example.com/foo&amp;amp;bar">https://example.com/foo&amp;amp;bar</a></p>
.


emphasis inside raw links (asterisk, can happen in links with params)
.
https://example.com/foo*bar*baz
.
<p><a href="https://example.com/foo*bar*baz">https://example.com/foo*bar*baz</a></p>
.


emphasis inside raw links (underscore)
.
http://example.org/foo._bar_-_baz
.
<p><a href="http://example.org/foo._bar_-_baz">http://example.org/foo._bar_-_baz</a></p>
.


backticks inside raw links
.
https://example.com/foo`bar`baz
.
<p><a href="https://example.com/foo%60bar%60baz">https://example.com/foo`bar`baz</a></p>
.


links inside raw links
.
https://example.com/foo[123](456)bar
.
<p><a href="https://example.com/foo%5B123%5D(456)bar">https://example.com/foo[123](456)bar</a></p>
.


escapes not allowed at the start
.
\https://example.com
.
<p>\https://example.com</p>
.


escapes not allowed at comma
.
https\://example.com
.
<p>https://example.com</p>
.


escapes not allowed at slashes
.
https:\//aa.org https://bb.org
.
<p>https://aa.org <a href="https://bb.org">https://bb.org</a></p>
.


fuzzy link shouldn't match cc.org
.
https:/\/cc.org
.
<p>https://cc.org</p>
.


bold links (exclude markup of pairs from link tail)
.
**http://example.com/foobar**
.
<p><strong><a href="http://example.com/foobar">http://example.com/foobar</a></strong></p>
.


match links without protocol
.
www.example.org
.
<p><a href="http://www.example.org">www.example.org</a></p>
.


emails
.
test@example.com

mailto:test@example.com
.
<p><a href="mailto:test@example.com">test@example.com</a></p>
<p><a href="mailto:test@example.com">mailto:test@example.com</a></p>
.


typorgapher should not break href
.
http://example.com/(c)
.
<p><a href="http://example.com/(c)">http://example.com/(c)</a></p>
.


coverage, prefix not valid
.
http:/example.com/
.
<p>http:/example.com/</p>
.


coverage, negative link level
.
</a>[https://example.com](https://example.com)
.
<p></a><a href="https://example.com"><a href="https://example.com">https://example.com</a></a></p>
.


emphasis with '*', real link:
.
http://cdecl.ridiculousfish.com/?q=int+%28*f%29+%28float+*%29%3B
.
<p><a href="http://cdecl.ridiculousfish.com/?q=int+%28*f%29+%28float+*%29%3B">http://cdecl.ridiculousfish.com/?q=int+(*f)+(float+*)%3B</a></p>
.


emphasis with '_', real link:
.
https://www.sell.fi/sites/default/files/elainlaakarilehti/tieteelliset_artikkelit/kahkonen_t._et_al.canine_pancreatitis-_review.pdf
.
<p><a href="https://www.sell.fi/sites/default/files/elainlaakarilehti/tieteelliset_artikkelit/kahkonen_t._et_al.canine_pancreatitis-_review.pdf">https://www.sell.fi/sites/default/files/elainlaakarilehti/tieteelliset_artikkelit/kahkonen_t._et_al.canine_pancreatitis-_review.pdf</a></p>
.

regression test, invalid link:
.
i.org[x[x][xx: htt://a.b://a
.
<p><a href="http://i.org">i.org</a>[x[x][xx: htt://a.b://a</p>
.
