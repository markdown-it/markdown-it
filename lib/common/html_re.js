// Regexps to match html elements

'use strict';

let attr_name     = '[a-zA-Z_:][a-zA-Z0-9:._-]*';

let unquoted      = '[^"\'=<>`\\x00-\\x20]+';
let single_quoted = "'[^']*'";
let double_quoted = '"[^"]*"';

let attr_value  = '(?:' + unquoted + '|' + single_quoted + '|' + double_quoted + ')';

let attribute   = '(?:\\s+' + attr_name + '(?:\\s*=\\s*' + attr_value + ')?)';

let open_tag    = '<[A-Za-z][A-Za-z0-9\\-]*' + attribute + '*\\s*\\/?>';

let close_tag   = '<\\/[A-Za-z][A-Za-z0-9\\-]*\\s*>';
let comment     = '<!---->|<!--(?:-?[^>-])(?:-?[^-])*-->';
let processing  = '<[?][\\s\\S]*?[?]>';
let declaration = '<![A-Z]+\\s+[^>]*>';
let cdata       = '<!\\[CDATA\\[[\\s\\S]*?\\]\\]>';

let HTML_TAG_RE = new RegExp('^(?:' + open_tag + '|' + close_tag + '|' + comment +
                        '|' + processing + '|' + declaration + '|' + cdata + ')');
let HTML_OPEN_CLOSE_TAG_RE = new RegExp('^(?:' + open_tag + '|' + close_tag + ')');

module.exports.HTML_TAG_RE = HTML_TAG_RE;
module.exports.HTML_OPEN_CLOSE_TAG_RE = HTML_OPEN_CLOSE_TAG_RE;
