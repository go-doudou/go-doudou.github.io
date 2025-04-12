---
sidebar: auto
---

# go-doudou's Enum Command

## Overview

The `enum` command is a powerful tool in the go-doudou framework that helps generate type-safe enum implementations in Go. As we know, Go doesn't have a built-in enum type like other languages such as Java, C#, or TypeScript. The `enum` command addresses this limitation by providing a way to define and use enums in a type-safe manner in your Go projects.

## Basic Usage

To use the `enum` command, first define your enum types using Go structs tagged with appropriate annotations. Then run the `go-doudou enum` command to generate the implementation code.

### Step 1: Define Your Enum Types

Create a file, for example `enums.go`, with struct definitions for your enums:

```go
package enums

//go:generate go-doudou enum

// Gender represents gender types
// @enum
type Gender struct {
	// @value
	Male int
	// @value
	Female int
}

// Color represents color types
// @enum
type Color struct {
	// @value red
	Red string
	// @value green
	Green string
	// @value blue
	Blue string
}

// Status represents status types
// @enum
type Status struct {
	// @value 1 Active status
	Active int
	// @value 2 Inactive status
	Inactive int
	// @value 3 Pending status
	Pending int
}
```

### Step 2: Generate the Enum Implementation

Run the enum command in the directory containing your enum definitions:

```bash
go-doudou enum
```

This will generate a file named `generated.go` in the same directory with all the necessary enum implementations.

## Annotations

The `enum` command uses annotations to identify and process the enum types:

- `// @enum`: Marks a struct as an enum type.
- `// @value`: Marks a field as an enum value.
- `// @value <literal_value>`: Specifies a custom literal value for the enum value.
- `// @value <literal_value> <description>`: Adds a description to the enum value.

## Generated Code

The generated code includes:

1. Constants for each enum value
2. Functions to convert between enum values and string representations
3. Methods to check if a value is valid for the enum type
4. JSON marshaling and unmarshaling support
5. String method for better readability

For example, for the `Gender` enum defined above, the generated code will include:

```go
const (
	GenderMale   = 0
	GenderFemale = 1
)

func (e Gender) String() string {
	switch e.Value {
	case GenderMale:
		return "Male"
	case GenderFemale:
		return "Female"
	}
	return fmt.Sprintf("Gender(%d)", e.Value)
}

// Additional methods...
```

## Using Enums in Your Code

After generating the enum implementation, you can use the enums in your code like this:

```go
package main

import (
	"fmt"

	"yourmodule/enums"
)

func main() {
	// Creating enum values
	gender := enums.Gender{Value: enums.GenderMale}
	color := enums.Color{Value: enums.ColorRed}
	
	// String representation
	fmt.Println(gender.String()) // Outputs: Male
	fmt.Println(color.String())  // Outputs: red
	
	// Checking if a value is valid
	invalidGender := enums.Gender{Value: 999}
	fmt.Println(invalidGender.IsValid()) // Outputs: false
	
	// JSON marshaling
	jsonData, _ := json.Marshal(gender)
	fmt.Println(string(jsonData)) // Outputs: {"Value":0}
	
	// Using enum in switch statement
	switch gender.Value {
	case enums.GenderMale:
		fmt.Println("This is a male")
	case enums.GenderFemale:
		fmt.Println("This is a female")
	}
}
```

## Advanced Features

### Custom Value Types

The `enum` command supports various types for enum values:

- `int`, `int8`, `int16`, `int32`, `int64`
- `uint`, `uint8`, `uint16`, `uint32`, `uint64`
- `string`
- `float32`, `float64`
- `bool`

### Custom Literal Values

You can specify custom literal values for enum constants:

```go
// @enum
type PaymentType struct {
	// @value "credit_card"
	CreditCard string
	// @value "debit_card"
	DebitCard string
	// @value "bank_transfer"
	BankTransfer string
}
```

This will generate constants with the specified values:

```go
const (
	PaymentTypeCreditCard   = "credit_card"
	PaymentTypeDebitCard    = "debit_card"
	PaymentTypeBankTransfer = "bank_transfer"
)
```

### Enum Value Descriptions

You can add descriptions to enum values for better documentation:

```go
// @enum
type OrderStatus struct {
	// @value 1 Order has been created but not processed
	Created int
	// @value 2 Order is being processed
	Processing int
	// @value 3 Order has been shipped
	Shipped int
	// @value 4 Order has been delivered
	Delivered int
	// @value 5 Order has been cancelled
	Cancelled int
}
```

The descriptions will be included in the generated documentation and can be accessed programmatically.

## Benefits of Using the Enum Command

1. **Type Safety**: Enforces correct enum values at compile time.
2. **JSON Serialization**: Built-in support for JSON marshaling and unmarshaling.
3. **String Representation**: Automatic conversion between enum values and strings.
4. **Documentation**: Automatically includes descriptions in generated code.
5. **Code Reuse**: Generates repetitive code automatically, reducing boilerplate.

## Conclusion

The `enum` command in go-doudou provides a powerful way to implement type-safe enums in Go, addressing one of the language's limitations. By using simple annotations and code generation, you can have all the benefits of enumeration types while maintaining the Go idioms and style. 