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

    var entities = { AAacute: 'Á',
                     aacute: 'á',
                     Abreve: 'Ă',
                     abreve: 'ă',
                     ac: '∾',
                     acd: '∿',
                     acE: '∾',
                     Acirc: 'Â',
                     acirc: 'â',
                     acute: '´',
                     Acy: 'А',
                     acy: 'а',
                     AElig: 'Æ',
                     aelig: 'æ',
                     af: '⁡',
                     Afr: '𝔄',
                     afr: '𝔞',
                     Agrave: 'À',
                     agrave: 'à',
                     alefsym: 'ℵ',
                     aleph: 'ℵ',
                     Alpha: 'Α',
                     alpha: 'α',
                     Amacr: 'Ā',
                     amacr: 'ā',
                     amalg: '⨿',
                     amp: '&',
                     AMP: '&',
                     andand: '⩕',
                     And: '⩓',
                     and: '∧',
                     andd: '⩜',
                     andslope: '⩘',
                     andv: '⩚',
                     ang: '∠',
                     ange: '⦤',
                     angle: '∠',
                     angmsdaa: '⦨',
                     angmsdab: '⦩',
                     angmsdac: '⦪',
                     angmsdad: '⦫',
                     angmsdae: '⦬',
                     angmsdaf: '⦭',
                     angmsdag: '⦮',
                     angmsdah: '⦯',
                     angmsd: '∡',
                     angrt: '∟',
                     angrtvb: '⊾',
                     angrtvbd: '⦝',
                     angsph: '∢',
                     angst: 'Å',
                     angzarr: '⍼',
                     Aogon: 'Ą',
                     aogon: 'ą',
                     Aopf: '𝔸',
                     aopf: '𝕒',
                     apacir: '⩯',
                     ap: '≈',
                     apE: '⩰',
                     ape: '≊',
                     apid: '≋',
                     apos: '\'',
                     ApplyFunction: '⁡',
                     approx: '≈',
                     approxeq: '≊',
                     Aring: 'Å',
                     aring: 'å',
                     Ascr: '𝒜',
                     ascr: '𝒶',
                     Assign: '≔',
                     ast: '*',
                     asymp: '≈',
                     asympeq: '≍',
                     Atilde: 'Ã',
                     atilde: 'ã',
                     Auml: 'Ä',
                     auml: 'ä',
                     awconint: '∳',
                     awint: '⨑',
                     backcong: '≌',
                     backepsilon: '϶',
                     backprime: '‵',
                     backsim: '∽',
                     backsimeq: '⋍',
                     Backslash: '∖',
                     Barv: '⫧',
                     barvee: '⊽',
                     barwed: '⌅',
                     Barwed: '⌆',
                     barwedge: '⌅',
                     bbrk: '⎵',
                     bbrktbrk: '⎶',
                     bcong: '≌',
                     Bcy: 'Б',
                     bcy: 'б',
                     bdquo: '„',
                     becaus: '∵',
                     because: '∵',
                     Because: '∵',
                     bemptyv: '⦰',
                     bepsi: '϶',
                     bernou: 'ℬ',
                     Bernoullis: 'ℬ',
                     Beta: 'Β',
                     beta: 'β',
                     beth: 'ℶ',
                     between: '≬',
                     Bfr: '𝔅',
                     bfr: '𝔟',
                     bigcap: '⋂',
                     bigcirc: '◯',
                     bigcup: '⋃',
                     bigodot: '⨀',
                     bigoplus: '⨁',
                     bigotimes: '⨂',
                     bigsqcup: '⨆',
                     bigstar: '★',
                     bigtriangledown: '▽',
                     bigtriangleup: '△',
                     biguplus: '⨄',
                     bigvee: '⋁',
                     bigwedge: '⋀',
                     bkarow: '⤍',
                     blacklozenge: '⧫',
                     blacksquare: '▪',
                     blacktriangle: '▴',
                     blacktriangledown: '▾',
                     blacktriangleleft: '◂',
                     blacktriangleright: '▸',
                     blank: '␣',
                     blk12: '▒',
                     blk14: '░',
                     blk34: '▓',
                     block: '█',
                     bne: '=',
                     bnequiv: '≡',
                     bNot: '⫭',
                     bnot: '⌐',
                     Bopf: '𝔹',
                     bopf: '𝕓',
                     bot: '⊥',
                     bottom: '⊥',
                     bowtie: '⋈',
                     boxbox: '⧉',
                     boxdl: '┐',
                     boxdL: '╕',
                     boxDl: '╖',
                     boxDL: '╗',
                     boxdr: '┌',
                     boxdR: '╒',
                     boxDr: '╓',
                     boxDR: '╔',
                     boxh: '─',
                     boxH: '═',
                     boxhd: '┬',
                     boxHd: '╤',
                     boxhD: '╥',
                     boxHD: '╦',
                     boxhu: '┴',
                     boxHu: '╧',
                     boxhU: '╨',
                     boxHU: '╩',
                     boxminus: '⊟',
                     boxplus: '⊞',
                     boxtimes: '⊠',
                     boxul: '┘',
                     boxuL: '╛',
                     boxUl: '╜',
                     boxUL: '╝',
                     boxur: '└',
                     boxuR: '╘',
                     boxUr: '╙',
                     boxUR: '╚',
                     boxv: '│',
                     boxV: '║',
                     boxvh: '┼',
                     boxvH: '╪',
                     boxVh: '╫',
                     boxVH: '╬',
                     boxvl: '┤',
                     boxvL: '╡',
                     boxVl: '╢',
                     boxVL: '╣',
                     boxvr: '├',
                     boxvR: '╞',
                     boxVr: '╟',
                     boxVR: '╠',
                     bprime: '‵',
                     breve: '˘',
                     Breve: '˘',
                     brvbar: '¦',
                     bscr: '𝒷',
                     Bscr: 'ℬ',
                     bsemi: '⁏',
                     bsim: '∽',
                     bsime: '⋍',
                     bsolb: '⧅',
                     bsol: '\\',
                     bsolhsub: '⟈',
                     bull: '•',
                     bullet: '•',
                     bump: '≎',
                     bumpE: '⪮',
                     bumpe: '≏',
                     Bumpeq: '≎',
                     bumpeq: '≏',
                     Cacute: 'Ć',
                     cacute: 'ć',
                     capand: '⩄',
                     capbrcup: '⩉',
                     capcap: '⩋',
                     cap: '∩',
                     Cap: '⋒',
                     capcup: '⩇',
                     capdot: '⩀',
                     CapitalDifferentialD: 'ⅅ',
                     caps: '∩',
                     caret: '⁁',
                     caron: 'ˇ',
                     Cayleys: 'ℭ',
                     ccaps: '⩍',
                     Ccaron: 'Č',
                     ccaron: 'č',
                     Ccedil: 'Ç',
                     ccedil: 'ç',
                     Ccirc: 'Ĉ',
                     ccirc: 'ĉ',
                     Cconint: '∰',
                     ccups: '⩌',
                     ccupssm: '⩐',
                     Cdot: 'Ċ',
                     cdot: 'ċ',
                     cedil: '¸',
                     Cedilla: '¸',
                     cemptyv: '⦲',
                     cent: '¢',
                     centerdot: '·',
                     CenterDot: '·',
                     cfr: '𝔠',
                     Cfr: 'ℭ',
                     CHcy: 'Ч',
                     chcy: 'ч',
                     check: '✓',
                     checkmark: '✓',
                     Chi: 'Χ',
                     chi: 'χ',
                     circ: 'ˆ',
                     circeq: '≗',
                     circlearrowleft: '↺',
                     circlearrowright: '↻',
                     circledast: '⊛',
                     circledcirc: '⊚',
                     circleddash: '⊝',
                     CircleDot: '⊙',
                     circledR: '®',
                     circledS: 'Ⓢ',
                     CircleMinus: '⊖',
                     CirclePlus: '⊕',
                     CircleTimes: '⊗',
                     cir: '○',
                     cirE: '⧃',
                     cire: '≗',
                     cirfnint: '⨐',
                     cirmid: '⫯',
                     cirscir: '⧂',
                     ClockwiseContourIntegral: '∲',
                     CloseCurlyDoubleQuote: '”',
                     CloseCurlyQuote: '’',
                     clubs: '♣',
                     clubsuit: '♣',
                     colon: ':',
                     Colon: '∷',
                     Colone: '⩴',
                     colone: '≔',
                     coloneq: '≔',
                     comma: ',',
                     commat: '@',
                     comp: '∁',
                     compfn: '∘',
                     complement: '∁',
                     complexes: 'ℂ',
                     cong: '≅',
                     congdot: '⩭',
                     Congruent: '≡',
                     conint: '∮',
                     Conint: '∯',
                     ContourIntegral: '∮',
                     copf: '𝕔',
                     Copf: 'ℂ',
                     coprod: '∐',
                     Coproduct: '∐',
                     copy: '©',
                     COPY: '©',
                     copysr: '℗',
                     CounterClockwiseContourIntegral: '∳',
                     crarr: '↵',
                     cross: '✗',
                     Cross: '⨯',
                     Cscr: '𝒞',
                     cscr: '𝒸',
                     csub: '⫏',
                     csube: '⫑',
                     csup: '⫐',
                     csupe: '⫒',
                     ctdot: '⋯',
                     cudarrl: '⤸',
                     cudarrr: '⤵',
                     cuepr: '⋞',
                     cuesc: '⋟',
                     cularr: '↶',
                     cularrp: '⤽',
                     cupbrcap: '⩈',
                     cupcap: '⩆',
                     CupCap: '≍',
                     cup: '∪',
                     Cup: '⋓',
                     cupcup: '⩊',
                     cupdot: '⊍',
                     cupor: '⩅',
                     cups: '∪',
                     curarr: '↷',
                     curarrm: '⤼',
                     curlyeqprec: '⋞',
                     curlyeqsucc: '⋟',
                     curlyvee: '⋎',
                     curlywedge: '⋏',
                     curren: '¤',
                     curvearrowleft: '↶',
                     curvearrowright: '↷',
                     cuvee: '⋎',
                     cuwed: '⋏',
                     cwconint: '∲',
                     cwint: '∱',
                     cylcty: '⌭',
                     dagger: '†',
                     Dagger: '‡',
                     daleth: 'ℸ',
                     darr: '↓',
                     Darr: '↡',
                     dArr: '⇓',
                     dash: '‐',
                     Dashv: '⫤',
                     dashv: '⊣',
                     dbkarow: '⤏',
                     dblac: '˝',
                     Dcaron: 'Ď',
                     dcaron: 'ď',
                     Dcy: 'Д',
                     dcy: 'д',
                     ddagger: '‡',
                     ddarr: '⇊',
                     DD: 'ⅅ',
                     dd: 'ⅆ',
                     DDotrahd: '⤑',
                     ddotseq: '⩷',
                     deg: '°',
                     Del: '∇',
                     Delta: 'Δ',
                     delta: 'δ',
                     demptyv: '⦱',
                     dfisht: '⥿',
                     Dfr: '𝔇',
                     dfr: '𝔡',
                     dHar: '⥥',
                     dharl: '⇃',
                     dharr: '⇂',
                     DiacriticalAcute: '´',
                     DiacriticalDot: '˙',
                     DiacriticalDoubleAcute: '˝',
                     DiacriticalGrave: '`',
                     DiacriticalTilde: '˜',
                     diam: '⋄',
                     diamond: '⋄',
                     Diamond: '⋄',
                     diamondsuit: '♦',
                     diams: '♦',
                     die: '¨',
                     DifferentialD: 'ⅆ',
                     digamma: 'ϝ',
                     disin: '⋲',
                     div: '÷',
                     divide: '÷',
                     divideontimes: '⋇',
                     divonx: '⋇',
                     DJcy: 'Ђ',
                     djcy: 'ђ',
                     dlcorn: '⌞',
                     dlcrop: '⌍',
                     dollar: '$',
                     Dopf: '𝔻',
                     dopf: '𝕕',
                     Dot: '¨',
                     dot: '˙',
                     DotDot: '⃜',
                     doteq: '≐',
                     doteqdot: '≑',
                     DotEqual: '≐',
                     dotminus: '∸',
                     dotplus: '∔',
                     dotsquare: '⊡',
                     doublebarwedge: '⌆',
                     DoubleContourIntegral: '∯',
                     DoubleDot: '¨',
                     DoubleDownArrow: '⇓',
                     DoubleLeftArrow: '⇐',
                     DoubleLeftRightArrow: '⇔',
                     DoubleLeftTee: '⫤',
                     DoubleLongLeftArrow: '⟸',
                     DoubleLongLeftRightArrow: '⟺',
                     DoubleLongRightArrow: '⟹',
                     DoubleRightArrow: '⇒',
                     DoubleRightTee: '⊨',
                     DoubleUpArrow: '⇑',
                     DoubleUpDownArrow: '⇕',
                     DoubleVerticalBar: '∥',
                     DownArrowBar: '⤓',
                     downarrow: '↓',
                     DownArrow: '↓',
                     Downarrow: '⇓',
                     DownArrowUpArrow: '⇵',
                     DownBreve: '̑',
                     downdownarrows: '⇊',
                     downharpoonleft: '⇃',
                     downharpoonright: '⇂',
                     DownLeftRightVector: '⥐',
                     DownLeftTeeVector: '⥞',
                     DownLeftVectorBar: '⥖',
                     DownLeftVector: '↽',
                     DownRightTeeVector: '⥟',
                     DownRightVectorBar: '⥗',
                     DownRightVector: '⇁',
                     DownTeeArrow: '↧',
                     DownTee: '⊤',
                     drbkarow: '⤐',
                     drcorn: '⌟',
                     drcrop: '⌌',
                     Dscr: '𝒟',
                     dscr: '𝒹',
                     DScy: 'Ѕ',
                     dscy: 'ѕ',
                     dsol: '⧶',
                     Dstrok: 'Đ',
                     dstrok: 'đ',
                     dtdot: '⋱',
                     dtri: '▿',
                     dtrif: '▾',
                     duarr: '⇵',
                     duhar: '⥯',
                     dwangle: '⦦',
                     DZcy: 'Џ',
                     dzcy: 'џ',
                     dzigrarr: '⟿',
                     Eacute: 'É',
                     eacute: 'é',
                     easter: '⩮',
                     Ecaron: 'Ě',
                     ecaron: 'ě',
                     Ecirc: 'Ê',
                     ecirc: 'ê',
                     ecir: '≖',
                     ecolon: '≕',
                     Ecy: 'Э',
                     ecy: 'э',
                     eDDot: '⩷',
                     Edot: 'Ė',
                     edot: 'ė',
                     eDot: '≑',
                     ee: 'ⅇ',
                     efDot: '≒',
                     Efr: '𝔈',
                     efr: '𝔢',
                     eg: '⪚',
                     Egrave: 'È',
                     egrave: 'è',
                     egs: '⪖',
                     egsdot: '⪘',
                     el: '⪙',
                     Element: '∈',
                     elinters: '⏧',
                     ell: 'ℓ',
                     els: '⪕',
                     elsdot: '⪗',
                     Emacr: 'Ē',
                     emacr: 'ē',
                     empty: '∅',
                     emptyset: '∅',
                     EmptySmallSquare: '◻',
                     emptyv: '∅',
                     EmptyVerySmallSquare: '▫',
                     emsp13: ' ',
                     emsp14: ' ',
                     emsp: ' ',
                     ENG: 'Ŋ',
                     eng: 'ŋ',
                     ensp: ' ',
                     Eogon: 'Ę',
                     eogon: 'ę',
                     Eopf: '𝔼',
                     eopf: '𝕖',
                     epar: '⋕',
                     eparsl: '⧣',
                     eplus: '⩱',
                     epsi: 'ε',
                     Epsilon: 'Ε',
                     epsilon: 'ε',
                     epsiv: 'ϵ',
                     eqcirc: '≖',
                     eqcolon: '≕',
                     eqsim: '≂',
                     eqslantgtr: '⪖',
                     eqslantless: '⪕',
                     Equal: '⩵',
                     equals: '=',
                     EqualTilde: '≂',
                     equest: '≟',
                     Equilibrium: '⇌',
                     equiv: '≡',
                     equivDD: '⩸',
                     eqvparsl: '⧥',
                     erarr: '⥱',
                     erDot: '≓',
                     escr: 'ℯ',
                     Escr: 'ℰ',
                     esdot: '≐',
                     Esim: '⩳',
                     esim: '≂',
                     Eta: 'Η',
                     eta: 'η',
                     ETH: 'Ð',
                     eth: 'ð',
                     Euml: 'Ë',
                     euml: 'ë',
                     euro: '€',
                     excl: '!',
                     exist: '∃',
                     Exists: '∃',
                     expectation: 'ℰ',
                     exponentiale: 'ⅇ',
                     ExponentialE: 'ⅇ',
                     fallingdotseq: '≒',
                     Fcy: 'Ф',
                     fcy: 'ф',
                     female: '♀',
                     ffilig: 'ﬃ',
                     fflig: 'ﬀ',
                     ffllig: 'ﬄ',
                     Ffr: '𝔉',
                     ffr: '𝔣',
                     filig: 'ﬁ',
                     FilledSmallSquare: '◼',
                     FilledVerySmallSquare: '▪',
                     fjlig: 'f',
                     flat: '♭',
                     fllig: 'ﬂ',
                     fltns: '▱',
                     fnof: 'ƒ',
                     Fopf: '𝔽',
                     fopf: '𝕗',
                     forall: '∀',
                     ForAll: '∀',
                     fork: '⋔',
                     forkv: '⫙',
                     Fouriertrf: 'ℱ',
                     fpartint: '⨍',
                     frac12: '½',
                     frac13: '⅓',
                     frac14: '¼',
                     frac15: '⅕',
                     frac16: '⅙',
                     frac18: '⅛',
                     frac23: '⅔',
                     frac25: '⅖',
                     frac34: '¾',
                     frac35: '⅗',
                     frac38: '⅜',
                     frac45: '⅘',
                     frac56: '⅚',
                     frac58: '⅝',
                     frac78: '⅞',
                     frasl: '⁄',
                     frown: '⌢',
                     fscr: '𝒻',
                     Fscr: 'ℱ',
                     gacute: 'ǵ',
                     Gamma: 'Γ',
                     gamma: 'γ',
                     Gammad: 'Ϝ',
                     gammad: 'ϝ',
                     gap: '⪆',
                     Gbreve: 'Ğ',
                     gbreve: 'ğ',
                     Gcedil: 'Ģ',
                     Gcirc: 'Ĝ',
                     gcirc: 'ĝ',
                     Gcy: 'Г',
                     gcy: 'г',
                     Gdot: 'Ġ',
                     gdot: 'ġ',
                     ge: '≥',
                     gE: '≧',
                     gEl: '⪌',
                     gel: '⋛',
                     geq: '≥',
                     geqq: '≧',
                     geqslant: '⩾',
                     gescc: '⪩',
                     ges: '⩾',
                     gesdot: '⪀',
                     gesdoto: '⪂',
                     gesdotol: '⪄',
                     gesl: '⋛',
                     gesles: '⪔',
                     Gfr: '𝔊',
                     gfr: '𝔤',
                     gg: '≫',
                     Gg: '⋙',
                     ggg: '⋙',
                     gimel: 'ℷ',
                     GJcy: 'Ѓ',
                     gjcy: 'ѓ',
                     gla: '⪥',
                     gl: '≷',
                     glE: '⪒',
                     glj: '⪤',
                     gnap: '⪊',
                     gnapprox: '⪊',
                     gne: '⪈',
                     gnE: '≩',
                     gneq: '⪈',
                     gneqq: '≩',
                     gnsim: '⋧',
                     Gopf: '𝔾',
                     gopf: '𝕘',
                     grave: '`',
                     GreaterEqual: '≥',
                     GreaterEqualLess: '⋛',
                     GreaterFullEqual: '≧',
                     GreaterGreater: '⪢',
                     GreaterLess: '≷',
                     GreaterSlantEqual: '⩾',
                     GreaterTilde: '≳',
                     Gscr: '𝒢',
                     gscr: 'ℊ',
                     gsim: '≳',
                     gsime: '⪎',
                     gsiml: '⪐',
                     gtcc: '⪧',
                     gtcir: '⩺',
                     gt: '>',
                     GT: '>',
                     Gt: '≫',
                     gtdot: '⋗',
                     gtlPar: '⦕',
                     gtquest: '⩼',
                     gtrapprox: '⪆',
                     gtrarr: '⥸',
                     gtrdot: '⋗',
                     gtreqless: '⋛',
                     gtreqqless: '⪌',
                     gtrless: '≷',
                     gtrsim: '≳',
                     gvertneqq: '≩',
                     gvnE: '≩',
                     Hacek: 'ˇ',
                     hairsp: ' ',
                     half: '½',
                     hamilt: 'ℋ',
                     HARDcy: 'Ъ',
                     hardcy: 'ъ',
                     harrcir: '⥈',
                     harr: '↔',
                     hArr: '⇔',
                     harrw: '↭',
                     Hat: '^',
                     hbar: 'ℏ',
                     Hcirc: 'Ĥ',
                     hcirc: 'ĥ',
                     hearts: '♥',
                     heartsuit: '♥',
                     hellip: '…',
                     hercon: '⊹',
                     hfr: '𝔥',
                     Hfr: 'ℌ',
                     HilbertSpace: 'ℋ',
                     hksearow: '⤥',
                     hkswarow: '⤦',
                     hoarr: '⇿',
                     homtht: '∻',
                     hookleftarrow: '↩',
                     hookrightarrow: '↪',
                     hopf: '𝕙',
                     Hopf: 'ℍ',
                     horbar: '―',
                     HorizontalLine: '─',
                     hscr: '𝒽',
                     Hscr: 'ℋ',
                     hslash: 'ℏ',
                     Hstrok: 'Ħ',
                     hstrok: 'ħ',
                     HumpDownHump: '≎',
                     HumpEqual: '≏',
                     hybull: '⁃',
                     hyphen: '‐',
                     Iacute: 'Í',
                     iacute: 'í',
                     ic: '⁣',
                     Icirc: 'Î',
                     icirc: 'î',
                     Icy: 'И',
                     icy: 'и',
                     Idot: 'İ',
                     IEcy: 'Е',
                     iecy: 'е',
                     iexcl: '¡',
                     iff: '⇔',
                     ifr: '𝔦',
                     Ifr: 'ℑ',
                     Igrave: 'Ì',
                     igrave: 'ì',
                     ii: 'ⅈ',
                     iiiint: '⨌',
                     iiint: '∭',
                     iinfin: '⧜',
                     iiota: '℩',
                     IJlig: 'Ĳ',
                     ijlig: 'ĳ',
                     Imacr: 'Ī',
                     imacr: 'ī',
                     image: 'ℑ',
                     ImaginaryI: 'ⅈ',
                     imagline: 'ℐ',
                     imagpart: 'ℑ',
                     imath: 'ı',
                     Im: 'ℑ',
                     imof: '⊷',
                     imped: 'Ƶ',
                     Implies: '⇒',
                     incare: '℅',
                     in: '∈',
                     infin: '∞',
                     infintie: '⧝',
                     inodot: 'ı',
                     intcal: '⊺',
                     int: '∫',
                     Int: '∬',
                     integers: 'ℤ',
                     Integral: '∫',
                     intercal: '⊺',
                     Intersection: '⋂',
                     intlarhk: '⨗',
                     intprod: '⨼',
                     InvisibleComma: '⁣',
                     InvisibleTimes: '⁢',
                     IOcy: 'Ё',
                     iocy: 'ё',
                     Iogon: 'Į',
                     iogon: 'į',
                     Iopf: '𝕀',
                     iopf: '𝕚',
                     Iota: 'Ι',
                     iota: 'ι',
                     iprod: '⨼',
                     iquest: '¿',
                     iscr: '𝒾',
                     Iscr: 'ℐ',
                     isin: '∈',
                     isindot: '⋵',
                     isinE: '⋹',
                     isins: '⋴',
                     isinsv: '⋳',
                     isinv: '∈',
                     it: '⁢',
                     Itilde: 'Ĩ',
                     itilde: 'ĩ',
                     Iukcy: 'І',
                     iukcy: 'і',
                     Iuml: 'Ï',
                     iuml: 'ï',
                     Jcirc: 'Ĵ',
                     jcirc: 'ĵ',
                     Jcy: 'Й',
                     jcy: 'й',
                     Jfr: '𝔍',
                     jfr: '𝔧',
                     jmath: 'ȷ',
                     Jopf: '𝕁',
                     jopf: '𝕛',
                     Jscr: '𝒥',
                     jscr: '𝒿',
                     Jsercy: 'Ј',
                     jsercy: 'ј',
                     Jukcy: 'Є',
                     jukcy: 'є',
                     Kappa: 'Κ',
                     kappa: 'κ',
                     kappav: 'ϰ',
                     Kcedil: 'Ķ',
                     kcedil: 'ķ',
                     Kcy: 'К',
                     kcy: 'к',
                     Kfr: '𝔎',
                     kfr: '𝔨',
                     kgreen: 'ĸ',
                     KHcy: 'Х',
                     khcy: 'х',
                     KJcy: 'Ќ',
                     kjcy: 'ќ',
                     Kopf: '𝕂',
                     kopf: '𝕜',
                     Kscr: '𝒦',
                     kscr: '𝓀',
                     lAarr: '⇚',
                     Lacute: 'Ĺ',
                     lacute: 'ĺ',
                     laemptyv: '⦴',
                     lagran: 'ℒ',
                     Lambda: 'Λ',
                     lambda: 'λ',
                     lang: '⟨',
                     Lang: '⟪',
                     langd: '⦑',
                     langle: '⟨',
                     lap: '⪅',
                     Laplacetrf: 'ℒ',
                     laquo: '«',
                     larrb: '⇤',
                     larrbfs: '⤟',
                     larr: '←',
                     Larr: '↞',
                     lArr: '⇐',
                     larrfs: '⤝',
                     larrhk: '↩',
                     larrlp: '↫',
                     larrpl: '⤹',
                     larrsim: '⥳',
                     larrtl: '↢',
                     latail: '⤙',
                     lAtail: '⤛',
                     lat: '⪫',
                     late: '⪭',
                     lates: '⪭',
                     lbarr: '⤌',
                     lBarr: '⤎',
                     lbbrk: '❲',
                     lbrace: '{',
                     lbrack: '[',
                     lbrke: '⦋',
                     lbrksld: '⦏',
                     lbrkslu: '⦍',
                     Lcaron: 'Ľ',
                     lcaron: 'ľ',
                     Lcedil: 'Ļ',
                     lcedil: 'ļ',
                     lceil: '⌈',
                     lcub: '{',
                     Lcy: 'Л',
                     lcy: 'л',
                     ldca: '⤶',
                     ldquo: '“',
                     ldquor: '„',
                     ldrdhar: '⥧',
                     ldrushar: '⥋',
                     ldsh: '↲',
                     le: '≤',
                     lE: '≦',
                     LeftAngleBracket: '⟨',
                     LeftArrowBar: '⇤',
                     leftarrow: '←',
                     LeftArrow: '←',
                     Leftarrow: '⇐',
                     LeftArrowRightArrow: '⇆',
                     leftarrowtail: '↢',
                     LeftCeiling: '⌈',
                     LeftDoubleBracket: '⟦',
                     LeftDownTeeVector: '⥡',
                     LeftDownVectorBar: '⥙',
                     LeftDownVector: '⇃',
                     LeftFloor: '⌊',
                     leftharpoondown: '↽',
                     leftharpoonup: '↼',
                     leftleftarrows: '⇇',
                     leftrightarrow: '↔',
                     LeftRightArrow: '↔',
                     Leftrightarrow: '⇔',
                     leftrightarrows: '⇆',
                     leftrightharpoons: '⇋',
                     leftrightsquigarrow: '↭',
                     LeftRightVector: '⥎',
                     LeftTeeArrow: '↤',
                     LeftTee: '⊣',
                     LeftTeeVector: '⥚',
                     leftthreetimes: '⋋',
                     LeftTriangleBar: '⧏',
                     LeftTriangle: '⊲',
                     LeftTriangleEqual: '⊴',
                     LeftUpDownVector: '⥑',
                     LeftUpTeeVector: '⥠',
                     LeftUpVectorBar: '⥘',
                     LeftUpVector: '↿',
                     LeftVectorBar: '⥒',
                     LeftVector: '↼',
                     lEg: '⪋',
                     leg: '⋚',
                     leq: '≤',
                     leqq: '≦',
                     leqslant: '⩽',
                     lescc: '⪨',
                     les: '⩽',
                     lesdot: '⩿',
                     lesdoto: '⪁',
                     lesdotor: '⪃',
                     lesg: '⋚',
                     lesges: '⪓',
                     lessapprox: '⪅',
                     lessdot: '⋖',
                     lesseqgtr: '⋚',
                     lesseqqgtr: '⪋',
                     LessEqualGreater: '⋚',
                     LessFullEqual: '≦',
                     LessGreater: '≶',
                     lessgtr: '≶',
                     LessLess: '⪡',
                     lesssim: '≲',
                     LessSlantEqual: '⩽',
                     LessTilde: '≲',
                     lfisht: '⥼',
                     lfloor: '⌊',
                     Lfr: '𝔏',
                     lfr: '𝔩',
                     lg: '≶',
                     lgE: '⪑',
                     lHar: '⥢',
                     lhard: '↽',
                     lharu: '↼',
                     lharul: '⥪',
                     lhblk: '▄',
                     LJcy: 'Љ',
                     ljcy: 'љ',
                     llarr: '⇇',
                     ll: '≪',
                     Ll: '⋘',
                     llcorner: '⌞',
                     Lleftarrow: '⇚',
                     llhard: '⥫',
                     lltri: '◺',
                     Lmidot: 'Ŀ',
                     lmidot: 'ŀ',
                     lmoustache: '⎰',
                     lmoust: '⎰',
                     lnap: '⪉',
                     lnapprox: '⪉',
                     lne: '⪇',
                     lnE: '≨',
                     lneq: '⪇',
                     lneqq: '≨',
                     lnsim: '⋦',
                     loang: '⟬',
                     loarr: '⇽',
                     lobrk: '⟦',
                     longleftarrow: '⟵',
                     LongLeftArrow: '⟵',
                     Longleftarrow: '⟸',
                     longleftrightarrow: '⟷',
                     LongLeftRightArrow: '⟷',
                     Longleftrightarrow: '⟺',
                     longmapsto: '⟼',
                     longrightarrow: '⟶',
                     LongRightArrow: '⟶',
                     Longrightarrow: '⟹',
                     looparrowleft: '↫',
                     looparrowright: '↬',
                     lopar: '⦅',
                     Lopf: '𝕃',
                     lopf: '𝕝',
                     loplus: '⨭',
                     lotimes: '⨴',
                     lowast: '∗',
                     lowbar: '_',
                     LowerLeftArrow: '↙',
                     LowerRightArrow: '↘',
                     loz: '◊',
                     lozenge: '◊',
                     lozf: '⧫',
                     lpar: '(',
                     lparlt: '⦓',
                     lrarr: '⇆',
                     lrcorner: '⌟',
                     lrhar: '⇋',
                     lrhard: '⥭',
                     lrm: '‎',
                     lrtri: '⊿',
                     lsaquo: '‹',
                     lscr: '𝓁',
                     Lscr: 'ℒ',
                     lsh: '↰',
                     Lsh: '↰',
                     lsim: '≲',
                     lsime: '⪍',
                     lsimg: '⪏',
                     lsqb: '[',
                     lsquo: '‘',
                     lsquor: '‚',
                     Lstrok: 'Ł',
                     lstrok: 'ł',
                     ltcc: '⪦',
                     ltcir: '⩹',
                     lt: '<',
                     LT: '<',
                     Lt: '≪',
                     ltdot: '⋖',
                     lthree: '⋋',
                     ltimes: '⋉',
                     ltlarr: '⥶',
                     ltquest: '⩻',
                     ltri: '◃',
                     ltrie: '⊴',
                     ltrif: '◂',
                     ltrPar: '⦖',
                     lurdshar: '⥊',
                     luruhar: '⥦',
                     lvertneqq: '≨',
                     lvnE: '≨',
                     macr: '¯',
                     male: '♂',
                     malt: '✠',
                     maltese: '✠',
                     Map: '⤅',
                     map: '↦',
                     mapsto: '↦',
                     mapstodown: '↧',
                     mapstoleft: '↤',
                     mapstoup: '↥',
                     marker: '▮',
                     mcomma: '⨩',
                     Mcy: 'М',
                     mcy: 'м',
                     mdash: '—',
                     mDDot: '∺',
                     measuredangle: '∡',
                     MediumSpace: ' ',
                     Mellintrf: 'ℳ',
                     Mfr: '𝔐',
                     mfr: '𝔪',
                     mho: '℧',
                     micro: 'µ',
                     midast: '*',
                     midcir: '⫰',
                     mid: '∣',
                     middot: '·',
                     minusb: '⊟',
                     minus: '−',
                     minusd: '∸',
                     minusdu: '⨪',
                     MinusPlus: '∓',
                     mlcp: '⫛',
                     mldr: '…',
                     mnplus: '∓',
                     models: '⊧',
                     Mopf: '𝕄',
                     mopf: '𝕞',
                     mp: '∓',
                     mscr: '𝓂',
                     Mscr: 'ℳ',
                     mstpos: '∾',
                     Mu: 'Μ',
                     mu: 'μ',
                     multimap: '⊸',
                     mumap: '⊸',
                     nabla: '∇',
                     Nacute: 'Ń',
                     nacute: 'ń',
                     nang: '∠',
                     nap: '≉',
                     napE: '⩰',
                     napid: '≋',
                     napos: 'ŉ',
                     napprox: '≉',
                     natural: '♮',
                     naturals: 'ℕ',
                     natur: '♮',
                     nbsp: ' ',
                     nbump: '≎',
                     nbumpe: '≏',
                     ncap: '⩃',
                     Ncaron: 'Ň',
                     ncaron: 'ň',
                     Ncedil: 'Ņ',
                     ncedil: 'ņ',
                     ncong: '≇',
                     ncongdot: '⩭',
                     ncup: '⩂',
                     Ncy: 'Н',
                     ncy: 'н',
                     ndash: '–',
                     nearhk: '⤤',
                     nearr: '↗',
                     neArr: '⇗',
                     nearrow: '↗',
                     ne: '≠',
                     nedot: '≐',
                     NegativeMediumSpace: '​',
                     NegativeThickSpace: '​',
                     NegativeThinSpace: '​',
                     NegativeVeryThinSpace: '​',
                     nequiv: '≢',
                     nesear: '⤨',
                     nesim: '≂',
                     NestedGreaterGreater: '≫',
                     NestedLessLess: '≪',
                     NewLine: '\n',
                     nexist: '∄',
                     nexists: '∄',
                     Nfr: '𝔑',
                     nfr: '𝔫',
                     ngE: '≧',
                     nge: '≱',
                     ngeq: '≱',
                     ngeqq: '≧',
                     ngeqslant: '⩾',
                     nges: '⩾',
                     nGg: '⋙',
                     ngsim: '≵',
                     nGt: '≫',
                     ngt: '≯',
                     ngtr: '≯',
                     nGtv: '≫',
                     nharr: '↮',
                     nhArr: '⇎',
                     nhpar: '⫲',
                     ni: '∋',
                     nis: '⋼',
                     nisd: '⋺',
                     niv: '∋',
                     NJcy: 'Њ',
                     njcy: 'њ',
                     nlarr: '↚',
                     nlArr: '⇍',
                     nldr: '‥',
                     nlE: '≦',
                     nle: '≰',
                     nleftarrow: '↚',
                     nLeftarrow: '⇍',
                     nleftrightarrow: '↮',
                     nLeftrightarrow: '⇎',
                     nleq: '≰',
                     nleqq: '≦',
                     nleqslant: '⩽',
                     nles: '⩽',
                     nless: '≮',
                     nLl: '⋘',
                     nlsim: '≴',
                     nLt: '≪',
                     nlt: '≮',
                     nltri: '⋪',
                     nltrie: '⋬',
                     nLtv: '≪',
                     nmid: '∤',
                     NoBreak: '⁠',
                     NonBreakingSpace: ' ',
                     nopf: '𝕟',
                     Nopf: 'ℕ',
                     Not: '⫬',
                     not: '¬',
                     NotCongruent: '≢',
                     NotCupCap: '≭',
                     NotDoubleVerticalBar: '∦',
                     NotElement: '∉',
                     NotEqual: '≠',
                     NotEqualTilde: '≂',
                     NotExists: '∄',
                     NotGreater: '≯',
                     NotGreaterEqual: '≱',
                     NotGreaterFullEqual: '≧',
                     NotGreaterGreater: '≫',
                     NotGreaterLess: '≹',
                     NotGreaterSlantEqual: '⩾',
                     NotGreaterTilde: '≵',
                     NotHumpDownHump: '≎',
                     NotHumpEqual: '≏',
                     notin: '∉',
                     notindot: '⋵',
                     notinE: '⋹',
                     notinva: '∉',
                     notinvb: '⋷',
                     notinvc: '⋶',
                     NotLeftTriangleBar: '⧏',
                     NotLeftTriangle: '⋪',
                     NotLeftTriangleEqual: '⋬',
                     NotLess: '≮',
                     NotLessEqual: '≰',
                     NotLessGreater: '≸',
                     NotLessLess: '≪',
                     NotLessSlantEqual: '⩽',
                     NotLessTilde: '≴',
                     NotNestedGreaterGreater: '⪢',
                     NotNestedLessLess: '⪡',
                     notni: '∌',
                     notniva: '∌',
                     notnivb: '⋾',
                     notnivc: '⋽',
                     NotPrecedes: '⊀',
                     NotPrecedesEqual: '⪯',
                     NotPrecedesSlantEqual: '⋠',
                     NotReverseElement: '∌',
                     NotRightTriangleBar: '⧐',
                     NotRightTriangle: '⋫',
                     NotRightTriangleEqual: '⋭',
                     NotSquareSubset: '⊏',
                     NotSquareSubsetEqual: '⋢',
                     NotSquareSuperset: '⊐',
                     NotSquareSupersetEqual: '⋣',
                     NotSubset: '⊂',
                     NotSubsetEqual: '⊈',
                     NotSucceeds: '⊁',
                     NotSucceedsEqual: '⪰',
                     NotSucceedsSlantEqual: '⋡',
                     NotSucceedsTilde: '≿',
                     NotSuperset: '⊃',
                     NotSupersetEqual: '⊉',
                     NotTilde: '≁',
                     NotTildeEqual: '≄',
                     NotTildeFullEqual: '≇',
                     NotTildeTilde: '≉',
                     NotVerticalBar: '∤',
                     nparallel: '∦',
                     npar: '∦',
                     nparsl: '⫽',
                     npart: '∂',
                     npolint: '⨔',
                     npr: '⊀',
                     nprcue: '⋠',
                     nprec: '⊀',
                     npreceq: '⪯',
                     npre: '⪯',
                     nrarrc: '⤳',
                     nrarr: '↛',
                     nrArr: '⇏',
                     nrarrw: '↝',
                     nrightarrow: '↛',
                     nRightarrow: '⇏',
                     nrtri: '⋫',
                     nrtrie: '⋭',
                     nsc: '⊁',
                     nsccue: '⋡',
                     nsce: '⪰',
                     Nscr: '𝒩',
                     nscr: '𝓃',
                     nshortmid: '∤',
                     nshortparallel: '∦',
                     nsim: '≁',
                     nsime: '≄',
                     nsimeq: '≄',
                     nsmid: '∤',
                     nspar: '∦',
                     nsqsube: '⋢',
                     nsqsupe: '⋣',
                     nsub: '⊄',
                     nsubE: '⫅',
                     nsube: '⊈',
                     nsubset: '⊂',
                     nsubseteq: '⊈',
                     nsubseteqq: '⫅',
                     nsucc: '⊁',
                     nsucceq: '⪰',
                     nsup: '⊅',
                     nsupE: '⫆',
                     nsupe: '⊉',
                     nsupset: '⊃',
                     nsupseteq: '⊉',
                     nsupseteqq: '⫆',
                     ntgl: '≹',
                     Ntilde: 'Ñ',
                     ntilde: 'ñ',
                     ntlg: '≸',
                     ntriangleleft: '⋪',
                     ntrianglelefteq: '⋬',
                     ntriangleright: '⋫',
                     ntrianglerighteq: '⋭',
                     Nu: 'Ν',
                     nu: 'ν',
                     num: '#',
                     numero: '№',
                     numsp: ' ',
                     nvap: '≍',
                     nvdash: '⊬',
                     nvDash: '⊭',
                     nVdash: '⊮',
                     nVDash: '⊯',
                     nvge: '≥',
                     nvgt: '>',
                     nvHarr: '⤄',
                     nvinfin: '⧞',
                     nvlArr: '⤂',
                     nvle: '≤',
                     nvlt: '>',
                     nvltrie: '⊴',
                     nvrArr: '⤃',
                     nvrtrie: '⊵',
                     nvsim: '∼',
                     nwarhk: '⤣',
                     nwarr: '↖',
                     nwArr: '⇖',
                     nwarrow: '↖',
                     nwnear: '⤧',
                     Oacute: 'Ó',
                     oacute: 'ó',
                     oast: '⊛',
                     Ocirc: 'Ô',
                     ocirc: 'ô',
                     ocir: '⊚',
                     Ocy: 'О',
                     ocy: 'о',
                     odash: '⊝',
                     Odblac: 'Ő',
                     odblac: 'ő',
                     odiv: '⨸',
                     odot: '⊙',
                     odsold: '⦼',
                     OElig: 'Œ',
                     oelig: 'œ',
                     ofcir: '⦿',
                     Ofr: '𝔒',
                     ofr: '𝔬',
                     ogon: '˛',
                     Ograve: 'Ò',
                     ograve: 'ò',
                     ogt: '⧁',
                     ohbar: '⦵',
                     ohm: 'Ω',
                     oint: '∮',
                     olarr: '↺',
                     olcir: '⦾',
                     olcross: '⦻',
                     oline: '‾',
                     olt: '⧀',
                     Omacr: 'Ō',
                     omacr: 'ō',
                     Omega: 'Ω',
                     omega: 'ω',
                     Omicron: 'Ο',
                     omicron: 'ο',
                     omid: '⦶',
                     ominus: '⊖',
                     Oopf: '𝕆',
                     oopf: '𝕠',
                     opar: '⦷',
                     OpenCurlyDoubleQuote: '“',
                     OpenCurlyQuote: '‘',
                     operp: '⦹',
                     oplus: '⊕',
                     orarr: '↻',
                     Or: '⩔',
                     or: '∨',
                     ord: '⩝',
                     order: 'ℴ',
                     orderof: 'ℴ',
                     ordf: 'ª',
                     ordm: 'º',
                     origof: '⊶',
                     oror: '⩖',
                     orslope: '⩗',
                     orv: '⩛',
                     oS: 'Ⓢ',
                     Oscr: '𝒪',
                     oscr: 'ℴ',
                     Oslash: 'Ø',
                     oslash: 'ø',
                     osol: '⊘',
                     Otilde: 'Õ',
                     otilde: 'õ',
                     otimesas: '⨶',
                     Otimes: '⨷',
                     otimes: '⊗',
                     Ouml: 'Ö',
                     ouml: 'ö',
                     ovbar: '⌽',
                     OverBar: '‾',
                     OverBrace: '⏞',
                     OverBracket: '⎴',
                     OverParenthesis: '⏜',
                     para: '¶',
                     parallel: '∥',
                     par: '∥',
                     parsim: '⫳',
                     parsl: '⫽',
                     part: '∂',
                     PartialD: '∂',
                     Pcy: 'П',
                     pcy: 'п',
                     percnt: '%',
                     period: '.',
                     permil: '‰',
                     perp: '⊥',
                     pertenk: '‱',
                     Pfr: '𝔓',
                     pfr: '𝔭',
                     Phi: 'Φ',
                     phi: 'φ',
                     phiv: 'ϕ',
                     phmmat: 'ℳ',
                     phone: '☎',
                     Pi: 'Π',
                     pi: 'π',
                     pitchfork: '⋔',
                     piv: 'ϖ',
                     planck: 'ℏ',
                     planckh: 'ℎ',
                     plankv: 'ℏ',
                     plusacir: '⨣',
                     plusb: '⊞',
                     pluscir: '⨢',
                     plus: '+',
                     plusdo: '∔',
                     plusdu: '⨥',
                     pluse: '⩲',
                     PlusMinus: '±',
                     plusmn: '±',
                     plussim: '⨦',
                     plustwo: '⨧',
                     pm: '±',
                     Poincareplane: 'ℌ',
                     pointint: '⨕',
                     popf: '𝕡',
                     Popf: 'ℙ',
                     pound: '£',
                     prap: '⪷',
                     Pr: '⪻',
                     pr: '≺',
                     prcue: '≼',
                     precapprox: '⪷',
                     prec: '≺',
                     preccurlyeq: '≼',
                     Precedes: '≺',
                     PrecedesEqual: '⪯',
                     PrecedesSlantEqual: '≼',
                     PrecedesTilde: '≾',
                     preceq: '⪯',
                     precnapprox: '⪹',
                     precneqq: '⪵',
                     precnsim: '⋨',
                     pre: '⪯',
                     prE: '⪳',
                     precsim: '≾',
                     prime: '′',
                     Prime: '″',
                     primes: 'ℙ',
                     prnap: '⪹',
                     prnE: '⪵',
                     prnsim: '⋨',
                     prod: '∏',
                     Product: '∏',
                     profalar: '⌮',
                     profline: '⌒',
                     profsurf: '⌓',
                     prop: '∝',
                     Proportional: '∝',
                     Proportion: '∷',
                     propto: '∝',
                     prsim: '≾',
                     prurel: '⊰',
                     Pscr: '𝒫',
                     pscr: '𝓅',
                     Psi: 'Ψ',
                     psi: 'ψ',
                     puncsp: ' ',
                     Qfr: '𝔔',
                     qfr: '𝔮',
                     qint: '⨌',
                     qopf: '𝕢',
                     Qopf: 'ℚ',
                     qprime: '⁗',
                     Qscr: '𝒬',
                     qscr: '𝓆',
                     quaternions: 'ℍ',
                     quatint: '⨖',
                     quest: '?',
                     questeq: '≟',
                     quot: '"',
                     QUOT: '"',
                     rAarr: '⇛',
                     race: '∽',
                     Racute: 'Ŕ',
                     racute: 'ŕ',
                     radic: '√',
                     raemptyv: '⦳',
                     rang: '⟩',
                     Rang: '⟫',
                     rangd: '⦒',
                     range: '⦥',
                     rangle: '⟩',
                     raquo: '»',
                     rarrap: '⥵',
                     rarrb: '⇥',
                     rarrbfs: '⤠',
                     rarrc: '⤳',
                     rarr: '→',
                     Rarr: '↠',
                     rArr: '⇒',
                     rarrfs: '⤞',
                     rarrhk: '↪',
                     rarrlp: '↬',
                     rarrpl: '⥅',
                     rarrsim: '⥴',
                     Rarrtl: '⤖',
                     rarrtl: '↣',
                     rarrw: '↝',
                     ratail: '⤚',
                     rAtail: '⤜',
                     ratio: '∶',
                     rationals: 'ℚ',
                     rbarr: '⤍',
                     rBarr: '⤏',
                     RBarr: '⤐',
                     rbbrk: '❳',
                     rbrace: '}',
                     rbrack: ']',
                     rbrke: '⦌',
                     rbrksld: '⦎',
                     rbrkslu: '⦐',
                     Rcaron: 'Ř',
                     rcaron: 'ř',
                     Rcedil: 'Ŗ',
                     rcedil: 'ŗ',
                     rceil: '⌉',
                     rcub: '}',
                     Rcy: 'Р',
                     rcy: 'р',
                     rdca: '⤷',
                     rdldhar: '⥩',
                     rdquo: '”',
                     rdquor: '”',
                     rdsh: '↳',
                     real: 'ℜ',
                     realine: 'ℛ',
                     realpart: 'ℜ',
                     reals: 'ℝ',
                     Re: 'ℜ',
                     rect: '▭',
                     reg: '®',
                     REG: '®',
                     ReverseElement: '∋',
                     ReverseEquilibrium: '⇋',
                     ReverseUpEquilibrium: '⥯',
                     rfisht: '⥽',
                     rfloor: '⌋',
                     rfr: '𝔯',
                     Rfr: 'ℜ',
                     rHar: '⥤',
                     rhard: '⇁',
                     rharu: '⇀',
                     rharul: '⥬',
                     Rho: 'Ρ',
                     rho: 'ρ',
                     rhov: 'ϱ',
                     RightAngleBracket: '⟩',
                     RightArrowBar: '⇥',
                     rightarrow: '→',
                     RightArrow: '→',
                     Rightarrow: '⇒',
                     RightArrowLeftArrow: '⇄',
                     rightarrowtail: '↣',
                     RightCeiling: '⌉',
                     RightDoubleBracket: '⟧',
                     RightDownTeeVector: '⥝',
                     RightDownVectorBar: '⥕',
                     RightDownVector: '⇂',
                     RightFloor: '⌋',
                     rightharpoondown: '⇁',
                     rightharpoonup: '⇀',
                     rightleftarrows: '⇄',
                     rightleftharpoons: '⇌',
                     rightrightarrows: '⇉',
                     rightsquigarrow: '↝',
                     RightTeeArrow: '↦',
                     RightTee: '⊢',
                     RightTeeVector: '⥛',
                     rightthreetimes: '⋌',
                     RightTriangleBar: '⧐',
                     RightTriangle: '⊳',
                     RightTriangleEqual: '⊵',
                     RightUpDownVector: '⥏',
                     RightUpTeeVector: '⥜',
                     RightUpVectorBar: '⥔',
                     RightUpVector: '↾',
                     RightVectorBar: '⥓',
                     RightVector: '⇀',
                     ring: '˚',
                     risingdotseq: '≓',
                     rlarr: '⇄',
                     rlhar: '⇌',
                     rlm: '‏',
                     rmoustache: '⎱',
                     rmoust: '⎱',
                     rnmid: '⫮',
                     roang: '⟭',
                     roarr: '⇾',
                     robrk: '⟧',
                     ropar: '⦆',
                     ropf: '𝕣',
                     Ropf: 'ℝ',
                     roplus: '⨮',
                     rotimes: '⨵',
                     RoundImplies: '⥰',
                     rpar: ')',
                     rpargt: '⦔',
                     rppolint: '⨒',
                     rrarr: '⇉',
                     Rrightarrow: '⇛',
                     rsaquo: '›',
                     rscr: '𝓇',
                     Rscr: 'ℛ',
                     rsh: '↱',
                     Rsh: '↱',
                     rsqb: ']',
                     rsquo: '’',
                     rsquor: '’',
                     rthree: '⋌',
                     rtimes: '⋊',
                     rtri: '▹',
                     rtrie: '⊵',
                     rtrif: '▸',
                     rtriltri: '⧎',
                     RuleDelayed: '⧴',
                     ruluhar: '⥨',
                     rx: '℞',
                     Sacute: 'Ś',
                     sacute: 'ś',
                     sbquo: '‚',
                     scap: '⪸',
                     Scaron: 'Š',
                     scaron: 'š',
                     Sc: '⪼',
                     sc: '≻',
                     sccue: '≽',
                     sce: '⪰',
                     scE: '⪴',
                     Scedil: 'Ş',
                     scedil: 'ş',
                     Scirc: 'Ŝ',
                     scirc: 'ŝ',
                     scnap: '⪺',
                     scnE: '⪶',
                     scnsim: '⋩',
                     scpolint: '⨓',
                     scsim: '≿',
                     Scy: 'С',
                     scy: 'с',
                     sdotb: '⊡',
                     sdot: '⋅',
                     sdote: '⩦',
                     searhk: '⤥',
                     searr: '↘',
                     seArr: '⇘',
                     searrow: '↘',
                     sect: '§',
                     semi: ';',
                     seswar: '⤩',
                     setminus: '∖',
                     setmn: '∖',
                     sext: '✶',
                     Sfr: '𝔖',
                     sfr: '𝔰',
                     sfrown: '⌢',
                     sharp: '♯',
                     SHCHcy: 'Щ',
                     shchcy: 'щ',
                     SHcy: 'Ш',
                     shcy: 'ш',
                     ShortDownArrow: '↓',
                     ShortLeftArrow: '←',
                     shortmid: '∣',
                     shortparallel: '∥',
                     ShortRightArrow: '→',
                     ShortUpArrow: '↑',
                     shy: '­',
                     Sigma: 'Σ',
                     sigma: 'σ',
                     sigmaf: 'ς',
                     sigmav: 'ς',
                     sim: '∼',
                     simdot: '⩪',
                     sime: '≃',
                     simeq: '≃',
                     simg: '⪞',
                     simgE: '⪠',
                     siml: '⪝',
                     simlE: '⪟',
                     simne: '≆',
                     simplus: '⨤',
                     simrarr: '⥲',
                     slarr: '←',
                     SmallCircle: '∘',
                     smallsetminus: '∖',
                     smashp: '⨳',
                     smeparsl: '⧤',
                     smid: '∣',
                     smile: '⌣',
                     smt: '⪪',
                     smte: '⪬',
                     smtes: '⪬',
                     SOFTcy: 'Ь',
                     softcy: 'ь',
                     solbar: '⌿',
                     solb: '⧄',
                     sol: '/',
                     Sopf: '𝕊',
                     sopf: '𝕤',
                     spades: '♠',
                     spadesuit: '♠',
                     spar: '∥',
                     sqcap: '⊓',
                     sqcaps: '⊓',
                     sqcup: '⊔',
                     sqcups: '⊔',
                     Sqrt: '√',
                     sqsub: '⊏',
                     sqsube: '⊑',
                     sqsubset: '⊏',
                     sqsubseteq: '⊑',
                     sqsup: '⊐',
                     sqsupe: '⊒',
                     sqsupset: '⊐',
                     sqsupseteq: '⊒',
                     square: '□',
                     Square: '□',
                     SquareIntersection: '⊓',
                     SquareSubset: '⊏',
                     SquareSubsetEqual: '⊑',
                     SquareSuperset: '⊐',
                     SquareSupersetEqual: '⊒',
                     SquareUnion: '⊔',
                     squarf: '▪',
                     squ: '□',
                     squf: '▪',
                     srarr: '→',
                     Sscr: '𝒮',
                     sscr: '𝓈',
                     ssetmn: '∖',
                     ssmile: '⌣',
                     sstarf: '⋆',
                     Star: '⋆',
                     star: '☆',
                     starf: '★',
                     straightepsilon: 'ϵ',
                     straightphi: 'ϕ',
                     strns: '¯',
                     sub: '⊂',
                     Sub: '⋐',
                     subdot: '⪽',
                     subE: '⫅',
                     sube: '⊆',
                     subedot: '⫃',
                     submult: '⫁',
                     subnE: '⫋',
                     subne: '⊊',
                     subplus: '⪿',
                     subrarr: '⥹',
                     subset: '⊂',
                     Subset: '⋐',
                     subseteq: '⊆',
                     subseteqq: '⫅',
                     SubsetEqual: '⊆',
                     subsetneq: '⊊',
                     subsetneqq: '⫋',
                     subsim: '⫇',
                     subsub: '⫕',
                     subsup: '⫓',
                     succapprox: '⪸',
                     succ: '≻',
                     succcurlyeq: '≽',
                     Succeeds: '≻',
                     SucceedsEqual: '⪰',
                     SucceedsSlantEqual: '≽',
                     SucceedsTilde: '≿',
                     succeq: '⪰',
                     succnapprox: '⪺',
                     succneqq: '⪶',
                     succnsim: '⋩',
                     succsim: '≿',
                     SuchThat: '∋',
                     sum: '∑',
                     Sum: '∑',
                     sung: '♪',
                     sup1: '¹',
                     sup2: '²',
                     sup3: '³',
                     sup: '⊃',
                     Sup: '⋑',
                     supdot: '⪾',
                     supdsub: '⫘',
                     supE: '⫆',
                     supe: '⊇',
                     supedot: '⫄',
                     Superset: '⊃',
                     SupersetEqual: '⊇',
                     suphsol: '⟉',
                     suphsub: '⫗',
                     suplarr: '⥻',
                     supmult: '⫂',
                     supnE: '⫌',
                     supne: '⊋',
                     supplus: '⫀',
                     supset: '⊃',
                     Supset: '⋑',
                     supseteq: '⊇',
                     supseteqq: '⫆',
                     supsetneq: '⊋',
                     supsetneqq: '⫌',
                     supsim: '⫈',
                     supsub: '⫔',
                     supsup: '⫖',
                     swarhk: '⤦',
                     swarr: '↙',
                     swArr: '⇙',
                     swarrow: '↙',
                     swnwar: '⤪',
                     szlig: 'ß',
                     Tab: '	',
                     target: '⌖',
                     Tau: 'Τ',
                     tau: 'τ',
                     tbrk: '⎴',
                     Tcaron: 'Ť',
                     tcaron: 'ť',
                     Tcedil: 'Ţ',
                     tcedil: 'ţ',
                     Tcy: 'Т',
                     tcy: 'т',
                     tdot: '⃛',
                     telrec: '⌕',
                     Tfr: '𝔗',
                     tfr: '𝔱',
                     there4: '∴',
                     therefore: '∴',
                     Therefore: '∴',
                     Theta: 'Θ',
                     theta: 'θ',
                     thetasym: 'ϑ',
                     thetav: 'ϑ',
                     thickapprox: '≈',
                     thicksim: '∼',
                     ThickSpace: ' ',
                     ThinSpace: ' ',
                     thinsp: ' ',
                     thkap: '≈',
                     thksim: '∼',
                     THORN: 'Þ',
                     thorn: 'þ',
                     tilde: '˜',
                     Tilde: '∼',
                     TildeEqual: '≃',
                     TildeFullEqual: '≅',
                     TildeTilde: '≈',
                     timesbar: '⨱',
                     timesb: '⊠',
                     times: '×',
                     timesd: '⨰',
                     tint: '∭',
                     toea: '⤨',
                     topbot: '⌶',
                     topcir: '⫱',
                     top: '⊤',
                     Topf: '𝕋',
                     topf: '𝕥',
                     topfork: '⫚',
                     tosa: '⤩',
                     tprime: '‴',
                     trade: '™',
                     TRADE: '™',
                     triangle: '▵',
                     triangledown: '▿',
                     triangleleft: '◃',
                     trianglelefteq: '⊴',
                     triangleq: '≜',
                     triangleright: '▹',
                     trianglerighteq: '⊵',
                     tridot: '◬',
                     trie: '≜',
                     triminus: '⨺',
                     TripleDot: '⃛',
                     triplus: '⨹',
                     trisb: '⧍',
                     tritime: '⨻',
                     trpezium: '⏢',
                     Tscr: '𝒯',
                     tscr: '𝓉',
                     TScy: 'Ц',
                     tscy: 'ц',
                     TSHcy: 'Ћ',
                     tshcy: 'ћ',
                     Tstrok: 'Ŧ',
                     tstrok: 'ŧ',
                     twixt: '≬',
                     twoheadleftarrow: '↞',
                     twoheadrightarrow: '↠',
                     Uacute: 'Ú',
                     uacute: 'ú',
                     uarr: '↑',
                     Uarr: '↟',
                     uArr: '⇑',
                     Uarrocir: '⥉',
                     Ubrcy: 'Ў',
                     ubrcy: 'ў',
                     Ubreve: 'Ŭ',
                     ubreve: 'ŭ',
                     Ucirc: 'Û',
                     ucirc: 'û',
                     Ucy: 'У',
                     ucy: 'у',
                     udarr: '⇅',
                     Udblac: 'Ű',
                     udblac: 'ű',
                     udhar: '⥮',
                     ufisht: '⥾',
                     Ufr: '𝔘',
                     ufr: '𝔲',
                     Ugrave: 'Ù',
                     ugrave: 'ù',
                     uHar: '⥣',
                     uharl: '↿',
                     uharr: '↾',
                     uhblk: '▀',
                     ulcorn: '⌜',
                     ulcorner: '⌜',
                     ulcrop: '⌏',
                     ultri: '◸',
                     Umacr: 'Ū',
                     umacr: 'ū',
                     uml: '¨',
                     UnderBar: '_',
                     UnderBrace: '⏟',
                     UnderBracket: '⎵',
                     UnderParenthesis: '⏝',
                     Union: '⋃',
                     UnionPlus: '⊎',
                     Uogon: 'Ų',
                     uogon: 'ų',
                     Uopf: '𝕌',
                     uopf: '𝕦',
                     UpArrowBar: '⤒',
                     uparrow: '↑',
                     UpArrow: '↑',
                     Uparrow: '⇑',
                     UpArrowDownArrow: '⇅',
                     updownarrow: '↕',
                     UpDownArrow: '↕',
                     Updownarrow: '⇕',
                     UpEquilibrium: '⥮',
                     upharpoonleft: '↿',
                     upharpoonright: '↾',
                     uplus: '⊎',
                     UpperLeftArrow: '↖',
                     UpperRightArrow: '↗',
                     upsi: 'υ',
                     Upsi: 'ϒ',
                     upsih: 'ϒ',
                     Upsilon: 'Υ',
                     upsilon: 'υ',
                     UpTeeArrow: '↥',
                     UpTee: '⊥',
                     upuparrows: '⇈',
                     urcorn: '⌝',
                     urcorner: '⌝',
                     urcrop: '⌎',
                     Uring: 'Ů',
                     uring: 'ů',
                     urtri: '◹',
                     Uscr: '𝒰',
                     uscr: '𝓊',
                     utdot: '⋰',
                     Utilde: 'Ũ',
                     utilde: 'ũ',
                     utri: '▵',
                     utrif: '▴',
                     uuarr: '⇈',
                     Uuml: 'Ü',
                     uuml: 'ü',
                     uwangle: '⦧',
                     vangrt: '⦜',
                     varepsilon: 'ϵ',
                     varkappa: 'ϰ',
                     varnothing: '∅',
                     varphi: 'ϕ',
                     varpi: 'ϖ',
                     varpropto: '∝',
                     varr: '↕',
                     vArr: '⇕',
                     varrho: 'ϱ',
                     varsigma: 'ς',
                     varsubsetneq: '⊊',
                     varsubsetneqq: '⫋',
                     varsupsetneq: '⊋',
                     varsupsetneqq: '⫌',
                     vartheta: 'ϑ',
                     vartriangleleft: '⊲',
                     vartriangleright: '⊳',
                     vBar: '⫨',
                     Vbar: '⫫',
                     vBarv: '⫩',
                     Vcy: 'В',
                     vcy: 'в',
                     vdash: '⊢',
                     vDash: '⊨',
                     Vdash: '⊩',
                     VDash: '⊫',
                     Vdashl: '⫦',
                     veebar: '⊻',
                     vee: '∨',
                     Vee: '⋁',
                     veeeq: '≚',
                     vellip: '⋮',
                     verbar: '|',
                     Verbar: '‖',
                     vert: '|',
                     Vert: '‖',
                     VerticalBar: '∣',
                     VerticalLine: '|',
                     VerticalSeparator: '❘',
                     VerticalTilde: '≀',
                     VeryThinSpace: ' ',
                     Vfr: '𝔙',
                     vfr: '𝔳',
                     vltri: '⊲',
                     vnsub: '⊂',
                     vnsup: '⊃',
                     Vopf: '𝕍',
                     vopf: '𝕧',
                     vprop: '∝',
                     vrtri: '⊳',
                     Vscr: '𝒱',
                     vscr: '𝓋',
                     vsubnE: '⫋',
                     vsubne: '⊊',
                     vsupnE: '⫌',
                     vsupne: '⊋',
                     Vvdash: '⊪',
                     vzigzag: '⦚',
                     Wcirc: 'Ŵ',
                     wcirc: 'ŵ',
                     wedbar: '⩟',
                     wedge: '∧',
                     Wedge: '⋀',
                     wedgeq: '≙',
                     weierp: '℘',
                     Wfr: '𝔚',
                     wfr: '𝔴',
                     Wopf: '𝕎',
                     wopf: '𝕨',
                     wp: '℘',
                     wr: '≀',
                     wreath: '≀',
                     Wscr: '𝒲',
                     wscr: '𝓌',
                     xcap: '⋂',
                     xcirc: '◯',
                     xcup: '⋃',
                     xdtri: '▽',
                     Xfr: '𝔛',
                     xfr: '𝔵',
                     xharr: '⟷',
                     xhArr: '⟺',
                     Xi: 'Ξ',
                     xi: 'ξ',
                     xlarr: '⟵',
                     xlArr: '⟸',
                     xmap: '⟼',
                     xnis: '⋻',
                     xodot: '⨀',
                     Xopf: '𝕏',
                     xopf: '𝕩',
                     xoplus: '⨁',
                     xotime: '⨂',
                     xrarr: '⟶',
                     xrArr: '⟹',
                     Xscr: '𝒳',
                     xscr: '𝓍',
                     xsqcup: '⨆',
                     xuplus: '⨄',
                     xutri: '△',
                     xvee: '⋁',
                     xwedge: '⋀',
                     Yacute: 'Ý',
                     yacute: 'ý',
                     YAcy: 'Я',
                     yacy: 'я',
                     Ycirc: 'Ŷ',
                     ycirc: 'ŷ',
                     Ycy: 'Ы',
                     ycy: 'ы',
                     yen: '¥',
                     Yfr: '𝔜',
                     yfr: '𝔶',
                     YIcy: 'Ї',
                     yicy: 'ї',
                     Yopf: '𝕐',
                     yopf: '𝕪',
                     Yscr: '𝒴',
                     yscr: '𝓎',
                     YUcy: 'Ю',
                     yucy: 'ю',
                     yuml: 'ÿ',
                     Yuml: 'Ÿ',
                     Zacute: 'Ź',
                     zacute: 'ź',
                     Zcaron: 'Ž',
                     zcaron: 'ž',
                     Zcy: 'З',
                     zcy: 'з',
                     Zdot: 'Ż',
                     zdot: 'ż',
                     zeetrf: 'ℨ',
                     ZeroWidthSpace: '​',
                     Zeta: 'Ζ',
                     zeta: 'ζ',
                     zfr: '𝔷',
                     Zfr: 'ℨ',
                     ZHcy: 'Ж',
                     zhcy: 'ж',
                     zigrarr: '⇝',
                     zopf: '𝕫',
                     Zopf: 'ℤ',
                     Zscr: '𝒵',
                     zscr: '𝓏',
                     zwj: '‍',
                     zwnj: '‌' };

    // Constants for character codes:

    var C_NEWLINE = 10;
    var C_SPACE = 32;
    var C_ASTERISK = 42;
    var C_UNDERSCORE = 95;
    var C_BACKTICK = 96;
    var C_OPEN_BRACKET = 91;
    var C_CLOSE_BRACKET = 93;
    var C_LESSTHAN = 60;
    var C_GREATERTHAN = 62;
    var C_BANG = 33;
    var C_BACKSLASH = 92;
    var C_AMPERSAND = 38;
    var C_OPEN_PAREN = 40;
    var C_COLON = 58;

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
    var ENTITY = "&(?:#x[a-f0-9]{1,8}|#[0-9]{1,8}|[a-z][a-z0-9]{1,31});";

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

    var reEntityHere = new RegExp('^' + ENTITY, 'i');

    var reEntity = new RegExp(ENTITY, 'gi');

    // Matches a character with a special meaning in markdown,
    // or a string of non-special characters.  Note:  we match
    // clumps of _ or * or `, because they need to be handled in groups.
    var reMain = /^(?:[_*`\n]+|[\[\]\\!<&*_]|(?: *[^\n `\[\]\\!<&*_]+)+|[ \n]+)/m;

    // UTILITY FUNCTIONS
    var entityToChar = function(m) {
        var isNumeric = /^&#/.test(m);
        var isHex = /^&#[Xx]/.test(m);
        var uchar;
        if (isNumeric) {
            var num;
            if (isHex) {
                num = parseInt(m.slice(3,-1), 16);
            } else {
                num = parseInt(m.slice(2,-1), 10);
            }
            uchar = String.fromCharCode(num);
        } else {
            uchar = entities[m.slice(1,-1)];
        }
        return (uchar || m);
    };

    // Replace entities and backslash escapes with literal characters.
    var unescapeEntBS = function(s) {
        return s.replace(reAllEscapedChar, '$1')
                .replace(reEntity, entityToChar);
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

    // Returns the code for the character at the current subject position, or -1
    // there are no more characters.
    var peek = function() {
        if (this.pos < this.subject.length) {
            return this.subject.charCodeAt(this.pos);
        } else {
            return -1;
        }
    };

    // Parse zero or more space characters, including at most one newline
    var spnl = function() {
        this.match(/^ *(?:\n *)?/);
        return 1;
    };

    // All of the parsers below try to match something at the current position
    // in the subject.  If they succeed in matching anything, they
    // return the inline matched, advancing the subject.

    // Attempt to parse backticks, returning either a backtick code span or a
    // literal sequence of backticks.
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
                return true;
            }
        }
        // If we got here, we didn't match a closing backtick sequence.
        this.pos = afterOpenTicks;
        inlines.push({ t: 'Str', c: ticks });
        return true;
    };

    // Parse a backslash-escaped special character, adding either the escaped
    // character, a hard line break (if the backslash is followed by a newline),
    // or a literal backslash to the 'inlines' list.
    var parseBackslash = function(inlines) {
        var subj = this.subject,
            pos  = this.pos;
        if (subj.charCodeAt(pos) === C_BACKSLASH) {
            if (subj.charAt(pos + 1) === '\n') {
                this.pos = this.pos + 2;
                inlines.push({ t: 'Hardbreak' });
            } else if (reEscapable.test(subj.charAt(pos + 1))) {
                this.pos = this.pos + 2;
                inlines.push({ t: 'Str', c: subj.charAt(pos + 1) });
            } else {
                this.pos++;
                inlines.push({t: 'Str', c: '\\'});
            }
            return true;
        } else {
            return false;
        }
    };

    // Attempt to parse an autolink (URL or email in pointy brackets).
    var parseAutolink = function(inlines) {
        var m;
        var dest;
        if ((m = this.match(/^<([a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*)>/))) {  // email autolink
            dest = m.slice(1,-1);
            inlines.push(
                    {t: 'Link',
                     label: [{ t: 'Str', c: dest }],
                     destination: 'mailto:' + encodeURI(unescape(dest)) });
            return true;
        } else if ((m = this.match(/^<(?:coap|doi|javascript|aaa|aaas|about|acap|cap|cid|crid|data|dav|dict|dns|file|ftp|geo|go|gopher|h323|http|https|iax|icap|im|imap|info|ipp|iris|iris.beep|iris.xpc|iris.xpcs|iris.lwz|ldap|mailto|mid|msrp|msrps|mtqp|mupdate|news|nfs|ni|nih|nntp|opaquelocktoken|pop|pres|rtsp|service|session|shttp|sieve|sip|sips|sms|snmp|soap.beep|soap.beeps|tag|tel|telnet|tftp|thismessage|tn3270|tip|tv|urn|vemmi|ws|wss|xcon|xcon-userid|xmlrpc.beep|xmlrpc.beeps|xmpp|z39.50r|z39.50s|adiumxtra|afp|afs|aim|apt|attachment|aw|beshare|bitcoin|bolo|callto|chrome|chrome-extension|com-eventbrite-attendee|content|cvs|dlna-playsingle|dlna-playcontainer|dtn|dvb|ed2k|facetime|feed|finger|fish|gg|git|gizmoproject|gtalk|hcp|icon|ipn|irc|irc6|ircs|itms|jar|jms|keyparc|lastfm|ldaps|magnet|maps|market|message|mms|ms-help|msnim|mumble|mvn|notes|oid|palm|paparazzi|platform|proxy|psyc|query|res|resource|rmi|rsync|rtmp|secondlife|sftp|sgn|skype|smb|soldat|spotify|ssh|steam|svn|teamspeak|things|udp|unreal|ut2004|ventrilo|view-source|webcal|wtai|wyciwyg|xfire|xri|ymsgr):[^<>\x00-\x20]*>/i))) {
            dest = m.slice(1,-1);
            inlines.push({
                      t: 'Link',
                      label: [{ t: 'Str', c: dest }],
                      destination: encodeURI(unescape(dest)) });
            return true;
        } else {
            return false;
        }
    };

    // Attempt to parse a raw HTML tag.
    var parseHtmlTag = function(inlines) {
        var m = this.match(reHtmlTag);
        if (m) {
            inlines.push({ t: 'Html', c: m });
            return true;
        } else {
            return false;
        }
    };

    // Scan a sequence of characters with code cc, and return information about
    // the number of delimiters and whether they are positioned such that
    // they can open and/or close emphasis or strong emphasis.  A utility
    // function for strong/emph parsing.
    var scanDelims = function(cc) {
        var numdelims = 0;
        var first_close_delims = 0;
        var char_before, char_after, cc_after;
        var startpos = this.pos;

        char_before = this.pos === 0 ? '\n' :
            this.subject.charAt(this.pos - 1);

        while (this.peek() === cc) {
            numdelims++;
            this.pos++;
        }

        cc_after = this.peek();
        if (cc_after === -1) {
            char_after = '\n';
        } else {
            char_after = String.fromCharCode(cc_after);
        }

        var can_open = numdelims > 0 && numdelims <= 3 && !(/\s/.test(char_after));
        var can_close = numdelims > 0 && numdelims <= 3 && !(/\s/.test(char_before));
        if (cc === C_UNDERSCORE) {
            can_open = can_open && !((/[a-z0-9]/i).test(char_before));
            can_close = can_close && !((/[a-z0-9]/i).test(char_after));
        }
        this.pos = startpos;
        return { numdelims: numdelims,
                 can_open: can_open,
                 can_close: can_close };
    };

    var Emph = function(ils) {
        return {t: 'Emph', c: ils};
    };

    var Strong = function(ils) {
        return {t: 'Strong', c: ils};
    };

    var Str = function(s) {
        return {t: 'Str', c: s};
    };

    // Attempt to parse emphasis or strong emphasis.
    var parseEmphasis = function(cc,inlines) {
        var startpos = this.pos;
        var c ;
        var first_close = 0;
        c = String.fromCharCode(cc);

        var numdelims;
        var numclosedelims;
        var delimpos;

        // Get opening delimiters.
        res = this.scanDelims(cc);
        numdelims = res.numdelims;

        if (numdelims === 0) {
            this.pos = startpos;
            return false;
        }

        if (numdelims >= 4 || !res.can_open) {
            this.pos += numdelims;
            inlines.push(Str(this.subject.slice(startpos, startpos + numdelims)));
            return true;
        }

        this.pos += numdelims;

        var delims_to_match = numdelims;

        var current = [];
        var firstend;
        var firstpos;
        var state = 0;
        var can_close = false;
        var can_open = false;
        var last_emphasis_closer = null;
        while (this.last_emphasis_closer[c] >= this.pos) {
            res = this.scanDelims(cc);
            numclosedelims = res.numdelims;

            if (res.can_close) {
                if (last_emphasis_closer === null ||
                    last_emphasis_closer < this.pos) {
                    last_emphasis_closer = this.pos;
                }
                if (numclosedelims === 3 && delims_to_match === 3) {
                    delims_to_match -= 3;
                    this.pos += 3;
                    current = [{t: 'Strong', c: [{t: 'Emph', c: current}]}];
                } else if (numclosedelims >= 2 && delims_to_match >= 2) {
                    delims_to_match -= 2;
                    this.pos += 2;
                    firstend = current.length;
                    firstpos = this.pos;
                    current = [{t: 'Strong', c: current}];
                } else if (numclosedelims >= 1 && delims_to_match >= 1) {
                    delims_to_match -= 1;
                    this.pos += 1;
                    firstend = current.length;
                    firstpos = this.pos;
                    current = [{t: 'Emph', c: current}];
                } else {
                    if (!(this.parseInline(current,true))) {
                        break;
                    }
                }
                if (delims_to_match === 0) {
                    Array.prototype.push.apply(inlines, current);
                    return true;
                }
            } else if (!(this.parseInline(current,true))) {
                break;
            }
        }

        // we didn't match emphasis: fallback
        inlines.push(Str(this.subject.slice(startpos,
                                            startpos + delims_to_match)));
        if (delims_to_match < numdelims) {
            Array.prototype.push.apply(inlines, current.slice(0,firstend));
            this.pos = firstpos;
        } else { // delims_to_match === numdelims
            this.pos = startpos + delims_to_match;
        }

        if (last_emphasis_closer) {
            this.last_emphasis_closer[c] = last_emphasis_closer;
        }
        return true;
    };

    // Attempt to parse link title (sans quotes), returning the string
    // or null if no match.
    var parseLinkTitle = function() {
        var title = this.match(reLinkTitle);
        if (title) {
            // chop off quotes from title and unescape:
            return unescapeEntBS(title.substr(1, title.length - 2));
        } else {
            return null;
        }
    };

    // Attempt to parse link destination, returning the string or
    // null if no match.
    var parseLinkDestination = function() {
        var res = this.match(reLinkDestinationBraces);
        if (res) {  // chop off surrounding <..>:
            return encodeURI(unescape(unescapeEntBS(res.substr(1, res.length - 2))));
        } else {
            res = this.match(reLinkDestination);
            if (res !== null) {
                return encodeURI(unescape(unescapeEntBS(res)));
            } else {
                return null;
            }
        }
    };

    // Attempt to parse a link label, returning number of characters parsed.
    var parseLinkLabel = function() {
        if (this.peek() != C_OPEN_BRACKET) {
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
        while ((c = this.peek()) && c != -1 && (c != C_CLOSE_BRACKET || nest_level > 0)) {
            switch (c) {
            case C_BACKTICK:
                this.parseBackticks([]);
                break;
            case C_LESSTHAN:
                if (!(this.parseAutolink([]) || this.parseHtmlTag([]))) {
                    this.pos++;
                }
                break;
            case C_OPEN_BRACKET:  // nested []
                nest_level++;
                this.pos++;
                break;
            case C_CLOSE_BRACKET:  // nested []
                nest_level--;
                this.pos++;
                break;
            case C_BACKSLASH:
                this.parseBackslash([]);
                break;
            default:
                this.parseString([]);
            }
        }
        if (c === C_CLOSE_BRACKET) {
            this.label_nest_level = 0;
            this.pos++; // advance past ]
            return this.pos - startpos;
        } else {
            if (c === -1) {
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

    // Attempt to parse a link.  If successful, return the link.
    var parseLink = function(inlines) {
        var startpos = this.pos;
        var reflabel;
        var n;
        var dest;
        var title;

        n = this.parseLinkLabel();
        if (n === 0) {
            return false;
        }
        var afterlabel = this.pos;
        var rawlabel = this.subject.substr(startpos, n);

        // if we got this far, we've parsed a label.
        // Try to parse an explicit link: [label](url "title")
        if (this.peek() == C_OPEN_PAREN) {
            this.pos++;
            if (this.spnl() &&
                ((dest = this.parseLinkDestination()) !== null) &&
                this.spnl() &&
                // make sure there's a space before the title:
                (/^\s/.test(this.subject.charAt(this.pos - 1)) &&
                 (title = this.parseLinkTitle() || '') || true) &&
                this.spnl() &&
                this.match(/^\)/)) {
                inlines.push({ t: 'Link',
                          destination: dest,
                          title: title,
                          label: parseRawLabel(rawlabel) });
                return true;
            } else {
                this.pos = startpos;
                return false;
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
            return true;
        } else {
            this.pos = startpos;
            return false;
        }
        // Nothing worked, rewind:
        this.pos = startpos;
        return false;
    };

    // Attempt to parse an entity, return Entity object if successful.
    var parseEntity = function(inlines) {
        var m;
        if ((m = this.match(reEntityHere))) {
            inlines.push({ t: 'Str', c: entityToChar(m) });
            return true;
        } else {
            return false;
        }
    };

    // Parse a run of ordinary characters, or a single character with
    // a special meaning in markdown, as a plain string, adding to inlines.
    var parseString = function(inlines) {
        var m;
        if ((m = this.match(reMain))) {
            inlines.push({ t: 'Str', c: m });
            return true;
        } else {
            return false;
        }
    };

    // Parse a newline.  If it was preceded by two spaces, return a hard
    // line break; otherwise a soft line break.
    var parseNewline = function(inlines) {
        var m = this.match(/^ *\n/);
        if (m) {
            if (m.length > 2) {
                inlines.push({ t: 'Hardbreak' });
            } else if (m.length > 0) {
                inlines.push({ t: 'Softbreak' });
            }
            return true;
        }
        return false;
    };

    // Attempt to parse an image.  If the opening '!' is not followed
    // by a link, return a literal '!'.
    var parseImage = function(inlines) {
        if (this.match(/^!/)) {
            var link = this.parseLink(inlines);
            if (link) {
                inlines[inlines.length - 1].t = 'Image';
                return true;
            } else {
                inlines.push({ t: 'Str', c: '!' });
                return true;
            }
        } else {
            return false;
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
        if (this.peek() === C_COLON) {
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

    // Parse the next inline element in subject, advancing subject position.
    // If memoize is set, memoize the result.
    // On success, add the result to the inlines list, and return true.
    // On failure, return false.
    var parseInline = function(inlines, memoize) {
        var startpos = this.pos;
        var origlen = inlines.length;
        var memoized = memoize && this.memo[startpos];
        if (memoized) {
            this.pos = memoized.endpos;
            Array.prototype.push.apply(inlines, memoized.inline);
            return true;
        }

        var c = this.peek();
        if (c === -1) {
            return false;
        }
        var res;
        switch(c) {
        case C_NEWLINE:
        case C_SPACE:
            res = this.parseNewline(inlines);
            break;
        case C_BACKSLASH:
            res = this.parseBackslash(inlines);
            break;
        case C_BACKTICK:
            res = this.parseBackticks(inlines);
            break;
        case C_ASTERISK:
        case C_UNDERSCORE:
            res = this.parseEmphasis(c, inlines);
            break;
        case C_OPEN_BRACKET:
            res = this.parseLink(inlines);
            break;
        case C_BANG:
            res = this.parseImage(inlines);
            break;
        case C_LESSTHAN:
            res = this.parseAutolink(inlines) || this.parseHtmlTag(inlines);
            break;
        case C_AMPERSAND:
            res = this.parseEntity(inlines);
            break;
        default:
            res = this.parseString(inlines);
            break;
        }
        if (!res) {
            this.pos += 1;
            inlines.push({t: 'Str', c: String.fromCharCode(c)});
        }

        if (memoize) {
            this.memo[startpos] = { inline: inlines.slice(origlen),
                                    endpos: this.pos };
        }
        return true;
    };

    // Parse s as a list of inlines, using refmap to resolve references.
    var parseInlines = function(s, refmap) {
        this.subject = s;
        this.pos = 0;
        this.refmap = refmap || {};
        this.memo = {};
        this.last_emphasis_closer = { '*': s.length, '_': s.length };
        var inlines = [];
        while (this.parseInline(inlines, false)) {
        }
        return inlines;
    };

    // The InlineParser object.
    function InlineParser(){
        return {
            subject: '',
            label_nest_level: 0, // used by parseLinkLabel method
            last_emphasis_closer: null,  // used by parseEmphasis method
            pos: 0,
            refmap: {},
            memo: {},
            match: match,
            peek: peek,
            spnl: spnl,
            parseBackticks: parseBackticks,
            parseBackslash: parseBackslash,
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
                if (indent <= 3 && ln.charCodeAt(first_nonspace) === C_GREATERTHAN) {
                    offset = first_nonspace + 1;
                    if (ln.charCodeAt(offset) === C_SPACE) {
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
                while (i > 0 && ln.charCodeAt(offset) === C_SPACE) {
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

            } else if (ln.charCodeAt(first_nonspace) === C_GREATERTHAN) {
                // blockquote
                offset = first_nonspace + 1;
                // optional following space
                if (ln.charCodeAt(offset) === C_SPACE) {
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
                         ln.charAt(first_nonspace) == container.fence_char &&
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
            while (block.string_content.charCodeAt(0) === C_OPEN_BRACKET &&
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
            block.info = unescapeEntBS(block.strings[0].trim());
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
            console.log("Unknown inline type " + inline.t);
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
                          this.innersep + filling + this.innersep);
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
            console.log("Unknown block type " + block.t);
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
