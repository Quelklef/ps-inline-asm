node ./src/main.js --in=./example/in --out=./example/actual-result
diff ./example/actual-result ./example/out && echo passed
