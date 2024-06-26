The [_LOADFONT](_LOADFONT) function loads a TrueType font (.TTF) or an OpenType font (.OTF) file in a specific size and style and returns a [LONG](LONG) font handle.

## Syntax

> handle& = [_LOADFONT](_LOADFONT)(fontFileName$, size%[, "{MONOSPACE|, BOLD|, ITALIC|, UNDERLINE|, UNICODE|, DONTBLEND}"])

## Description

* The assigned [LONG](LONG) font handle& variable return value designates a font style to be used somewhere in a program. Valid handle values are greater than 0 (**handle& > 0**).
* fontFileName$ is the filename of a TrueType or OpenType font. Can include the path to the font file. Best practice is to include font files with a program.
* If no path is specified for fontFileName$ and the font file isn't in the same folder as the resulting binary, QB64PE attempts to load from the default *C:\Windows\Fonts* path.
* size% is the [INTEGER](INTEGER) height of the font. If the size is too large or small an [ERROR Codes](ERROR-Codes) will occur.
* Optional comma separated *style* parameter(s) used are literal [STRING](STRING)s (in quotes) or can be contained in variable(s). 
  * **"MONOSPACE"** loads a font with all characters occupying the same width. Results may be too spaced out for fonts that aren't designed for monospace use.
  * **"BOLD", "ITALIC"** or **"UNDERLINE"** create bold, italic or underlined fonts when available in font.
    * (valid for QB64PE versions prior to 1.000).
* **For **QB64 1.000 or later**, you must specify the proper file name according to the desired attributes. For example, Courier New is in font **cour.ttf** while Courier New Bold is in font **courbd.ttf**, as shipped with Windows.
  * **"UNICODE"** loads Unicode fonts such as *cyberbit.ttf* which is included in the QB64PE downloads. 
  * **"DONTBLEND"** turns off [_ALPHA](_ALPHA) blending of fonts. This can also be done with the [_DONTBLEND](_DONTBLEND) statement.
  * You can pass different font styles using different predefined [STRING](STRING) variable lists. You **can** include an empty style string.
* **Always check that font handle values are greater than 0 (**handle& > 0**) before using them or [ERROR Codes](ERROR-Codes) may occur.**
* **NOTE: SCREEN 0 can only use ONE font on a screen page. Thus a style like underline would affect the entire page.**
* Font sizes can be found using the [_FONTHEIGHT](_FONTHEIGHT) function. Font *size*s can also affect [SCREEN (statement)](SCREEN-(statement)) sizes.
* [_FONTWIDTH](_FONTWIDTH) can only measure monospaced fonts. **"MONOSPACE" can be used to load a variable width font as a monospace font.**
* [_PRINTWIDTH](_PRINTWIDTH) can measure the width of a string of text in **graphics modes only**. Use one character to get the font's width.

**Font Handles**

* Multiple fonts will require multiple font variable handles unless used and freed consecutively.
* Font handles with values greater than 0 that are **no longer used** should be freed using [_FREEFONT](_FREEFONT). 
* **Predefined QB64** font handle numbers can be substituted before freeing a font handle:
  **_FONT 8** - default font for [SCREEN (statement)](SCREEN-(statement)) 1, 2, 7, 8 or 13
  **_FONT 14** - default font for [SCREEN (statement)](SCREEN-(statement)) 9 or 10
  **_FONT 16** - default font for [SCREEN (statement)](SCREEN-(statement)) 0 ([WIDTH](WIDTH) 80, 25 text only), 11 or 12
  **_FONT 9, 15** and **17** are the double width versions of 8, 14 and 16 respectively in text **SCREEN 0 only**.
* Once the font is changed to a predefined value, the font handle value can be freed using [_FREEFONT](_FREEFONT) for another font type.
* Font handle values of -1 (load failure) **do not** need to be freed. **An [ERROR Codes](ERROR-Codes) will occur if you try to free invalid handles.**

**Font File Specs**

* Windows users should find **TTF** font files in the C:\WINDOWS\FONTS folder, but don't depend on unusual ones being there. 
* **Check the font file name. The name in the "viewer" is not necessarily the file's name. Use the name in properties (right click a font listed and choose Properties in the contextual menu)**
* If a program is on a different drive than Windows, [ENVIRON$](ENVIRON$)("SYSTEMROOT") will return the path to the "WINDOWS" folder. Normally "C:\WINDOWS". Then add the "\FONTS\" folder and the font **.TTF** filename to the path [STRING](STRING).

## Example(s)

You need to know that if you are in a text mode (such as SCREEN 0 - the default) then you will only be able to use mono-spaced (fixed width) fonts.

```vb

rootpath$ = ENVIRON$("SYSTEMROOT")          'normally "C:\WINDOWS"
fontfile$ = rootpath$ + "\Fonts\cour.ttf"   'TTF file in Windows 
style$ = "monospace"          'font style is not case sensitive
f& =_LOADFONT(fontfile$, 30, style$)
_FONT f&
PRINT "Hello!"

```

```text

Hello!

```

*Note:* 30 means each row of text (including vertical spacing) will be exactly 30 pixels high. This may make some program screens larger. If you don't want a style listed just use style$ = "" if using a [STRING](STRING) variable for different calls.

In a 32-bit graphics mode you can alpha blend onto the background:

```vb

i& =_NEWIMAGE(800,600,32)
SCREEN i&
COLOR &HC0FFFF00,&H200000FF
f& =_LOADFONT("C:\Windows\Fonts\times.ttf", 25)  'normal style
PRINT "Hello!"

```

```text

Hello!

```

> *Note:* You can load a fixed width font file without using the "monospace" option and it will be treated as variable width. This can be useful because LOCATE treats the horizontal position as an offset in pixels for variable width fonts.

Loading a [Unicode](Unicode) font, *cyberbit.ttf*, which was downloaded with QB64:

```vb

SCREEN 12

DECLARE CUSTOMTYPE LIBRARY 'Directory Information using KERNEL32 provided by Dav
    FUNCTION GetModuleFileNameA& (BYVAL hModule AS LONG, lpFileName AS STRING, BYVAL nSize AS LONG)
    FUNCTION GetModuleFileNameW& (BYVAL hModule AS LONG, lpFileName AS STRING, BYVAL nSize AS LONG)
END DECLARE

'=== SHOW CURRENT PROGRAM
FileName$ = SPACE$(512)

Result = GetModuleFileNameA(0, FileName$, LEN(FileName$))
IF Result THEN PRINT "CURRENT PROGRAM (ASCII): "; LEFT$(FileName$, Result)

'load a unicode font
f = _LOADFONT("cyberbit.ttf", 24, "UNICODE")
_FONT f
Result = GetModuleFileNameW(0, FileName$, LEN(FileName$) \ 2)
LOCATE 2, 1
PRINT QuickCP437toUTF32$("CURRENT PROGRAM (UTF): ") + QuickUTF16toUTF32$(LEFT$(FileName$, Result * 2))
_FONT 16 'restore CP437 font

FUNCTION QuickCP437toUTF32$ (a$)
b$ = STRING$(LEN(a$) * 4, 0)
FOR i = 1 TO LEN(a$)
    ASC(b$, i * 4 - 3) = ASC(a$, i)
NEXT
QuickCP437toUTF32$ = b$
END FUNCTION

FUNCTION QuickUTF16toUTF32$ (a$)
b$ = STRING$(LEN(a$) * 2, 0)
FOR i = 1 TO LEN(a$) \ 2
    ASC(b$, i * 4 - 3) = ASC(a$, i * 2 - 1)
    ASC(b$, i * 4 - 2) = ASC(a$, i * 2)
NEXT
QuickUTF16toUTF32$ = b$
END FUNCTION 

```

## See Also

* [_FONT](_FONT), [_FONT (function)](_FONT-(function))
* [_FREEFONT](_FREEFONT) 
* [_PRINTSTRING](_PRINTSTRING), [_PRINTWIDTH](_PRINTWIDTH)
* [_PRINTMODE](_PRINTMODE), [_PRINTMODE (function)](_PRINTMODE-(function))
* [_FONTHEIGHT](_FONTHEIGHT), [_FONTWIDTH](_FONTWIDTH) 
* [Text Using Graphics](Text-Using-Graphics) (Demo)
* [Windows Libraries](Windows-Libraries)
