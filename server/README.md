 Option 1: Use ts-node to Run .ts Files (Good for Development)
 Update your package.json scripts to use ts-node:
 "scripts": {
  "start": "ts-node src/index.ts",
  "dev": "nodemon --exec ts-node src/index.ts"
}
Also ensure your entry point file is in src/index.ts.

Install ts-node and typescript if you haven’t already:
npm install --save-dev ts-node typescript
npm run dev   # for dev mode with nodemon
npm start     # just run index.ts directly


Option 2: Compile to JavaScript and Run with Node.js (Good for Production)
Step 1: Make sure your tsconfig.json is correct
{
  "compilerOptions": {
    "target": "ES6",
    "module": "NodeNext",
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true
  },
  "include": ["src/**/*.ts"]
}
Step 2: Update package.json to point to compiled JS
"main": "dist/index.js",
"scripts": {
  "build": "tsc",
  "start": "node dist/index.js",
  "dev": "nodemon --exec ts-node src/index.ts"
}
Step 3: Build and Run
npm run build
npm start


Don't point "main" to .ts if you're using raw Node.js.

Use ts-node only in development; compile for production.

Nodemon watches .ts files with ts-node, so you can hot reload during development.




***In Mongoose (a popular ODM for MongoDB), the select: false option on a schema field means:"Do not include this field by default in query results"
const userSchema = new mongoose.Schema({
  email: { type: String, required: true },
  password: { type: String, required: true, select: false }
});
Then, if you run:

const user = await User.findOne({ email: 'example@example.com' });
console.log(user); // password will NOT be included

How to include it when needed
You can explicitly include it using .select('+password'):
const user = await User.findOne({ email: 'example@example.com' }).select('+password');


//     | Feature                    | `res.send()` | `res.json()`                             |
// | -------------------------- | ------------ | ---------------------------------------- |
// | Accepts any data type      | ✅ Yes        | ❌ Only JSON-compatible values            |
// | Automatically sets headers | ❌ Not always | ✅ Yes (`Content-Type: application/json`) |
// | Clarity for JSON intent    | ❌ Implicit   | ✅ Clear                                  |
// | Converts object to JSON    | ✅ Yes        | ✅ Yes                                    |
