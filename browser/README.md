```
fd . browser | entr -sc 'cd browser; npm run lint; cd ..; SHOULD_REPLACE_EXPRESS_DEPENDENCY=1 npm run test'
```
