# Requirement

Programming task
Task background
Your manager asked you to support a new process relating one of your customers. Once a week, a file with testing data should be transferred from the customer to your company.

Task description
You should write two small programs, one for sending the file and another for receiving it.

Technical details
File should be transferred over the network. The file is a big (~3Gb) text file with no known format.
If you have any additional question, take an assumption and share it with us when submitting your work.
During your implementation please put emphasis on:
• Fit solution for transferring big file over the net
• Code modularity
• Correct error handling
• Unit testing
• Deploy everywhere approach

Limitation
Use Node.js& It’s related frameworks only

How to submit
Reply back with all required details to perform code review and run a test.

## Folder structure

┣ file-reciever/ ---------------------Company app which will recieve file.
┃ ┣ lib/
┃ ┃ ┗ client.spec.js
┃ ┣ client.js
┃ ┣ index.js
┃ ┣ package.json
┃ ┗ test.txt
┣ file-sender/-------------------------Customer app which will send file.
┃ ┣ lib/
┃ ┃ ┗ sender.spec.js
┃ ┣ index.js
┃ ┣ package.json
┃ ┣ sender.js
┃ ┗ test.txt
┗ README.md

# Instruction to test app

## To run file-reciever app

1: Install dependancy `npm i` in file-receiver directory
2: To run app use `npm start` in file-reciever directory

## To send file from file-sender app

1: Install dependancy `npm i` in file-sender directory
2: For example you want to send `test.txt` to the client so you have to copy inside file-sender directory as `test.txt ` is placed in the directory
3: To send `test.txt` to the file-reciever app just run the app by `npm start`

## To send your big file from file-sender app

1: You have to copy that big file inside file-sender directory as `test.txt` is placed in the directory
2: You have to pass the big file name with extention as a second argumant in function call of sendFile in index.js
3: To send big file to the file-reciever app just run the app by `npm start`

(You can see big file will be recieved in file-reciver directory)

## To run unit test cases

1: `npm test` in file-reciver directory
2: `npm test` in file-sender directory
