# XP Bot
## Explanation
Basicly, this is a replica of Mee6's Level System with form of JSON database. If you are going to use this for multiple guilds, **consider changing json database to a better one like mysql or mongodb.**
## Requirements
 - **Nodejs** (latest or any usable version will be stable with this src)
## Installation

 - **Clone** the repo or **download as zip** and **extract** it.
 - After extraction, go to your config file and **change token configuration.**
 - Do not forget to change the **logging channel id** for level up messages in **`/database/database.json`**.
   - If you dont change it, it will **send the level up messages** to the user in **direct messages**.
 - Open your terminal and change directory as the repo directory.
 - After changing your directory, input these commands.
```
npm install
node index.js
```
 - If terminal says: `'Ready!'` with some date in front of it; You are done! 
Your bot should work perfectly right now.

## Extra
### For questions:
 - Use ISSUES tab.

### License
```
The MIT License (MIT)

Copyright (c) 2016 Pagar.me Pagamentos S/A

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```
