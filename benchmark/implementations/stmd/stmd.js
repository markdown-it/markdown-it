// stmd.js - CommomMark in javascript
// Copyright (C) 2014 John MacFarlane
// License: BSD3.

// Basic usage:
//
// var stmd = require('stmd');
// var parser = new stmd.DocParser();
// var renderer = new stmd.HtmlRenderer();
// console.log(renderer.render(parser.parse('Hello *world*')));

(function(exports) {

// Some regexps used in inline parser:

var ESCAPABLE = '[!"#$%&\'()*+,./:;<=>?@[\\\\\\]^_`{|}~-]';
var ESCAPED_CHAR = '\\\\' + ESCAPABLE;
var IN_DOUBLE_QUOTES = '"(' + ESCAPED_CHAR + '|[^"\\x00])*"';
var IN_SINGLE_QUOTES = '\'(' + ESCAPED_CHAR + '|[^\'\\x00])*\'';
var IN_PARENS = '\\((' + ESCAPED_CHAR + '|[^)\\x00])*\\)';
var REG_CHAR = '[^\\\\()\\x00-\\x20]';
var IN_PARENS_NOSP = '\\((' + REG_CHAR + '|' + ESCAPED_CHAR + ')*\\)';
var TAGNAME = '[A-Za-z][A-Za-z0-9]*';
var BLOCKTAGNAME = '(?:article|header|aside|hgroup|iframe|blockquote|hr|body|li|map|button|object|canvas|ol|caption|output|col|p|colgroup|pre|dd|progress|div|section|dl|table|td|dt|tbody|embed|textarea|fieldset|tfoot|figcaption|th|figure|thead|footer|footer|tr|form|ul|h1|h2|h3|h4|h5|h6|video|script|style)';
var ATTRIBUTENAME = '[a-zA-Z_:][a-zA-Z0-9:._-]*';
var UNQUOTEDVALUE = "[^\"'=<>`\\x00-\\x20]+";
var SINGLEQUOTEDVALUE = "'[^']*'";
var DOUBLEQUOTEDVALUE = '"[^"]*"';
var ATTRIBUTEVALUE = "(?:" + UNQUOTEDVALUE + "|" + SINGLEQUOTEDVALUE + "|" + DOUBLEQUOTEDVALUE + ")";
var ATTRIBUTEVALUESPEC = "(?:" + "\\s*=" + "\\s*" + ATTRIBUTEVALUE + ")";
var ATTRIBUTE = "(?:" + "\\s+" + ATTRIBUTENAME + ATTRIBUTEVALUESPEC + "?)";
var OPENTAG = "<" + TAGNAME + ATTRIBUTE + "*" + "\\s*/?>";
var CLOSETAG = "</" + TAGNAME + "\\s*[>]";
var OPENBLOCKTAG = "<" + BLOCKTAGNAME + ATTRIBUTE + "*" + "\\s*/?>";
var CLOSEBLOCKTAG = "</" + BLOCKTAGNAME + "\\s*[>]";
var HTMLCOMMENT = "<!--([^-]+|[-][^-]+)*-->";
var PROCESSINGINSTRUCTION = "[<][?].*?[?][>]";
var DECLARATION = "<![A-Z]+" + "\\s+[^>]*>";
var CDATA = "<!\\[CDATA\\[([^\\]]+|\\][^\\]]|\\]\\][^>])*\\]\\]>";
var HTMLTAG = "(?:" + OPENTAG + "|" + CLOSETAG + "|" + HTMLCOMMENT + "|" +
           PROCESSINGINSTRUCTION + "|" + DECLARATION + "|" + CDATA + ")";
var HTMLBLOCKOPEN = "<(?:" + BLOCKTAGNAME + "[\\s/>]" + "|" +
    "/" + BLOCKTAGNAME + "[\\s>]" + "|" + "[?!])";

var reHtmlTag = new RegExp('^' + HTMLTAG, 'i');

var reHtmlBlockOpen = new RegExp('^' + HTMLBLOCKOPEN, 'i');

var reLinkTitle = new RegExp(
    '^(?:"(' + ESCAPED_CHAR + '|[^"\\x00])*"' +
    '|' +
    '\'(' + ESCAPED_CHAR + '|[^\'\\x00])*\'' +
    '|' +
    '\\((' + ESCAPED_CHAR + '|[^)\\x00])*\\))');

var reLinkDestinationBraces = new RegExp(
    '^(?:[<](?:[^<>\\n\\\\\\x00]' + '|' + ESCAPED_CHAR + '|' + '\\\\)*[>])');

var reLinkDestination = new RegExp(
    '^(?:' + REG_CHAR + '+|' + ESCAPED_CHAR + '|' + IN_PARENS_NOSP + ')*');

var reEscapable = new RegExp(ESCAPABLE);

var reAllEscapedChar = new RegExp('\\\\(' + ESCAPABLE + ')', 'g');

var reEscapedChar = new RegExp('^\\\\(' + ESCAPABLE + ')');

var reAllTab = /\t/g;

var reHrule = /^(?:(?:\* *){3,}|(?:_ *){3,}|(?:- *){3,}) *$/;

// Matches a character with a special meaning in markdown,
// or a string of non-special characters.
var reMain = /^(?:[\n`\[\]\\!<&*_]|[^\n`\[\]\\!<&*_]+)/m;

// UTILITY FUNCTIONS

// Replace backslash escapes with literal characters.
var unescape = function(s) {
  return s.replace(reAllEscapedChar, '$1');
};

// Returns true if string contains only space characters.
var isBlank = function(s) {
  return /^\s*$/.test(s);
};

// Normalize reference label: collapse internal whitespace
// to single space, remove leading/trailing whitespace, case fold.
var normalizeReference = function(s) {
  return s.trim()
          .replace(/\s+/,' ')
          .toUpperCase();
};

// Attempt to match a regex in string s at offset offset.
// Return index of match or null.
var matchAt = function(re, s, offset) {
  var res = s.slice(offset).match(re);
  if (res) {
    return offset + res.index;
  } else {
    return null;
  }
};

// Convert tabs to spaces on each line using a 4-space tab stop.
var detabLine = function(text) {
  if (text.indexOf('\t') == -1) {
    return text;
  } else {
    var lastStop = 0;
    return text.replace(reAllTab, function(match, offset) {
      var result = '    '.slice((offset - lastStop) % 4);
      lastStop = offset + 1;
      return result;
    });
  }
};

// INLINE PARSER

// These are methods of an InlineParser object, defined below.
// An InlineParser keeps track of a subject (a string to be
// parsed) and a position in that subject.

// If re matches at current position in the subject, advance
// position in subject and return the match; otherwise return null.
var match = function(re) {
  var match = re.exec(this.subject.slice(this.pos));
  if (match) {
    this.pos += match.index + match[0].length;
    return match[0];
  } else {
    return null;
  }
};

// Returns the character at the current subject position, or null if
// there are no more characters.
var peek = function() {
  return this.subject[this.pos] || null;
};

// Parse zero or more space characters, including at most one newline
var spnl = function() {
  this.match(/^ *(?:\n *)?/);
  return 1;
};

// All of the parsers below try to match something at the current position
// in the subject.  If they succeed in matching anything, they
// push an inline element onto the 'inlines' list.  They return the
// number of characters parsed (possibly 0).

// Attempt to parse backticks, adding either a backtick code span or a
// literal sequence of backticks to the 'inlines' list.
var parseBackticks = function(inlines) {
  var startpos = this.pos;
  var ticks = this.match(/^`+/);
  if (!ticks) {
    return 0;
  }
  var afterOpenTicks = this.pos;
  var foundCode = false;
  var match;
  while (!foundCode && (match = this.match(/`+/m))) {
    if (match == ticks) {
      inlines.push({ t: 'Code', c: this.subject.slice(afterOpenTicks,
                                   this.pos - ticks.length)
             .replace(/[ \n]+/g,' ')
             .trim() });
      return (this.pos - startpos);
    }
  }
  // If we got here, we didn't match a closing backtick sequence.
  inlines.push({ t: 'Str', c: ticks });
  this.pos = afterOpenTicks;
  return (this.pos - startpos);
};

// Parse a backslash-escaped special character, adding either the escaped
// character, a hard line break (if the backslash is followed by a newline),
// or a literal backslash to the 'inlines' list.
var parseEscaped = function(inlines) {
  var subj = this.subject,
      pos  = this.pos;
  if (subj[pos] === '\\') {
    if (subj[pos + 1] === '\n') {
      inlines.push({ t: 'Hardbreak' });
      this.pos = this.pos + 2;
      return 2;
    } else if (reEscapable.test(subj[pos + 1])) {
      inlines.push({ t: 'Str', c: subj[pos + 1] });
      this.pos = this.pos + 2;
      return 2;
    } else {
      this.pos++;
      inlines.push({t: 'Str', c: '\\'});
      return 1;
    }
  } else {
    return 0;
  }
};

// Attempt to parse an autolink (URL or email in pointy brackets).
var parseAutolink = function(inlines) {
  var m;
  var dest;
  if ((m = this.match(/^<([a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*)>/))) {  // email autolink
    dest = m.slice(1,-1);
    inlines.push({ t: 'Link', label: [{ t: 'Str', c: dest }],
                   destination: 'mailto:' + dest });
    return m.length;
  } else if ((m = this.match(/^<(?:coap|doi|javascript|aaa|aaas|about|acap|cap|cid|crid|data|dav|dict|dns|file|ftp|geo|go|gopher|h323|http|https|iax|icap|im|imap|info|ipp|iris|iris.beep|iris.xpc|iris.xpcs|iris.lwz|ldap|mailto|mid|msrp|msrps|mtqp|mupdate|news|nfs|ni|nih|nntp|opaquelocktoken|pop|pres|rtsp|service|session|shttp|sieve|sip|sips|sms|snmp|soap.beep|soap.beeps|tag|tel|telnet|tftp|thismessage|tn3270|tip|tv|urn|vemmi|ws|wss|xcon|xcon-userid|xmlrpc.beep|xmlrpc.beeps|xmpp|z39.50r|z39.50s|adiumxtra|afp|afs|aim|apt|attachment|aw|beshare|bitcoin|bolo|callto|chrome|chrome-extension|com-eventbrite-attendee|content|cvs|dlna-playsingle|dlna-playcontainer|dtn|dvb|ed2k|facetime|feed|finger|fish|gg|git|gizmoproject|gtalk|hcp|icon|ipn|irc|irc6|ircs|itms|jar|jms|keyparc|lastfm|ldaps|magnet|maps|market|message|mms|ms-help|msnim|mumble|mvn|notes|oid|palm|paparazzi|platform|proxy|psyc|query|res|resource|rmi|rsync|rtmp|secondlife|sftp|sgn|skype|smb|soldat|spotify|ssh|steam|svn|teamspeak|things|udp|unreal|ut2004|ventrilo|view-source|webcal|wtai|wyciwyg|xfire|xri|ymsgr):[^<>\x00-\x20]*>/i))) {
    dest = m.slice(1,-1);
    inlines.push({ t: 'Link', label: [{ t: 'Str', c: dest }],
                   destination: dest });
    return m.length;
  } else {
    return 0;
  }
};

// Attempt to parse a raw HTML tag.
var parseHtmlTag = function(inlines) {
  var m = this.match(reHtmlTag);
  if (m) {
    inlines.push({ t: 'Html', c: m });
    return m.length;
  } else {
    return 0;
  }
};

// Scan a sequence of characters == c, and return information about
// the number of delimiters and whether they are positioned such that
// they can open and/or close emphasis or strong emphasis.  A utility
// function for strong/emph parsing.
var scanDelims = function(c) {
  var numdelims = 0;
  var first_close_delims = 0;
  var char_before, char_after;
  var startpos = this.pos;

  char_before = this.pos === 0 ? '\n' :
    this.subject[this.pos - 1];

  while (this.peek() === c) {
    numdelims++;
    this.pos++;
  }

  char_after = this.peek() || '\n';

  var can_open = numdelims > 0 && numdelims <= 3 && !(/\s/.test(char_after));
  var can_close = numdelims > 0 && numdelims <= 3 && !(/\s/.test(char_before));
  if (c === '_') {
    can_open = can_open && !((/[a-z0-9]/i).test(char_before));
    can_close = can_close && !((/[a-z0-9]/i).test(char_after));
  }
  this.pos = startpos;
  return { numdelims: numdelims,
           can_open: can_open,
           can_close: can_close };
};

// Attempt to parse emphasis or strong emphasis in an efficient way,
// with no backtracking.
var parseEmphasis = function(inlines) {
  var startpos = this.pos;
  var c ;
  var first_close = 0;
  var nxt = this.peek();
  if (nxt == '*' || nxt == '_') {
    c = nxt;
  } else {
    return 0;
  }

  var numdelims;
  var delimpos;

  // Get opening delimiters.
  res = this.scanDelims(c);
  numdelims = res.numdelims;
  this.pos += numdelims;
  // We provisionally add a literal string.  If we match appropriate
  // closing delimiters, we'll change this to Strong or Emph.
  inlines.push({t: 'Str',
               c: this.subject.substr(this.pos - numdelims, numdelims)});
  // Record the position of this opening delimiter:
  delimpos = inlines.length - 1;

  if (!res.can_open || numdelims === 0) {
    return 0;
  }

  var first_close_delims = 0;

  switch (numdelims) {
  case 1:  // we started with * or _
    while (true) {
      res = this.scanDelims(c);
      if (res.numdelims >= 1 && res.can_close) {
        this.pos += 1;
        // Convert the inline at delimpos, currently a string with the delim,
        // into an Emph whose contents are the succeeding inlines
        inlines[delimpos].t = 'Emph';
        inlines[delimpos].c = inlines.slice(delimpos + 1);
        inlines.splice(delimpos + 1);
        break;
      } else {
        if (this.parseInline(inlines) === 0) {
          break;
        }
      }
    }
    return (this.pos - startpos);

  case 2:  // We started with ** or __
    while (true) {
      res = this.scanDelims(c);
      if (res.numdelims >= 2 && res.can_close) {
        this.pos += 2;
        inlines[delimpos].t = 'Strong';
        inlines[delimpos].c = inlines.slice(delimpos + 1);
        inlines.splice(delimpos + 1);
        break;
      } else {
        if (this.parseInline(inlines) === 0) {
          break;
        }
      }
    }
    return (this.pos - startpos);

  case 3:  // We started with *** or ___
    while (true) {
      res = this.scanDelims(c);
      if (res.numdelims >= 1 && res.numdelims <= 3 && res.can_close &&
            res.numdelims != first_close_delims) {

        if (first_close_delims === 1 && numdelims > 2) {
          res.numdelims = 2;
        } else if (first_close_delims === 2) {
          res.numdelims = 1;
        } else if (res.numdelims === 3) {
          // If we opened with ***, then we interpret *** as ** followed by *
          // giving us <strong><em>
          res.numdelims = 1;
        }

        this.pos += res.numdelims;

        if (first_close > 0) { // if we've already passed the first closer:
          inlines[delimpos].t = first_close_delims === 1 ? 'Strong' : 'Emph';
          inlines[delimpos].c = [
             { t: first_close_delims === 1 ? 'Emph' : 'Strong',
               c: inlines.slice(delimpos + 1, first_close)}
            ].concat(inlines.slice(first_close + 1));
          inlines.splice(delimpos + 1);
          break;
        } else {  // this is the first closer; for now, add literal string;
                  // we'll change this when he hit the second closer
          inlines.push({t: 'Str',
                        c: this.subject.slice(this.pos - res.numdelims,
                                              this.pos) });
          first_close = inlines.length - 1;
          first_close_delims = res.numdelims;
        }
      } else {  // parse another inline element, til we hit the end
        if (this.parseInline(inlines) === 0) {
          break;
        }
      }
    }
    return (this.pos - startpos);

  default:
    return res;
  }

  return 0;
};

// Attempt to parse link title (sans quotes), returning the string
// or null if no match.
var parseLinkTitle = function() {
  var title = this.match(reLinkTitle);
  if (title) {
    // chop off quotes from title and unescape:
    return unescape(title.substr(1, title.length - 2));
  } else {
    return null;
  }
};

// Attempt to parse link destination, returning the string or
// null if no match.
var parseLinkDestination = function() {
  var res = this.match(reLinkDestinationBraces);
  if (res) {  // chop off surrounding <..>:
    return unescape(res.substr(1, res.length - 2));
  } else {
    res = this.match(reLinkDestination);
    if (res !== null) {
      return unescape(res);
    } else {
      return null;
    }
  }
};

// Attempt to parse a link label, returning number of characters parsed.
var parseLinkLabel = function() {
  if (this.peek() != '[') {
    return 0;
  }
  var startpos = this.pos;
  var nest_level = 0;
  if (this.label_nest_level > 0) {
    // If we've already checked to the end of this subject
    // for a label, even with a different starting [, we
    // know we won't find one here and we can just return.
    // This avoids lots of backtracking.
    // Note:  nest level 1 would be: [foo [bar]
    //        nest level 2 would be: [foo [bar [baz]
    this.label_nest_level--;
    return 0;
  }
  this.pos++;  // advance past [
  var c;
  while ((c = this.peek()) && (c != ']' || nest_level > 0)) {
    switch (c) {
      case '`':
        this.parseBackticks([]);
        break;
      case '<':
        this.parseAutolink([]) || this.parseHtmlTag([]) || this.parseString([]);
        break;
      case '[':  // nested []
        nest_level++;
        this.pos++;
        break;
      case ']':  // nested []
        nest_level--;
        this.pos++;
        break;
      case '\\':
        this.parseEscaped([]);
        break;
      default:
        this.parseString([]);
    }
  }
  if (c === ']') {
    this.label_nest_level = 0;
    this.pos++; // advance past ]
    return this.pos - startpos;
  } else {
    if (!c) {
      this.label_nest_level = nest_level;
    }
    this.pos = startpos;
    return 0;
  }
};

// Parse raw link label, including surrounding [], and return
// inline contents.  (Note:  this is not a method of InlineParser.)
var parseRawLabel = function(s) {
  // note:  parse without a refmap; we don't want links to resolve
  // in nested brackets!
  return new InlineParser().parse(s.substr(1, s.length - 2), {});
};

// Attempt to parse a link.  If successful, add the link to
// inlines.
var parseLink = function(inlines) {
  var startpos = this.pos;
  var reflabel;
  var n;
  var dest;
  var title;

  n = this.parseLinkLabel();
  if (n === 0) {
    return 0;
  }
  var afterlabel = this.pos;
  var rawlabel = this.subject.substr(startpos, n);

  // if we got this far, we've parsed a label.
  // Try to parse an explicit link: [label](url "title")
  if (this.peek() == '(') {
    this.pos++;
    if (this.spnl() &&
        ((dest = this.parseLinkDestination()) !== null) &&
        this.spnl() &&
        // make sure there's a space before the title:
        (/^\s/.test(this.subject[this.pos - 1]) &&
         (title = this.parseLinkTitle() || '') || true) &&
        this.spnl() &&
        this.match(/^\)/)) {
        inlines.push({ t: 'Link',
                       destination: dest,
                       title: title,
                       label: parseRawLabel(rawlabel) });
        return this.pos - startpos;
     } else {
        this.pos = startpos;
        return 0;
     }
  }
  // If we're here, it wasn't an explicit link. Try to parse a reference link.
  // first, see if there's another label
  var savepos = this.pos;
  this.spnl();
  var beforelabel = this.pos;
  n = this.parseLinkLabel();
  if (n == 2) {
    // empty second label
    reflabel = rawlabel;
  } else if (n > 0) {
    reflabel = this.subject.slice(beforelabel, beforelabel + n);
  } else {
    this.pos = savepos;
    reflabel = rawlabel;
  }
  // lookup rawlabel in refmap
  var link = this.refmap[normalizeReference(reflabel)];
  if (link) {
    inlines.push({t: 'Link',
                  destination: link.destination,
                  title: link.title,
                  label: parseRawLabel(rawlabel) });
    return this.pos - startpos;
  } else {
    this.pos = startpos;
    return 0;
  }
  // Nothing worked, rewind:
  this.pos = startpos;
  return 0;
};

// Attempt to parse an entity, adding to inlines if successful.
var parseEntity = function(inlines) {
  var m;
  if ((m = this.match(/^&(?:#x[a-f0-9]{1,8}|#[0-9]{1,8}|[a-z][a-z0-9]{1,31});/i))) {
      inlines.push({ t: 'Entity', c: m });
      return m.length;
  } else {
      return  0;
  }
};

// Parse a run of ordinary characters, or a single character with
// a special meaning in markdown, as a plain string, adding to inlines.
var parseString = function(inlines) {
  var m;
  if ((m = this.match(reMain))) {
    inlines.push({ t: 'Str', c: m });
    return m.length;
  } else {
    return 0;
  }
};

// Parse a newline.  If it was preceded by two spaces, return a hard
// line break; otherwise a soft line break.
var parseNewline = function(inlines) {
  if (this.peek() == '\n') {
    this.pos++;
    var last = inlines[inlines.length - 1];
    if (last && last.t == 'Str' && last.c.slice(-2) == '  ') {
      last.c = last.c.replace(/ *$/,'');
      inlines.push({ t: 'Hardbreak' });
    } else {
      if (last && last.t == 'Str' && last.c.slice(-1) == ' ') {
        last.c = last.c.slice(0, -1);
      }
      inlines.push({ t: 'Softbreak' });
    }
    return 1;
  } else {
    return 0;
  }
};

// Attempt to parse an image.  If the opening '!' is not followed
// by a link, add a literal '!' to inlines.
var parseImage = function(inlines) {
  if (this.match(/^!/)) {
    var n = this.parseLink(inlines);
    if (n === 0) {
      inlines.push({ t: 'Str', c: '!' });
      return 1;
    } else if (inlines[inlines.length - 1] &&
               inlines[inlines.length - 1].t == 'Link') {
      inlines[inlines.length - 1].t = 'Image';
      return n+1;
    } else {
      throw "Shouldn't happen";
    }
  } else {
    return 0;
  }
};

// Attempt to parse a link reference, modifying refmap.
var parseReference = function(s, refmap) {
  this.subject = s;
  this.pos = 0;
  var rawlabel;
  var dest;
  var title;
  var matchChars;
  var startpos = this.pos;
  var match;

  // label:
  matchChars = this.parseLinkLabel();
  if (matchChars === 0) {
    return 0;
  } else {
    rawlabel = this.subject.substr(0, matchChars);
  }

  // colon:
  if (this.peek() === ':') {
    this.pos++;
  } else {
    this.pos = startpos;
    return 0;
  }

  //  link url
  this.spnl();

  dest = this.parseLinkDestination();
  if (dest === null || dest.length === 0) {
    this.pos = startpos;
    return 0;
  }

  var beforetitle = this.pos;
  this.spnl();
  title = this.parseLinkTitle();
  if (title === null) {
    title = '';
    // rewind before spaces
    this.pos = beforetitle;
  }

  // make sure we're at line end:
  if (this.match(/^ *(?:\n|$)/) === null) {
    this.pos = startpos;
    return 0;
  }

  var normlabel = normalizeReference(rawlabel);

  if (!refmap[normlabel]) {
    refmap[normlabel] = { destination: dest, title: title };
  }
  return this.pos - startpos;
};

// Parse the next inline element in subject, advancing subject position
// and adding the result to 'inlines'.
var parseInline = function(inlines) {
  var c = this.peek();
  var res;
  switch(c) {
  case '\n':
    res = this.parseNewline(inlines);
    break;
  case '\\':
    res = this.parseEscaped(inlines);
    break;
  case '`':
    res = this.parseBackticks(inlines);
    break;
  case '*':
  case '_':
    res = this.parseEmphasis(inlines);
    break;
  case '[':
    res = this.parseLink(inlines);
    break;
  case '!':
    res = this.parseImage(inlines);
    break;
  case '<':
    res = this.parseAutolink(inlines) ||
      this.parseHtmlTag(inlines);
    break;
  case '&':
    res = this.parseEntity(inlines);
    break;
  default:
  }
  return res || this.parseString(inlines);
};

// Parse s as a list of inlines, using refmap to resolve references.
var parseInlines = function(s, refmap) {
  this.subject = s;
  this.pos = 0;
  this.refmap = refmap || {};
  var inlines = [];
  while (this.parseInline(inlines)) ;
  return inlines;
};

// The InlineParser object.
function InlineParser(){
  return {
    subject: '',
    label_nest_level: 0, // used by parseLinkLabel method
    pos: 0,
    refmap: {},
    match: match,
    peek: peek,
    spnl: spnl,
    parseBackticks: parseBackticks,
    parseEscaped: parseEscaped,
    parseAutolink: parseAutolink,
    parseHtmlTag: parseHtmlTag,
    scanDelims: scanDelims,
    parseEmphasis: parseEmphasis,
    parseLinkTitle: parseLinkTitle,
    parseLinkDestination: parseLinkDestination,
    parseLinkLabel: parseLinkLabel,
    parseLink: parseLink,
    parseEntity: parseEntity,
    parseString: parseString,
    parseNewline: parseNewline,
    parseImage: parseImage,
    parseReference: parseReference,
    parseInline: parseInline,
    parse: parseInlines
  };
}

// DOC PARSER

// These are methods of a DocParser object, defined below.

var makeBlock = function(tag, start_line, start_column) {
  return { t: tag,
           open: true,
           last_line_blank: false,
           start_line: start_line,
           start_column: start_column,
           end_line: start_line,
           children: [],
           parent: null,
           // string_content is formed by concatenating strings, in finalize:
           string_content: "",
           strings: [],
           inline_content: []
        };
};

// Returns true if parent block can contain child block.
var canContain = function(parent_type, child_type) {
  return ( parent_type == 'Document' ||
           parent_type == 'BlockQuote' ||
           parent_type == 'ListItem' ||
           (parent_type == 'List' && child_type == 'ListItem') );
};

// Returns true if block type can accept lines of text.
var acceptsLines = function(block_type) {
  return ( block_type == 'Paragraph' ||
           block_type == 'IndentedCode' ||
           block_type == 'FencedCode' );
};

// Returns true if block ends with a blank line, descending if needed
// into lists and sublists.
var endsWithBlankLine = function(block) {
  if (block.last_line_blank) {
    return true;
  }
  if ((block.t == 'List' || block.t == 'ListItem') && block.children.length > 0) {
    return endsWithBlankLine(block.children[block.children.length - 1]);
  } else {
    return false;
  }
};

// Break out of all containing lists, resetting the tip of the
// document to the parent of the highest list, and finalizing
// all the lists.  (This is used to implement the "two blank lines
// break of of all lists" feature.)
var breakOutOfLists = function(block, line_number) {
  var b = block;
  var last_list = null;
  do {
    if (b.t === 'List') {
      last_list = b;
    }
    b = b.parent;
  } while (b);

  if (last_list) {
    while (block != last_list) {
      this.finalize(block, line_number);
      block = block.parent;
    }
    this.finalize(last_list, line_number);
    this.tip = last_list.parent;
  }
};

// Add a line to the block at the tip.  We assume the tip
// can accept lines -- that check should be done before calling this.
var addLine = function(ln, offset) {
  var s = ln.slice(offset);
  if (!(this.tip.open)) {
    throw({ msg: "Attempted to add line (" + ln + ") to closed container." });
  }
  this.tip.strings.push(s);
};

// Add block of type tag as a child of the tip.  If the tip can't
// accept children, close and finalize it and try its parent,
// and so on til we find a block that can accept children.
var addChild = function(tag, line_number, offset) {
  while (!canContain(this.tip.t, tag)) {
    this.finalize(this.tip, line_number);
  }

  var column_number = offset + 1; // offset 0 = column 1
  var newBlock = makeBlock(tag, line_number, column_number);
  this.tip.children.push(newBlock);
  newBlock.parent = this.tip;
  this.tip = newBlock;
  return newBlock;
};

// Parse a list marker and return data on the marker (type,
// start, delimiter, bullet character, padding) or null.
var parseListMarker = function(ln, offset) {
  var rest = ln.slice(offset);
  var match;
  var spaces_after_marker;
  var data = {};
  if (rest.match(reHrule)) {
    return null;
  }
  if ((match = rest.match(/^[*+-]( +|$)/))) {
    spaces_after_marker = match[1].length;
    data.type = 'Bullet';
    data.bullet_char = match[0][0];

  } else if ((match = rest.match(/^(\d+)([.)])( +|$)/))) {
    spaces_after_marker = match[3].length;
    data.type = 'Ordered';
    data.start = parseInt(match[1]);
    data.delimiter = match[2];
  } else {
    return null;
  }
  var blank_item = match[0].length === rest.length;
  if (spaces_after_marker >= 5 ||
      spaces_after_marker < 1 ||
      blank_item) {
        data.padding = match[0].length - spaces_after_marker + 1;
  } else {
        data.padding = match[0].length;
  }
  return data;
};

// Returns true if the two list items are of the same type,
// with the same delimiter and bullet character.  This is used
// in agglomerating list items into lists.
var listsMatch = function(list_data, item_data) {
  return (list_data.type === item_data.type &&
          list_data.delimiter === item_data.delimiter &&
          list_data.bullet_char === item_data.bullet_char);
};

// Analyze a line of text and update the document appropriately.
// We parse markdown text by calling this on each line of input,
// then finalizing the document.
var incorporateLine = function(ln, line_number) {

  var all_matched = true;
  var last_child;
  var first_nonspace;
  var offset = 0;
  var match;
  var data;
  var blank;
  var indent;
  var last_matched_container;
  var i;
  var CODE_INDENT = 4;

  var container = this.doc;
  var oldtip = this.tip;

  // Convert tabs to spaces:
  ln = detabLine(ln);

  // For each containing block, try to parse the associated line start.
  // Bail out on failure: container will point to the last matching block.
  // Set all_matched to false if not all containers match.
  while (container.children.length > 0) {
    last_child = container.children[container.children.length - 1];
    if (!last_child.open) {
      break;
    }
    container = last_child;

    match = matchAt(/[^ ]/, ln, offset);
    if (match === null) {
      first_nonspace = ln.length;
      blank = true;
    } else {
      first_nonspace = match;
      blank = false;
    }
    indent = first_nonspace - offset;

    switch (container.t) {
      case 'BlockQuote':
        var matched = indent <= 3 && ln[first_nonspace] === '>';
        if (matched) {
          offset = first_nonspace + 1;
          if (ln[offset] === ' ') {
            offset++;
          }
        } else {
          all_matched = false;
        }
        break;

      case 'ListItem':
        if (indent >= container.list_data.marker_offset +
                      container.list_data.padding) {
          offset += container.list_data.marker_offset +
                    container.list_data.padding;
        } else if (blank) {
          offset = first_nonspace;
        } else {
          all_matched = false;
        }
        break;

      case 'IndentedCode':
        if (indent >= CODE_INDENT) {
          offset += CODE_INDENT;
        } else if (blank) {
          offset = first_nonspace;
        } else {
          all_matched = false;
        }
        break;

      case 'ATXHeader':
      case 'SetextHeader':
      case 'HorizontalRule':
        // a header can never container > 1 line, so fail to match:
        all_matched = false;
        break;

      case 'FencedCode':
        // skip optional spaces of fence offset
        i = container.fence_offset;
        while (i > 0 && ln[offset] === ' ') {
          offset++;
          i--;
        }
        break;

      case 'HtmlBlock':
        if (blank) {
          all_matched = false;
        }
        break;

      case 'Paragraph':
        if (blank) {
          container.last_line_blank = true;
          all_matched = false;
        }
        break;

      default:
    }

    if (!all_matched) {
      container = container.parent; // back up to last matching block
      break;
    }
  }

  last_matched_container = container;

  // This function is used to finalize and close any unmatched
  // blocks.  We aren't ready to do this now, because we might
  // have a lazy paragraph continuation, in which case we don't
  // want to close unmatched blocks.  So we store this closure for
  // use later, when we have more information.
  var closeUnmatchedBlocks = function(mythis) {
    // finalize any blocks not matched
    while (!already_done && oldtip != last_matched_container) {
      mythis.finalize(oldtip, line_number);
      oldtip = oldtip.parent;
    }
    var already_done = true;
  };

  // Check to see if we've hit 2nd blank line; if so break out of list:
  if (blank && container.last_line_blank) {
    this.breakOutOfLists(container, line_number);
  }

  // Unless last matched container is a code block, try new container starts,
  // adding children to the last matched container:
  while (container.t != 'FencedCode' &&
         container.t != 'IndentedCode' &&
         container.t != 'HtmlBlock' &&
         // this is a little performance optimization:
         matchAt(/^[ #`~*+_=<>0-9-]/,ln,offset) !== null) {

    match = matchAt(/[^ ]/, ln, offset);
    if (match === null) {
      first_nonspace = ln.length;
      blank = true;
    } else {
      first_nonspace = match;
      blank = false;
    }
    indent = first_nonspace - offset;

    if (indent >= CODE_INDENT) {
      // indented code
      if (this.tip.t != 'Paragraph' && !blank) {
        offset += CODE_INDENT;
        closeUnmatchedBlocks(this);
        container = this.addChild('IndentedCode', line_number, offset);
      } else { // indent > 4 in a lazy paragraph continuation
        break;
      }

    } else if (ln[first_nonspace] === '>') {
      // blockquote
      offset = first_nonspace + 1;
      // optional following space
      if (ln[offset] === ' ') {
        offset++;
      }
      closeUnmatchedBlocks(this);
      container = this.addChild('BlockQuote', line_number, offset);

    } else if ((match = ln.slice(first_nonspace).match(/^#{1,6}(?: +|$)/))) {
      // ATX header
      offset = first_nonspace + match[0].length;
      closeUnmatchedBlocks(this);
      container = this.addChild('ATXHeader', line_number, first_nonspace);
      container.level = match[0].trim().length; // number of #s
      // remove trailing ###s:
      container.strings =
            [ln.slice(offset).replace(/(?:(\\#) *#*| *#+) *$/,'$1')];
      break;

    } else if ((match = ln.slice(first_nonspace).match(/^`{3,}(?!.*`)|^~{3,}(?!.*~)/))) {
      // fenced code block
      var fence_length = match[0].length;
      closeUnmatchedBlocks(this);
      container = this.addChild('FencedCode', line_number, first_nonspace);
      container.fence_length = fence_length;
      container.fence_char = match[0][0];
      container.fence_offset = first_nonspace - offset;
      offset = first_nonspace + fence_length;
      break;

    } else if (matchAt(reHtmlBlockOpen, ln, first_nonspace) !== null) {
      // html block
      closeUnmatchedBlocks(this);
      container = this.addChild('HtmlBlock', line_number, first_nonspace);
      // note, we don't adjust offset because the tag is part of the text
      break;

    } else if (container.t == 'Paragraph' &&
               container.strings.length === 1 &&
               ((match = ln.slice(first_nonspace).match(/^(?:=+|-+) *$/)))) {
      // setext header line
      closeUnmatchedBlocks(this);
      container.t = 'SetextHeader'; // convert Paragraph to SetextHeader
      container.level = match[0][0] === '=' ? 1 : 2;
      offset = ln.length;

    } else if (matchAt(reHrule, ln, first_nonspace) !== null) {
      // hrule
      closeUnmatchedBlocks(this);
      container = this.addChild('HorizontalRule', line_number, first_nonspace);
      offset = ln.length - 1;
      break;

    } else if ((data = parseListMarker(ln, first_nonspace))) {
      // list item
      closeUnmatchedBlocks(this);
      data.marker_offset = indent;
      offset = first_nonspace + data.padding;

      // add the list if needed
      if (container.t !== 'List' ||
          !(listsMatch(container.list_data, data))) {
           container = this.addChild('List', line_number, first_nonspace);
           container.list_data = data;
      }

      // add the list item
      container = this.addChild('ListItem', line_number, first_nonspace);
      container.list_data = data;

    } else {
      break;

    }

    if (acceptsLines(container.t)) {
      // if it's a line container, it can't contain other containers
      break;
    }
  }

  // What remains at the offset is a text line.  Add the text to the
  // appropriate container.

  match = matchAt(/[^ ]/, ln, offset);
  if (match === null) {
    first_nonspace = ln.length;
    blank = true;
  } else {
    first_nonspace = match;
    blank = false;
  }
  indent = first_nonspace - offset;

  // First check for a lazy paragraph continuation:
  if (this.tip !== last_matched_container &&
      !blank &&
      this.tip.t == 'Paragraph' &&
      this.tip.strings.length > 0) {
     // lazy paragraph continuation

    this.last_line_blank = false;
    this.addLine(ln, offset);

  } else { // not a lazy continuation

    // finalize any blocks not matched
    closeUnmatchedBlocks(this);

    // Block quote lines are never blank as they start with >
    // and we don't count blanks in fenced code for purposes of tight/loose
    // lists or breaking out of lists.  We also don't set last_line_blank
    // on an empty list item.
    container.last_line_blank = blank &&
      !(container.t == 'BlockQuote' ||
        container.t == 'FencedCode' ||
        (container.t == 'ListItem' &&
         container.children.length === 0 &&
         container.start_line == line_number));

    var cont = container;
    while (cont.parent) {
      cont.parent.last_line_blank = false;
      cont = cont.parent;
    }

    switch (container.t) {
    case 'IndentedCode':
    case 'HtmlBlock':
      this.addLine(ln, offset);
      break;

    case 'FencedCode':
      // check for closing code fence:
      match = (indent <= 3 &&
               ln[first_nonspace] == container.fence_char &&
               ln.slice(first_nonspace).match(/^(?:`{3,}|~{3,})(?= *$)/));
      if (match && match[0].length >= container.fence_length) {
        // don't add closing fence to container; instead, close it:
        this.finalize(container, line_number);
      } else {
        this.addLine(ln, offset);
      }
      break;

    case 'ATXHeader':
    case 'SetextHeader':
    case 'HorizontalRule':
      // nothing to do; we already added the contents.
      break;

    default:
      if (acceptsLines(container.t)) {
        this.addLine(ln, first_nonspace);
      } else if (blank) {
        // do nothing
      } else if (container.t != 'HorizontalRule' &&
                 container.t != 'SetextHeader') {
        // create paragraph container for line
        container = this.addChild('Paragraph', line_number, first_nonspace);
        this.addLine(ln, first_nonspace);
      } else {
        console.log("Line " + line_number.toString() +
                     " with container type " + container.t +
                     " did not match any condition.");

      }
    }
  }
};

// Finalize a block.  Close it and do any necessary postprocessing,
// e.g. creating string_content from strings, setting the 'tight'
// or 'loose' status of a list, and parsing the beginnings
// of paragraphs for reference definitions.  Reset the tip to the
// parent of the closed block.
var finalize = function(block, line_number) {
  var pos;
  // don't do anything if the block is already closed
  if (!block.open) {
    return 0;
  }
  block.open = false;
  if (line_number > block.start_line) {
    block.end_line = line_number - 1;
  } else {
    block.end_line = line_number;
  }

  switch (block.t) {
  case 'Paragraph':
    block.string_content = block.strings.join('\n').replace(/^  */m,'');

    // try parsing the beginning as link reference definitions:
    while (block.string_content[0] === '[' &&
           (pos = this.inlineParser.parseReference(block.string_content,
                                                   this.refmap))) {
      block.string_content = block.string_content.slice(pos);
      if (isBlank(block.string_content)) {
        block.t = 'ReferenceDef';
        break;
      }
    }
    break;

  case 'ATXHeader':
  case 'SetextHeader':
  case 'HtmlBlock':
    block.string_content = block.strings.join('\n');
    break;

  case 'IndentedCode':
    block.string_content = block.strings.join('\n').replace(/(\n *)*$/,'\n');
    break;

  case 'FencedCode':
    // first line becomes info string
    block.info = unescape(block.strings[0].trim());
    if (block.strings.length == 1) {
      block.string_content = '';
    } else {
      block.string_content = block.strings.slice(1).join('\n') + '\n';
    }
    break;

  case 'List':
    block.tight = true; // tight by default

    var numitems = block.children.length;
    var i = 0;
    while (i < numitems) {
      var item = block.children[i];
      // check for non-final list item ending with blank line:
      var last_item = i == numitems - 1;
      if (endsWithBlankLine(item) && !last_item) {
        block.tight = false;
        break;
      }
      // recurse into children of list item, to see if there are
      // spaces between any of them:
      var numsubitems = item.children.length;
      var j = 0;
      while (j < numsubitems) {
        var subitem = item.children[j];
        var last_subitem = j == numsubitems - 1;
        if (endsWithBlankLine(subitem) && !(last_item && last_subitem)) {
          block.tight = false;
          break;
        }
        j++;
      }
      i++;
    }
    break;

  default:
    break;
  }

  this.tip = block.parent || this.top;
};

// Walk through a block & children recursively, parsing string content
// into inline content where appropriate.
var processInlines = function(block) {
  switch(block.t) {
    case 'Paragraph':
    case 'SetextHeader':
    case 'ATXHeader':
      block.inline_content =
        this.inlineParser.parse(block.string_content.trim(), this.refmap);
      block.string_content = "";
      break;
    default:
      break;
  }

  if (block.children) {
    for (var i = 0; i < block.children.length; i++) {
      this.processInlines(block.children[i]);
    }
  }

};

// The main parsing function.  Returns a parsed document AST.
var parse = function(input) {
  this.doc = makeBlock('Document', 1, 1);
  this.tip = this.doc;
  this.refmap = {};
  var lines = input.replace(/\n$/,'').split(/\r\n|\n|\r/);
  var len = lines.length;
  for (var i = 0; i < len; i++) {
    this.incorporateLine(lines[i], i+1);
  }
  while (this.tip) {
    this.finalize(this.tip, len - 1);
  }
  this.processInlines(this.doc);
  return this.doc;
};


// The DocParser object.
function DocParser(){
  return {
    doc: makeBlock('Document', 1, 1),
    tip: this.doc,
    refmap: {},
    inlineParser: new InlineParser(),
    breakOutOfLists: breakOutOfLists,
    addLine: addLine,
    addChild: addChild,
    incorporateLine: incorporateLine,
    finalize: finalize,
    processInlines: processInlines,
    parse: parse
  };
}

// HTML RENDERER

// Helper function to produce content in a pair of HTML tags.
var inTags = function(tag, attribs, contents, selfclosing) {
  var result = '<' + tag;
  if (attribs) {
    var i = 0;
    var attrib;
    while ((attrib = attribs[i]) !== undefined) {
      result = result.concat(' ', attrib[0], '="', attrib[1], '"');
      i++;
    }
  }
  if (contents) {
    result = result.concat('>', contents, '</', tag, '>');
  } else if (selfclosing) {
    result = result + ' />';
  } else {
    result = result.concat('></', tag, '>');
  }
  return result;
};

// Render an inline element as HTML.
var renderInline = function(inline) {
  var attrs;
  switch (inline.t) {
    case 'Str':
      return this.escape(inline.c);
    case 'Softbreak':
      return this.softbreak;
    case 'Hardbreak':
      return inTags('br',[],"",true) + '\n';
    case 'Emph':
      return inTags('em', [], this.renderInlines(inline.c));
    case 'Strong':
      return inTags('strong', [], this.renderInlines(inline.c));
    case 'Html':
      return inline.c;
    case 'Entity':
      return inline.c;
    case 'Link':
      attrs = [['href', this.escape(inline.destination, true)]];
      if (inline.title) {
        attrs.push(['title', this.escape(inline.title, true)]);
      }
      return inTags('a', attrs, this.renderInlines(inline.label));
    case 'Image':
      attrs = [['src', this.escape(inline.destination, true)],
                   ['alt', this.escape(this.renderInlines(inline.label))]];
      if (inline.title) {
        attrs.push(['title', this.escape(inline.title, true)]);
      }
      return inTags('img', attrs, "", true);
    case 'Code':
      return inTags('code', [], this.escape(inline.c));
    default:
      console.log("Uknown inline type " + inline.t);
      return "";
  }
};

// Render a list of inlines.
var renderInlines = function(inlines) {
  var result = '';
  for (var i=0; i < inlines.length; i++) {
    result = result + this.renderInline(inlines[i]);
  }
  return result;
};

// Render a single block element.
var renderBlock = function(block, in_tight_list) {
  var tag;
  var attr;
  var info_words;
  switch (block.t) {
    case 'Document':
      var whole_doc = this.renderBlocks(block.children);
      return (whole_doc === '' ? '' : whole_doc + '\n');
    case 'Paragraph':
      if (in_tight_list) {
        return this.renderInlines(block.inline_content);
      } else {
        return inTags('p', [], this.renderInlines(block.inline_content));
      }
      break;
    case 'BlockQuote':
      var filling = this.renderBlocks(block.children);
      return inTags('blockquote', [], filling === '' ? this.innersep :
          this.innersep + this.renderBlocks(block.children) + this.innersep);
    case 'ListItem':
      return inTags('li', [], this.renderBlocks(block.children, in_tight_list).trim());
    case 'List':
      tag = block.list_data.type == 'Bullet' ? 'ul' : 'ol';
      attr = (!block.list_data.start || block.list_data.start == 1) ?
              [] : [['start', block.list_data.start.toString()]];
      return inTags(tag, attr, this.innersep +
                    this.renderBlocks(block.children, block.tight) +
                    this.innersep);
    case 'ATXHeader':
    case 'SetextHeader':
      tag = 'h' + block.level;
      return inTags(tag, [], this.renderInlines(block.inline_content));
    case 'IndentedCode':
      return inTags('pre', [],
              inTags('code', [], this.escape(block.string_content)));
    case 'FencedCode':
      info_words = block.info.split(/ +/);
      attr = info_words.length === 0 || info_words[0].length === 0 ?
                   [] : [['class','language-' +
                                   this.escape(info_words[0],true)]];
      return inTags('pre', [],
              inTags('code', attr, this.escape(block.string_content)));
    case 'HtmlBlock':
      return block.string_content;
    case 'ReferenceDef':
      return "";
    case 'HorizontalRule':
      return inTags('hr',[],"",true);
    default:
      console.log("Uknown block type " + block.t);
      return "";
  }
};

// Render a list of block elements, separated by this.blocksep.
var renderBlocks = function(blocks, in_tight_list) {
  var result = [];
  for (var i=0; i < blocks.length; i++) {
    if (blocks[i].t !== 'ReferenceDef') {
      result.push(this.renderBlock(blocks[i], in_tight_list));
    }
  }
  return result.join(this.blocksep);
};

// The HtmlRenderer object.
function HtmlRenderer(){
  return {
    // default options:
    blocksep: '\n',  // space between blocks
    innersep: '\n',  // space between block container tag and contents
    softbreak: '\n', // by default, soft breaks are rendered as newlines in HTML
                     // set to "<br />" to make them hard breaks
                     // set to " " if you want to ignore line wrapping in source
    escape: function(s, preserve_entities) {
      if (preserve_entities) {
      return s.replace(/[&](?![#](x[a-f0-9]{1,8}|[0-9]{1,8});|[a-z][a-z0-9]{1,31};)/gi,'&amp;')
              .replace(/[<]/g,'&lt;')
              .replace(/[>]/g,'&gt;')
              .replace(/["]/g,'&quot;');
      } else {
      return s.replace(/[&]/g,'&amp;')
              .replace(/[<]/g,'&lt;')
              .replace(/[>]/g,'&gt;')
              .replace(/["]/g,'&quot;');
      }
    },
    renderInline: renderInline,
    renderInlines: renderInlines,
    renderBlock: renderBlock,
    renderBlocks: renderBlocks,
    render: renderBlock
  };
}

exports.DocParser = DocParser;
exports.HtmlRenderer = HtmlRenderer;

})(typeof exports === 'undefined' ? this.stmd = {} : exports);
