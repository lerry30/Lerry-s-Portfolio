## Go

Go is really different from other programming languages. Lots of things strictly require to be implemented the way they are, and it will not allow other shorthand alternatives to achieve things. So the structure is important in Go.

Go doesn't have **try-catch** block statement to handle errors; instead, you'll have to check whether a specific operation executed successfully or return the desired output, so handling operations in Go requires a significant amount of code.

### If statement
The next type of structure is a choice between alternatives.
All if-then statements require braces.

```go
if a == b {
	fmt.Println("a equals b")
} else {
	fmt.Println("a is not equal to b")
}
```

Brace here is a must, even though the expression inside is a line of statement, and there's no ternary way to make this as one line of expression.

Another concept is that an if statement can declare a variable next to the conditional expression; this might be a feature of Go to save space in memory, since the value is only available in that block.

They can start with a short declaration or statement.

```go
if err := doSomething(); err != nil {
	return err
}
```

### For loop
The loop control structure provides automatic repetition.
There is only for(no do or while), but with options.

1. Explicit control with an index variable

    ```go
    for i := 0; i < 10; i++ {
        fmt.Printf("(%d, %d) \n", i, i * i)
    }
    // prints (0, 0) up to (9, 81)
    ```

Three parts, all optional (initialize, check, increment)
The loop ends when the explicit check fails (e.g., i==10)

2. a. Implicit control through the range operator for arrays & slices

    ```go
    // one var: i is an index 0, 1, 2, ...
    for i := range myArray {
    fmt.Println(i, myArray[i])
    }

    // two vars: i is the index, v is a value
    for i, v := range myArray {
    fmt.Println(i, v)	
    }
    ```

The loop ends when the range is exhausted.

2. b. Implicit control through the range operator for loops

    ```go
	 // one var: k is key
	 for k := range myMap {
	 	fmt.Println(k, myMap[k])
	 }

	 // two vars: k is the key, v is a value
	 for k, v := range myMap {
	 	fmt.Println(k, v)
	 }
    ```

The loop ends when the range is exhausted.

3. An infinite loop with an explicit **break**

    ```go
	 i, j := 0, 3

	 // this loop must be made to stop
	 for {
	 	i, j = i + 50, j * j

		fmt.Println(i, j)
	 	if j > i {
	 		break		// when i = 150, j = 6561
		}
	  }
    ```

There is also **continue** to make an iteration start over.

If you only want range values, you need the blank identifier:

```go
// two vars: _ is the index (ignored),
// 			v is the value
for _, v := range myArray {
    fmt.Println(v)
}
```

Sometimes, you may not get a compile error for a type mismatch if you use only the one-var format (a slice of ints!)

The _ is an untyped, reusable "variable" placeholder.

### Labels and Loops
Sometimes we need to **break** or **continue** the outer loop (nested loop for quadratic search)

```go
outer:
	for k := range testItemsMap {
		for _, v := range returnedData {
			if k == v.ID {
				continue outer
			}
		}
	
		t.Errorf("key not fount: %s", k)
	}
}
```

We need a label to refer to the outer loop.

### Switch
A switch is another choice between alternatives.
It is a shortcut replacing a series of if-then statements.

```go
switch a := f.Get(); a {
case 0, 1, 2:
	fmt.Println("underflow possible")
case 3, 4, 5, 6, 7, 8:	// intentionally execute nothing for specific values
default:
	fmt.Println("warning: overload")
}
```

Alternatives may be empty and do not fall through (**break** is not required)

### Switch on true
Arbitrary comparisons may be made for a switch with no arguments.

```go
a := f.Get()

switch {
case a <= 2:
	fmt.Println("underflow possible")
case a <= 8:
	// evaluated in order
default:
	fmt.Println("warning: overload")
}
```

### Everything lives in a package
Every standalone program has a main package.

```go
package main

import "fmt"

func main() {
	fmt.Println("Hello, world")
}
```

Nothing is "global"; it's either in your package or in another.
It's either at package scope or function scope.

### Package-level declarations
You can declare anything at package scope

```go
package secrets

const DefaultUUID = "00000000-0000-0000-0000-0000000000"
var secretKey string

type k8scret struct {
	...
}

func Dp(it string) error {
	...
}
```

But you can't use the **short declaration operator** := outside of the function scope.

### Packages control visibility
Every name that's capitalized is exported.

```go
package secrets

import ...

type internal struct {
	...
}

func GetAll(space, name string) (map[string]string, error) {
	...
}
```

That means another package in the program can import it (within a package, everything is visible even across files).

Everything that starts with a capital letter is public, and a lower-case letter is only visible across files with the same package name.

### Imports
Each source file in your package must import what it needs

```go
package secret

import (
	"encoding/base64"
	"encoding/json"
	"fmt"
	"os"
	"strings"
)
```

It may only import what it needs; unused imports are an error.
Generally, files in the same package live together in a directory.

### No cycles
A package "A" cannot import a package that imports A

```go
package A
import "B"

// ------------

package B
import "A"	// wrong
```

Wrong, can't import packages that are already imported by imported packages. It means that the compiler will never know which comes first.

More common dependencies on a third package, or eliminate them.

The way Go compiles it is by a tree structure, not like a graph structure.
It is like the chicken and egg, which comes first?

### Initialization
Items within a package get initialized before main.

```go
const A = 1
var B int = C
var C int = A
```

Certain things need to be set up, like initializing variables on the package level.

```go
func Do() error {
	...
}

func init() {
	...
}
```

The init function runs when the program starts.
This is really helpful for pulling the driver for the database(MySQL).
The order of execution for init functions depends on the package setup. 
 
Only the runtime can call init, also before main.

The init function is also helpful for plugins, which are pieces of code that need to be run at runtime before the main function starts, and it is essential to be able to use their own functions.

The init function hides details of the program within a package, which is hated by most software engineers. But it can solve some of the little things, and abusing it will make the program hard to understand. So what makes a good program or package look like? A good package encapsulates deep, complex functionality behind a simple API.

### What makes a good package?
A package should embed deep functionality behind a simple API.

```go
package os
func Create(name string) (*File, error)
func Open(name string) (*File, error)

func (f *File) Read(b []byte) (n int, err error)
func (f *File) Write(b []byte) (n int, err error)
func (f *File) Close() error
```

The Unix file API is perhaps the best example of this model.
Roughly five functions hide a lot of complexity from the user.

### Declaration
- There are six ways to introduce a name:
- Constant declaration with const.
- Type declaration with type.
- Variable declaration with var (must have type or initial value, sometimes both).
- Short, initialized variable declaration of any type := only inside a function.
- Function declaration with func (methods may only be declared at the package level).
- Formal parameters and named returns of a function.

### Variable declarations
There are several ways to write a variable declaration:

```go
var a int		// 0 by default
var b int = 1
var c = 1		// int
var d = 1.0	// float64

var (
	x, y   int
	z       float64
	s       string
)
```

### Short declarations
The short declaration operator := has some rules:
1. It can't be used outside of a function.
2. It must be used (instead of var) in a control statement (if, etc).
3. It must declare at least one new variable.

```go
	err := doSomething()
	err := doSomethingElse() // wrong
	x, err := getSomeValue()  // ok; err is not declared
```

4. It won't re-use an existing declaration from an outer scope.

### Shadowing short declarations
Short declarations with := have some gotchas.

```go
package main

import (
	"errors"
	"fmt"
)

func main() {
	name, err := sayMyName("Lerry")

	if _, err := sayMyName(""); err != nil {
		fmt.Println(err)
	}
	
	fmt.Println(name, err)
}

func sayMyName(name string) (string, error) {
	if name == "" {
		return "", errors.New("Name is not specified")
	}
	return "Hi, " + name, nil
}
```

```bash
Output
	Name is not specified
	Hi, Lerry <nil>
```

This output clearly shows that assigning a value within scope can't bring it outside that scope, so a value is only available within that block of scope.

### Shadowing short declarations
Short declarations with := have some gotchas

```go
func BadRead(f *os.File, buf []byte) error  {
	var err error
	for {
		n, err := f.Read(buf) // shadow 'err' above
		
		// Exiting this block is really problematic because 
		// it will not bring the value assigned to the variable err.
		if err != nil {
			break
		}
		foo(buf)
	}
	return err // will always be nil
}
```

### Structural typing
It's the same type if it has the same structure or behavior

```go
a := [...]int{1, 2, 3}
b := [3]int{}

a = b	// ok

c := [4]int{}
a = c	// not ok
```

Go uses structural typing in most cases.

Structural typing
It's the same type if it has the same structure or behavior:
- Arrange of the same size and base type.
- Slices with the same base type.
- Maps of the same key and value types.
- Structs with the same sequence of field name/types.
- Functions with the same parameter & return types.

### Named typing
It's only the same type if it has the same declared type name.

```go
type x int

func main() {
	var a x	// x is a defined type; base int
	b := 12	// b defaults to int

	a = b	// TYPE MISMATCH

	a = 12	// ok, untyped literal
	a = x(b)	// ok, type conversion
}
```

Go uses named typing for non-function *user-declared types*.

We can create our own variable type with a specific base type. However, Go is strict when matching two variables with their own specifications. And in this example, there's a user-declared type, which can't accept a value from a variable with the same base type, which in this case is an integer. This can be solved by converting it.

### Numeric literals
Go keeps *"arbitrary"* precision for literal values (256 bits or more)
- Integer literals are untyped.
    + Assign a literal to any size integer without conversion.
    + Assign an integer literal to float, complex also.
- Ditto float and complex: picked by syntax of the literal

    2.0 or 2e9 or 2.0; or 2i3

- Mathematical constants can be very precise

	Pi = 3.14159265358979323846264338327950...

- Constant arithmetic done at compile time doesn't lose precision.

An integer like 12 is compatible with any numeric type like int, unsigned int or float64.

### Basic operators
Arithmetic: numbers only, except **+** on strings.

	+	-	*	/	%	++	--

Comparison: only numbers/strings support order.

	==	!=	<	>	<=	>=

Boolean: only booleans, with shortcut evaluation.

	!	&&	||

Bitwise: operate on integers.

	&	|	^	<<	>>	&^

Assignment: as above for binary operators.

	=	+=	-=	*=	/=	%=
	&=	|=	^=	<<=	    >>=	&^=

The only numeric operator that works on strings is the plus operator, which concatenates two separated strings.
Most programming languages allow things like numeric values like 1, treated as true, and 0 as false, but in Go, it requires the use of a comparison operator. It means to verify if the value is 1, it should use a double equal sign to compare it to the value.

### Operator precedence
There are only five levels of precedence, otherwise left-to-right:
Operators like multiplication:

	*	/	%	<<	>>	&	&^

Operators like addition:

	+	-	|	^

Comparison operators:

	==	!=	<	<=	>	>=

Logical and:

	&&

Logical or:

	||

### Formatted & File I/O
Input/Output
Standard I/O
Unix has the notion of three standard I/O streams.
They're open by default in every program
Most modern programming languages have followed this convention:
- Standard input
- Standard output
- Standard error(output)

These are normally mapped to the console/terminal, but can be redirected.

```bash
find . -name '*.go' | xargs grep -n "rintf" > print.txt
```

In Go, there are three ways to communicate with the terminal, and these are called standard I/O streams. Using the os package in Go allows you to insert values, display plain text, or display errors in the terminal.

Formatted I/O
We've been using the fmt package to do I/O.
By default, we've been printing to standard output.

```go
package main

import (
	"fmt"
	"os"
)

func main() {
	fmt.Println("printing a line to standard output")
	
	fmt.Fprintln(os.Stderr, "printing to error output")
}
```

Using the Println prints plain text or standard output.
On the other hand, using Fprintln enables you to print an error on the screen with the help of os.Stderr as its first parameter.

A whole family of functions
The fmt package uses reflection and can print anything.
Some of the functions take a format string.

```go
// always os.Stdout
fmt.Println(...interface{}) (int, error)
fmt.Printf(string, ...interface{}) (int, error)

// print to anything that has the correct Write() method
fmt.Fprintln(io.Writer, ...interface{}) (int, error)
fmt.Fprintf(io.Writer, string, ...interface{}) (int, error)

// return a string
fmt.Sprintln(...interface{}) string
fmt.Sprintf(string, ...interface{}) string
```

The fmt package has several functions that help us print on the screen. And these functions have their own role in how the string should be output in the terminal.

The Println is the regular way of displaying things and has the ability to output multiple variables or strings by separating them with commas.

The Printf allows us to print a formatted string or how text should be presented.

Sprintf or Sprintln are different, because they are not like displaying on the screen, but allow you to preformat the text. These will return the formatted string.

Format codes
The fmt package uses format codes reminiscent of C.

**%s** &nbsp;&nbsp;&nbsp;&nbsp; the uninterpreted bytes of the string or slice.<br>
**%q** &nbsp;&nbsp;&nbsp;&nbsp; a double-quoted string safely escape with Go syntax.<br>
**%c** &nbsp;&nbsp;&nbsp;&nbsp; the character represented by the corresponding Unicode code point.

**%d** &nbsp;&nbsp;&nbsp;&nbsp; base 10.<br>
**%x** &nbsp;&nbsp;&nbsp;&nbsp; base 16, with lower-case letters for a-f.<br>
**%f** &nbsp;&nbsp;&nbsp;&nbsp; decimal point but no exponent, e.g. 123.456<br>
**%t** &nbsp;&nbsp;&nbsp;&nbsp; the word true or false.

**%v** &nbsp;&nbsp;&nbsp;&nbsp; the value in a default format when printing structs, the plus flag(%+v) adds field names.<br>
**%#v** &nbsp;&nbsp;&nbsp; a Go-syntax representation of the value.<br>
**%T** &nbsp;&nbsp;&nbsp;&nbsp; a Go-syntax representation of the type of the value.

**%%** &nbsp;&nbsp;&nbsp;&nbsp; a literal percent sign; consumes no value[escape]

*Read the godoc.*

Here are some of the commonly used placeholders to represent a value from a certain object or variable in Go. This helps to format and identify what kind of value should be displayed on screen.

The most fascinating here is the %v, because %v is neat; it can represent anything, anything that is capable of being represented in a Go program, can be formatted by %v in some meaningful, readable way.

**Text Formatting Examples**

```go
no := 1.2
fmt.Printf("%f", no)

This will print a floating number with 6 decimal places, and you can control the number of decimals by using %.2f for 2 decimal places, you can adjust this number to %.3f, and so on.

a, b := 12, 345
e, d := 1.2, 3.45

fmt.Printf("|%6d|%6d|\n", a, b)
fmt.Printf("|%06d|%06d|\n", a, b)
fmt.Printf("|%-6d|%-6d|\n", a, b)
fmt.Printf("|%6f|%6.2f|\n", c, d)
```

Output:
	|         12|       345|
	|000012|000345|
	|12         |345       |
	|1.200000|       3.45|

The pipe symbols act as a border to create a layout for the table, while the %d represents an integer, and adding additional details like 6 in between % and d will define another way to format the string, so 6 represents a minimum of 6 characters allowed in a cell; therefore, the result will create space before the integer and make it justified to the right.

For the example above, the representation for the integer included another piece of information, which is 0 in front of the 6, which in turn acts as a replacement for the white spaces.

The negative sign(%-6d) for 6 justifies the text to the left.

Percent f (%f) represents a floating number, and this format will display up to 6 decimal places. So to format this number, add .2(%.2f) in between displays 2 decimal places only. And to justify the text to the right with 6 characters allowed, insert 6 before .2 like %6.2f to make them neat. But neglecting to specify the number of decimals to show causes the table to break down, even though only 6 characters are allowed in a cell.

Slice

s := []int{1, 2, 3}

fmt.Printf("%T\n", s)
fmt.Printf("%v\n", s)
fmt.Printf("%#v\n", s)

Output:
	[]int
	[1, 2, 3]
	[]int{1, 2, 3}

So in this instance, we've a slice, and knowing what type it is and the values it has is absolutely essential for debugging.

The %T is the representation of the type of object, which in this case prints a slice of ints([]int).

While the %v represents the values of the slice, the format is not like JSON, where the items are separated by commas, but instead only by white spaces.

Adding the pound sign %#v helps to visualize the entirety of the object. This prints out the type and values of the slice. And this is the most useful placeholder among them, since it provides all the details that we need.

Array of runes

a := [3]run{ 'a', 'b', 'c' }

fmt.Printf("%T\n", a)
fmt.Printf("%v\n", a)
fmt.Printf("%#v\n", a)
fmt.Printf("%q\n", a)

Output:
	[3]int32
	[97 98 99]
	[3]int32{ 97, 98, 98}
	['a' 'b' 'c']

These placeholders display the details of an array of runes.

Rune is just an alias for int32, and it just goes back to showing that int32 is the base type, because that's the Unicode code point; it takes a 32-bit integer to represent the Unicode code point.

In some other programming languages, rune is equivalent to char or character, which can be easily defined as they are wrapped with single quotes with a single character.

The printed values by using %v are presented by integers, and if you are familiar with the ASCII table that helps to map a certain character using a certain number, these numbers are what they actually mean.

So it's just a way of mapping characters based on a specific number.

Percent Q(%q) displays the actual characters in that array of runes.

Map

m := map[string]int{ "and": 1, "or": 2 }

fmt.Printf("%T\n", m)
fmt.Printf("%v\n", m)
fmt.Printf("%#v\n", m)

Output:
	map[string]int
	map[and:1  or:2]
	map[string]int{ "and": 1, "or": 2 }

String & Bytes

s := "a string"
b := []byte(s)

fmt.Printf("%T\n", s)	// string
fmt.Printf("%q\n", s)	// "a string"
fmt.Printf("%v\n", s)	// a string
fmt.Printf("%#v\n", s)	// "a string"

fmt.Printf("%v\n", s)
Output:
	[97 32 115 116 114 105 110 103]

So you'll come across where the string is in the form of bytes, and printing out its values is not ideal, since it will just show up as a slice of bytes, but behind that is just the representation of runes of characters, and you'll have to manually cast that bytes back to a string.

fmt.Printf("%v\n", string(b))
Output:
	a string

So here, the bytes is converted back into a string using string function.

File I/O
The package os has functions to open or create files, list directories, etc., and host the file type.

Package io has utilities to read and write; bufio provides the buffered I/O scanners, etc.

Package io/ioutil has extra utilities such as reading an entire file to memory or writing it out all at once.

Package strconv has utilities to convert to/from string representations.

Here's a simple program similar to the cat command that prints out the content of any given file.

package main

import (
	"fmt"
	"io"
	"os"
)

func main() {
	for _, fname := range os.Args[1:] {
		file, err := os.Open(fname)

		if err != nil {
			fmt.Fprintln(os.Stderr, err)
			continue
		}

		if _, err := io.Copy(os.Stdout, file); err != nil {
			fmt.Fprint(os.Stderr, err)
			continue
		}

		file.Close()
	}
}

This program allows you to input file names or file paths, read and save the content, and print it out. This is possible using these functions, os.Open(), io.Copy() and os.Stdout, so the os.Open() as what this function name implies, that it will open the file, io.Copy() gets all the file contents and saves it to os.Stdout.

Example of running this program and input files:

$ go run . examplefile.txt

	output text

$ go run . *.txt
	
	output text
	output text 2
	output text 3

$ go run . *.txt > newfile.txt

As you can see, the "output text" is the content of a .txt file from the first example.

The second example uses *.txt to capture all .txt files in the same directory. The star symbol means any (disregards file name), followed by the file extension, to filter out all the files and get all .txt files.

The last example, transfer the data from os.Stdout to a file, so it will automatically create a file and paste the contents.

Reading a file
What's going on here?

if f, err := os.Open(fname); err != nil {
	fmt.Fprintln(os.Stderr, "bad file: ", err)
}

We often call functions whose 2nd return value is a possible error.

	func Open(name string) (*File, error)

where the error can be compared to nil, meaning no error

Always check the error - the file might not really be open!

Read the number of bytes of files.

package main

import (
	"fmt"
	"io/ioutil"
	"os"
)

func main() {
	for _, fname := range os.Args[1:] {
		file, err := os.Open(fname)
		
		if err != nil {
			fmt.Fprintln(os.Stderr, err)
			continue
		}

		data, err := ioutil.ReadAll(file)

		if err != nil {
			fmt.Fprint(os.Stderr, err)
			continue
		}

		fmt.Println("The file has", len(data), "bytes")
		file.Close()
	}
}

$ go run . *.txt

	The file has 23 bytes
	The file has 25 bytes
	The file has 17 bytes
	The file has 65 bytes

The concept of the Unix file system is that every file is a file of bytes, and that makes it easy to deal with files. In this program, we are using ioutil.ReadAll(), which helps to read the entire file at once and return the data in slice of bytes along with the error. This should not be used to read a huge file like a terabyte since we don't have that size of RAM to deal with.

A simple WC program

package main

import (
	"bufio"
	"fmt"
	"os"
	"strings"
)

func main() {
	for _, fname := range os.Args[1:] {
		var lc, wc, cc int

		file, err := os.Open(fname)

		if err != nil {
			fmt.Fprintln(os.Stderr, err)
			continue
		}

		scan := bufio.NewScanner(file)

		for scan.Scan() {
			s := scan.Text()

			wc += len(strings.Fields(s))
			cc += len(s)
			lc++
		}
		
		fmt.Printf("%d %7d %7d %s\n", lc, wc, cc, fname)
		file.Close()
	}
}

$ go run . a.txt

	1	6	22	a.txt

$ go run . *.txt

	1	6	22	a.txt
	1	5	24	b.txt
	1	4	16	c.txt
	3	15	62	d.txt

$ wc *.txt

	1	6	23	a.txt
	1	5	25	b.txt
	1	4	17	c.txt
	3	15	65	d.txt
	6	30	130	total

In this program, we are using bufio to read every line in a file instead of reading the file all at once, and this is great since we are trying to count the number of words, lines, and characters that a file has.

The declaration of variable integers in a loop is needed to save the counts of contents. These variables are plain signed integers, which means they can also deal with negative numbers, but in this case, that is unnecessary, and in some programming languages like C, this might not be acceptable, and you'll have to explicitly set them as unsigned. However, since the default int in Go is a 64-bit integer, we have plenty of room for this small program.

If you look closely, you'll see that it will scan each line in a file, so the lc++ increments on each loop to count the lines. And to count every word, we need strings.Fields(), which turns the string into slice of string, in simple terms, this will separate each word and return a new slice of string. This is possible by identifying every white space and tab.

The cc or count characters will just use the len() function to count the characters in a line of a string.