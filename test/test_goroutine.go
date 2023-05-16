package test

import (
	"fmt"
	"sync"
)

var wg sync.WaitGroup

func sum(n int) {
	fmt.Println(n + 1)
	fmt.Println("sum")
	defer wg.Done()
}

func sub(n int) {
	fmt.Println(n - 1)
	fmt.Println("sub")
	defer wg.Done()
}

func main() {
	text := 123
	wg.Add(2)
	go sub(text)
	go sum(text)
	wg.Wait()
	fmt.Println("The main goroutine is executed")

}
