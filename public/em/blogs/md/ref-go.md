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

Alternatives may be empty and do not fall through (**break** is not require)

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
Arithmetic: numbers only except **+** on string.

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