This is a fenced code block:
```haskell
pairs :: [(Int,Char)]
pairs = [(x,y) | x <- [0..10], y <- ['a'..'z']]
```
Here is one with tildes:

~~~ haskell
pairs :: [(Int,Char)]
pairs = [(x,y) | x <- [0..10], y <- ['a'..'z']]
~~~

More metadata:

```haskell numberLines start=50
pairs :: [(Int,Char)]
pairs = [(x,y) | x <- [0..10], y <- ['a'..'z']]
```

More backticks:

```````` haskell
pairs :: [(Int,Char)]
pairs = [(x,y) | x <- [0..10], y <- ['a'..'z']]

backticks :: String
backticks = "`````"
`````````````

Without an end:

```
code with
no end

