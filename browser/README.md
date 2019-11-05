```
fd . browser | entr -sc 'SHOULD_REPLACE_EXPRESS_DEPENDENCY=1 npm run test'

# Alternatively
fd . browser | entr -sc 'SHOULD_REPLACE_EXPRESS_DEPENDENCY=1 npm run test -- --inspect-brk'

# Check bundle contents
cd browser; $(npm bin)/webpack
```

