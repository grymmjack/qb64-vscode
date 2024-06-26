### What are Arrays?

Arrays are simply variables with a number of elements that can each hold data in memory. To designate a certain element, integers denote the value's position in memory. Don't let talk about memory scare you! Basic does all of the work for you just by using the simple commands in this tutorial. Besides that, you have already been using memory since you created your first variable!

Arrays can store element bytes of information like any other variable depending on the type of the variable. The total memory bytes used by an array type can be determined using the table below multiplied by the number of array elements: 

Standard QBasic/QuickBASIC types:

* [STRING](STRING) = 1 byte per character
* [INTEGER](INTEGER) = 2 bytes (signed Integer values from -32768 to 32767) 
* [LONG](LONG) = 4 bytes (signed Integer values from -2147483648 to 2147483647)
* [SINGLE](SINGLE) = 4 bytes (up to 7 digit floating decimal point values)
* [DOUBLE](DOUBLE) = 8 bytes (up to 15 digit floating point values)

New types introduced by QB64

* [_BIT](_BIT) * 8 = 1 byte(signed Integer values of -1 or 0)
* [_BYTE](_BYTE) = 1 byte (signed Integer values from -128 to 127)
* [_INTEGER64](_INTEGER64) = 8 bytes (signed values from -9223372036854775808 to 9223372036854775807
* [_FLOAT](_FLOAT) = 10 bytes (better than Double accuracy)

While QBasic uses signed values **QB64** can use signed or [_UNSIGNED](_UNSIGNED) values for [_BIT](_BIT), [_BYTE](_BYTE), [INTEGER](INTEGER), [LONG](LONG) or [_INTEGER64](_INTEGER64) variable type values. 

The array's variable type must be determined when the array is created. If no type is used, the default type is [SINGLE](SINGLE).

### When do I need an Array?

**When you find yourself creating several variables with numbers in their names.** This may seem simplistic, but normally programmers tend to use similar names to denote similar value types. This makes arrays perfect in many cases. You can get several values of the same type simply by referring to the element positions in an array. Plus you can have thousands of possibilities when needed. 

Arrays can be created to hold values until they are needed. They can hold image or file data too! There are many possible uses! 

The only drawback is that the data is lost when the program ends, but array data can be permanently stored in files when you want to save the data. All that you need is a simple loop to transfer the data sequencially or save the entire array to a [BINARY](BINARY) file using **QB64** with a simple [PUT](PUT) statement. You also can retrieve the array data using one [GET](GET).

### Creating Array Variables

First we need to create a place in memory for the array. To do that we have to tell Basic the array's name, type of values it will hold and how many values we need to access. This is called dimensioning an array. 

How good are you at counting from zero? This might seem like a simple question, but think about this. How many elements would we have if they were numbered 0 through 10? If you said 11, then you were correct. Some people have problems counting when 0 is involved so Basic has an option to allow all arrays to start at 1. 

[OPTION BASE](OPTION-BASE) 1 will cause all array dimensions to begin at 1, [OPTION BASE](OPTION-BASE) 0 will cause all dimensions to begin at 0. The default when just using the maximum array size is 0. Use whatever option you are comfortable with.

Arrays in QuickBASIC 4.5 and QBasic are limited to 32767 elements, while arrays in **QB64** are limited to 2147483647 elements (over 2 billion). When the 64-bit version of QB64PE is implemented 9223372036854775807 elements will be the limit (but only on 64-bit systems).

[DIM](DIM) reserves the array's name, variable type and number of elements in memory before the array is used. DIM reserves a [STATIC](STATIC) (unchangeable) array unless the [$DYNAMIC]($DYNAMIC) (changeable) metacommand is used at the program's start or [REDIM](REDIM) was used to dimension the array originally.

Dimensions an array named 'Array' that is capable of holding 101 integer values including element 0.

```vb

DIM Array(100) AS INTEGER

```

An array starts at element 0 unless changed by [OPTION BASE](OPTION-BASE) 1 (which can set the start at 1), you can also define the start and end area by [DIM](DIM)ensioning within a range.

[DIM](DIM)ensioning with a range is possible also by using TO between the minimum and  highest elements. Arrays can start and end at any element(index) value up to 32767. **QB64** allows larger array sizes! 

dimensions an Integer array that can hold 100 values in indices 1 to 100.

```vb

DIM Array%(1 TO 100)

```

*Note:* The array type can also be designated by variable suffixes as % designates Integers above.

[REDIM](REDIM) can be used to redimension a dynamic array. Any information contained in the array before the REDIM will be lost...however. In order to use [REDIM](REDIM), the variable must have originally been dimensioned using [REDIM](REDIM), or a [$DYNAMIC]($DYNAMIC) metacommand must be placed at the top of the program.

*Example 3:*

```vb
 
OPTION BASE 1          ' placed before any arrays are dimensioned 
REDIM Array$(1000)      ' REDIM creates a dynamic array

```

**QB64** has a REDIM [_PRESERVE](_PRESERVE) action which can be used in a REDIM statement in order to preserve the data information in the array. 

REDIM without the _PRESERVE action erases the array contents

```vb

 REM $DYNAMIC
 DIM array(20)
 array(10) = 24
 PRINT array(10)
 REDIM _PRESERVE array(30)
 PRINT array(10)
 REDIM array(10)
 PRINT array(10)

```

```text

24
24
0

```

[_PRESERVE](_PRESERVE) also allows the lowest index to be changed. The old starting index data value will always be in the lowest new index when the index range limits are changed.

Changing the starting index number using the [_PRESERVE](_PRESERVE) action moves the data. 

```vb

 REDIM Array$(1 TO 50)
 Array$(1) = "I'm number one!"
 Array$(50) = "I'm 50..."
 REDIM _PRESERVE Array$(51 TO 100)
 PRINT Array$(51)              ' display new start index data
 PRINT Array$(100)             ' display new end data

```

```text

I'm number one!
I'm 50...

```

The memory segment address of the array is defined in [DEF SEG](DEF-SEG).

```vb

 DEF SEG = VARSEG(array(0))
 offset = VARPTR(array(0)) 'program designated offset element 

```

NOTE: If [OPTION BASE](OPTION-BASE) 1 is used change the 0 to 1. The array start index can be changed when some other data is indexed in the array.

### Multi-Dimensional Arrays

Multiple dimensions are possible to create tables of values. QuickBASIC can use up to 60 dimensions. In **QB64** the number of dimensions possible depends on your system memory (a lot more than 60 dimensions). Array data can be saved and restored using file data. 

**Otherwise the data is lost when a program closes.**

```text

                        ** TWO DIMENSIONAL ARRAY TABLES**

    Setting up a car sales Database: The sales for each month as represented in an array.
              
                     DIM Vehicle%(12, 4)       ' Vehicle%(month%, type%)
   
                       Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec
                    **    1   2   3   4   5   6   7   8   9   10  11  12  ← Month index**
         **Type index ↓**  -----------------------------------------------  
           Cars     **1:**  5  10  15  20  30   19  17  12  24  20  33  30
           Trucks   **2:**  3   8   7  10  15    9  11   8  15  10  16  11
           Vans     **3:**  4   6   8   9   7   10   9   7   9   8  10   7 
           SUV      **4:** 10   8   8   5  10    8   6   8  10  11   9   8

             To find monthly and yearly totals you could do something like this:  

                FOR month% = 1 TO 12
                   FOR type% = 1 TO 4
                      MonthlySales% = MonthlySales% + Vehicle%(month%, type%)
                   NEXT
                   YearlySales% = YearlySales% + MonthlySales%
                   PRINT "Monthly =", MonthlySales%; " Yearly ="; YearlySales%; "   "
                   INPUT$(1)               'stop to view each month 
                   MonthlySales% = 0       'zero month sales for next months total
                NEXT

```

Creating a two-dimensional array. A comma separates each dimension size.

```vb

  DIM Array(12, 10)           ' 2 dimensions can hold 143 data values 

```

One dimension could hold the month number and the other the number of items sold in 10 categories.

Dimensioning using index ranges.

```vb

  DIM Array(1 TO 12, 1 TO 10) ' 2 dimensions can hold 120 data values

```

### Working with the Array Elements

Once an array is created, you have to put something in it. As you may have noticed, each element or index has an integer value associated with it. Array(number%) refers to just one element of the array no matter what type it is. **Arrays CAN have negative numbered elements!**

You can place data into an array using several methods. The slowest method is directly placing data from the user. You can even use the array as the [INPUT](INPUT) variable. It is recommended that ANY program user entries be limited to text as INPUT will give Redo from start errors if a user enters a string value when a numerical input was desired. Numerical string data can be converted from strings simply by using [VAL](VAL). This creates less user errors! NOTE: **QB64** does not return a "Redo from start" error as [INPUT](INPUT) monitors entries.

```vb

DO
  INPUT "Enter your age: ", howold$ 
  age% = VAL(howold$)
LOOP UNTIL age% > 0

Playerage%(user%) = age%   'saves the players age to an indexed player number

PRINT Playerage%(user%)    'print array element to screen to verify entry

user% = user% + 1          'increment user number when all data has been entered

```

You could use several arrays to hold the player's name, high scores, etc. Once the data is in the array, it can be used until the program ends. Then the data is lost, but you can store the data to a file before closing the program simply by using a loop. See next section.

**To pass array data to a [SUB](SUB) or [FUNCTION](FUNCTION) parameter, an empty element bracket passes all elements while a number only passes one specified element of the array.**

### Array Indexing

Arrays can be set up to hold more than one kind of data, by indexing the two or more kinds of data. To do this, the programmer reserves one set of element or index values for each kind of data. The type of values MUST be the same except when using a [TYPE](TYPE) definition value.

### Sorting Array Data

Arrays can be sorted numerically or alphabetically using various sorting routines. Commonly [SWAP](SWAP) is used to trade element values in descending or ascending order.

### Saving Array Data

Since variables and arrays exist in memory, data is lost when a program closes. To preserve program data you must either create a permanent [DATA](DATA) field or save the data to files.

The next time a program is used, it can [OPEN](OPEN) that file and quickly restore all of the array data using a loop or **QB64** can [GET](GET) the entire file's data in one GET. Use [LINE INPUT (file statement)](LINE-INPUT-(file-statement)) # to set the array sizes by counting the number of data rows in a file if you used a [WRITE](WRITE) **CSV**(comma separated values) or a [PRINT (file statement)](PRINT-(file-statement)) # sequencial file. The number of records in a [TYPE](TYPE) or [FIELD](FIELD) defined [RANDOM](RANDOM) access file can be found by dividing the record size into the [LOF](LOF). You may want to make the array slightly larger for new entries.

### Image Arrays

[INTEGER](INTEGER) arrays are used to hold image information when using the following graphic procedures: [GET (graphics statement)](GET-(graphics-statement)), [PUT (graphics statement)](PUT-(graphics-statement)), [BSAVE](BSAVE) and [BLOAD](BLOAD). 

The [INTEGER](INTEGER) array size can be estimated by multiplying the height by the width of the image area. To find the actual size needed you can use the following routine to count backwards until something is found in the array. The example below returns the array size required to create a 20 by 20 image:

```vb

wide& = 20: deep& = 20  'change the sizes for any image area
DIM array(wide& * deep&) AS INTEGER
LINE (0, 0)-(wide& - 1, deep& - 1), 12, B 'the box border is all that you need to color.
GET (0, 0)-(wide& - 1, deep& - 1), array(0)
FOR s& = wide& * deep& TO 0 STEP -1
  IF array(s&) THEN arraysize& = s&: EXIT FOR
NEXT
PRINT arraysize&
END 

```

**Note: QB64PE can [GET (graphics statement)](GET-(graphics-statement)) the entire SCREEN 12 area into one array!**

See also: [Creating Sprite Masks](Creating-Sprite-Masks)

### SHARED Arrays

When array data is used with [SUB](SUB) or [FUNCTION](FUNCTION) procedures they can be passed as parameters. When passed as parameters, a specific index or the entire array can be used. To specify an index, the array is passed with the element number. If the entire array is passed, the element brackets should be empty. Example: **SUB SubName (ArrayName() AS INTEGER)**

Arrays can also be [SHARED](SHARED) by all procedures by using [DIM](DIM) [SHARED](SHARED) when the array is created. This allows the array data to be used in the main procedure and all sub-procedures. 

[COMMON](COMMON) allows Array data to be shared between program modules when used with [CHAIN](CHAIN). The two modules can share any variable values in a list of variables. The lists can use different variable names, but the types of values MUST be listed in the SAME order in both modules.

[COMMON SHARED](COMMON_SHARED) allows data to be shared between both modules and SUB or FUNCTION procedures.

Arrays can be created inside of [SUB](SUB) or [FUNCTION](FUNCTION) procedures by using [DIM](DIM) or [REDIM](REDIM). Also [SHARED](SHARED)(without DIM) can be used inside of a sub-procedure to share variable data with the Main program module ONLY. Other sub-procedures cannot reference the data. To share array data with other sub-procedures, array FUNCTIONS can be created that use the internal array elements as a parameter. **QB64 may allow sub-procedures to share values with other procedures soon!**

Arrays can be set as [STATIC](STATIC) to retain the values when a sub-procedure is exited. The values will be retained until changed inside of the procedure. If the procedure creates it's own array, you can use a STATIC True or False variable to determine when to [DIM](DIM) or [REDIM](REDIM) a STATIC array so that values are not lost every call. The *Ready%* variable below DIMs the array when the function is first used:

```vb

FUNCTION ScanKey% (scancode%)
  STATIC Ready%, keyflags%()
  IF NOT Ready% THEN REDIM keyflags%(0 TO 127): Ready% = -1 
  i% = INP(&H60)  'read keyboard states
  IF (i% AND 128) THEN keyflags%(i% XOR 128) = 0
  IF (i% AND 128) = 0 THEN keyflags%(i%) = -1
  K$ = INKEY$
  ScanKey% = keyflags%(scancode%)
  IF scancode% = 0 THEN Ready% = 0  'allows program to reset all values to 0 with a REDIM
END FUNCTION 

```

> *Explanation:* The STATIC *Ready%* value is always 0 when a procedure is first run. [NOT](NOT) zero makes the IF statement True so the array is created. The *Ready%* value is then changed to anything but zero to make NOT *Ready%* False when the procedure is called again. The FUNCTION is referenced just like an array would be. The value it returns is either 0 or -1 to verify that a certain key was released or pressed respectively. The keyboard status is also updated in the array each call. If the *scancode%* sent is 0(a key scan code that does not exist), the array is reset(re-dimensioned) on the next call as *Ready%* is reset to zero.

### Preserving Data

[_PRESERVE](_PRESERVE) can preserve data when [REDIM](REDIM) or [$DYNAMIC]($DYNAMIC) is used to create dynamic arrays. The current array data can be preserved while changing the array element size. Increasing the size will preserve data inside of existing indices in the resized array. If the size is decreased, only the existing indices values will be preserved. **The array [TYPE](TYPE) and number of array dimensions cannot be changed!**

**REDIM _PRESERVE ArrayName(1 TO 100)**
