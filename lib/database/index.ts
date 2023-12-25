import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

// In Node.js, there is a global object which provides space to store global variables.
// This cached variable intends to hold the cached connection to our database.
let cached = (global as any).mongoose || { conn: null, promise: null };

export const connectToDatabase = async () => {
  if (cached.conn) return cached.connect;

  if (!MONGODB_URI) throw new Error("MONGODB_URI is missing! 🫥");

  cached.promise =
    cached.promise ||
    mongoose.connect(MONGODB_URI, {
      dbName: "evently",
      bufferCommands: false,
    });

  cached.conn = await cached.promise;
  console.log("MongoDB 연결 완료");
  return cached.conn;
};

/*
데이터베이스 환경설정을 위한 파일.
먼저 디펜던시 2개를 다운받아야 함: npm install mongoose mongodb

nodejs 앱에서 주로 사용하는 패턴 (특히 서버리스에서)

Why do we want to use this pattern of caching the connection?
In serverless functions, and in environments where a code can be executed multiple times,
but not in a single continuouse server process,
you need to manage connections efficiently,
because each invocation of a serverless function could result in a new connection to a database.
=> inefficient and can exhaust database resources.

Each server action will have to call this connectToDatabase() function again and again.
If we didn't cache them, we would be making new connections to the database multiple times.

But by caching our connection or promise of the connection,
all the subsequent invocations can re-use the existing connection if it is still open,
or otherwise just create a new one.
=> much more efficient!



*/
