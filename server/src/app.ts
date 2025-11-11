import express from "express"; //refer API reference of express site for more info.
import cors from "cors";
import path from "path";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import http from "http";
import helmet from "helmet";
import { errorHandler } from "./middleware/errorHandler.js";
import cartRouter from "./routes/cartRoute.js";
import { Message } from "./models/MessageModel.js";
import rateLimit from 'express-rate-limit';
import { customersData } from "./data/customers.js";
import * as ai from "./services/aiService.js";
import { Server } from "socket.io";
import { handleQuery } from "./controllers/assistantController.js";

import userRoutes from "./routes/userRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
import offersRoutes from "./routes/offersRoutes.js";
// import paymentRoutes from "./routes/paymentRoutes.js";
// import couponRouter from "./routes/couponRoute.js";
// import orderRoutes from "./routes/orderRoute.js";

import { serve } from "inngest/express";
import { inngest } from "./inngest/client.js";
import { functions } from "./inngest/functions.js";
import { initAdminChat } from "./sockets/initAdminChat.js";
import { initAssistantChat } from "./sockets/initAssistantChat.js";
import { socketAuthenticator } from "./middleware/socketAuthenticator.js";
import uploadRoutes from "./routes/uploadRoutes.js";  

const app = express();
const server = http.createServer(app);

const corsOptions = {
  origin: process.env.CLIENT_URL, // || "https://food-app-yt.onrender.com" for production,
  methods: "GET, POST, PUT, DELETE, PATCH, HEAD",
  credentials: true,          // ✅ Allow cookies/auth headers
};

// default middleware for any mern project
app.use(cors(corsOptions)); // refer npm cors site for more info.
app.use(morgan("dev"));
app.use(express.json({ limit: "32kb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(express.static("public")); //public is a folder name where we can store images
app.use(cookieParser());
app.use(helmet({crossOriginResourcePolicy: false}))
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }));
app.use(express.static("public"));   // serve static assets

app.use("/api/inngest", serve({ client: inngest, functions }));




// ---------------------- API ROUTES ----------------------
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/product", productRoutes);
app.use("/api/v1/category", categoryRoutes);
app.use("/api/v1/chat", chatRoutes)
app.use("/api/v1/offers", offersRoutes)
app.use("/api/v1/upload", uploadRoutes);
// app.use("/api/v1/cart", cartRouter);
// app.use("/api/v1/coupons", couponRouter);
// app.use("/api/v1/payments", paymentRoutes);
// app.use("/api/v1/order", orderRoutes);
// app.use("/api/v1/address", addressRoutes);
// app.use("/api/v1/event", eventRoutes);

//app.post("/assistant/query", handleQuery);

app.use("/api/v1/customers",  (req, res) => {
  res.status(200).json(customersData)
})


app.get("/api/getkey", (req, res) => {
  res.status(200).json({ key: process.env.RAZORPAY_API_KEY });
});

// ---------------------- SOCKET.IO ----------------------
const io = new Server(server, {
  cors: { origin: process.env.CLIENT_URL || "http://localhost:5173", methods: ["GET", "POST"] },
});

app.set("io", io);

// io.use((socket, next) => {
//   cookieParser()(
//     socket.request,
//     socket.request.res,
//     async (err) => await socketAuthenticator(err, socket, next)
//   );
// });

// Use separate namespaces
const adminNamespace = io.of("/admin");
const assistantNamespace = io.of("/assistant");

// Initialize chat modules
initAdminChat(adminNamespace);
initAssistantChat(assistantNamespace);



// Optional: Get chat history
app.get("/api/messages/:userId", async (req, res) => {
  const messages = await Message.find({
    $or: [
      { senderId: req.params.userId },
      { receiverId: req.params.userId },
    ],
  }).sort({ createdAt: 1 });
  res.json(messages);
});

app.get("/", (req, res) => {
  res.send("Socket.IO server is running...");
});


// ---------------------- Middleware to log cookies ----------------------
// res.send is the Express method used to send a response back to the client. This middleware overwrites res.send temporarily to log the Set-Cookie headers every time the server sends a response.so below code logs cookies in dev. remove it in production.
if (process.env.NODE_ENV !== "production") {
  app.use((req, res, next) => {
    const originalSend = res.send;
    res.send = function (...args) {
      console.log('Set-Cookie headers:', res.getHeader('Set-Cookie'));
      return originalSend.apply(this, args);
    };
    next();
  });
}

const DIRNAME = path.resolve();
app.use(express.static(path.join(DIRNAME, "/client/dist")));  // React build files
app.use("*", (_, res) => {
  res.sendFile(path.resolve(DIRNAME, "client", "dist", "index.html"));
});



import * as z from "zod";
// npm install @langchain/anthropic to call the model
import { createAgent, tool, humanInTheLoopMiddleware } from "langchain";
import { ChatGroq } from "@langchain/groq";
import { Command, MemorySaver } from "@langchain/langgraph";
import readline from "node:readline/promises";
//import { stdin as input, stdout as output } from 'node:process';

const gmailEmails = [
  {
    id: "msg-1",
    threadId: "thread-1",
    labelIds: ["INBOX", "IMPORTANT"],
    snippet: "Your refund for Order #FK12345 has been initiated...",
    payload: {
      headers: [
        { name: "From", value: "support@flipkart.com" },
        { name: "To", value: "govardhan.reddy@gmail.com" },
        { name: "Subject", value: "Refund Initiated for Your Order #FK12345" },
        { name: "Date", value: "Thu, 5 Nov 2025 10:23:00 +0530" },
      ],
      body: {
        data: "Hi Govardhan, your refund for Order #FK12345 has been initiated. It will be credited to your bank within 5-7 business days.",
      },
    },
    internalDate: "1730782380000",
  },
  {
    id: "msg-2",
    threadId: "thread-2",
    labelIds: ["INBOX"],
    snippet:
      "Return request approved. Your refund of ₹2,499 is being processed...",
    payload: {
      headers: [
        { name: "From", value: "no-reply@amazon.in" },
        { name: "To", value: "govardhan.reddy@gmail.com" },
        {
          name: "Subject",
          value: "Return Request Approved - Refund on the Way",
        },
        { name: "Date", value: "Wed, 4 Nov 2025 14:10:00 +0530" },
      ],
      body: {
        data: "We’ve processed your return for Order #AMZ7890. Your refund of ₹2,499 will be credited soon.",
      },
    },
    internalDate: "1730697600000",
  },
  {
    id: "msg-3",
    threadId: "thread-3",
    labelIds: ["INBOX", "PROMOTIONS"],
    snippet: "Your refund of ₹450 has been processed successfully...",
    payload: {
      headers: [
        { name: "From", value: "notifications@zomato.com" },
        { name: "To", value: "govardhan.reddy@gmail.com" },
        {
          name: "Subject",
          value: "Your refund for Order #ZMT456 has been processed",
        },
        { name: "Date", value: "Tue, 3 Nov 2025 19:42:00 +0530" },
      ],
      body: {
        data: "₹450 has been refunded to your original payment method.",
      },
    },
    internalDate: "1730611920000",
  },
  {
    id: "msg-4",
    threadId: "thread-4",
    labelIds: ["INBOX", "PURCHASES"],
    snippet:
      "Thank you for your purchase. You can request a refund within 30 days...",
    payload: {
      headers: [
        { name: "From", value: "billing@udemy.com" },
        { name: "To", value: "govardhan.reddy@gmail.com" },
        { name: "Subject", value: "Payment Successful - React Masterclass" },
        { name: "Date", value: "Mon, 2 Nov 2025 09:30:00 +0530" },
      ],
      body: {
        data: "Thank you for your purchase of React Masterclass. If you face issues, you can request a refund within 30 days.",
      },
    },
    internalDate: "1730507400000",
  },
  {
    id: "msg-5",
    threadId: "thread-5",
    labelIds: ["INBOX", "IMPORTANT"],
    snippet: "Your refund for ₹1,299 has been completed successfully...",
    payload: {
      headers: [
        { name: "From", value: "support@myntra.com" },
        { name: "To", value: "govardhan.reddy@gmail.com" },
        { name: "Subject", value: "Refund Completed - Order #MYN9981" },
        { name: "Date", value: "Sun, 1 Nov 2025 12:05:00 +0530" },
      ],
      body: {
        data: "Your refund for ₹1,299 has been completed successfully.",
      },
    },
    internalDate: "1730420700000",
  },
  {
    id: "msg-6",
    threadId: "thread-6",
    labelIds: ["INBOX"],
    snippet: "Your Apple One subscription has been renewed successfully...",
    payload: {
      headers: [
        { name: "From", value: "newsletter@apple.com" },
        { name: "To", value: "govardhan.reddy@gmail.com" },
        { name: "Subject", value: "Your monthly subscription invoice" },
        { name: "Date", value: "Sun, 1 Nov 2025 08:11:00 +0530" },
      ],
      body: {
        data: "Your Apple One subscription has been renewed for ₹195. No refund requested.",
      },
    },
    internalDate: "1730407860000",
  },
  {
    id: "msg-7",
    threadId: "thread-7",
    labelIds: ["INBOX", "UPDATES"],
    snippet: "We’ve received your refund request for Order #SWG123...",
    payload: {
      headers: [
        { name: "From", value: "help@swiggy.in" },
        { name: "To", value: "govardhan.reddy@gmail.com" },
        { name: "Subject", value: "Refund Request Received - Order #SWG123" },
        { name: "Date", value: "Sat, 31 Oct 2025 20:55:00 +0530" },
      ],
      body: {
        data: "We’ve received your refund request for Order #SWG123. It is currently under review.",
      },
    },
    internalDate: "1730359500000",
  },
  {
    id: "msg-8",
    threadId: "thread-8",
    labelIds: ["INBOX", "PROMOTIONS"],
    snippet: "Your Nykaa order is on the way! Track it here...",
    payload: {
      headers: [
        { name: "From", value: "offers@nykaa.com" },
        { name: "To", value: "govardhan.reddy@gmail.com" },
        { name: "Subject", value: "Your order is on the way!" },
        { name: "Date", value: "Fri, 30 Oct 2025 13:40:00 +0530" },
      ],
      body: {
        data: "Track your Nykaa order #NYK45678 using the link provided.",
      },
    },
    internalDate: "1730256600000",
  },
  {
    id: "msg-9",
    threadId: "thread-9",
    labelIds: ["INBOX", "IMPORTANT"],
    snippet: "Your Paytm refund for Transaction #PTM9001 has been initiated...",
    payload: {
      headers: [
        { name: "From", value: "care@paytm.com" },
        { name: "To", value: "govardhan.reddy@gmail.com" },
        { name: "Subject", value: "Refund Initiated for Transaction #PTM9001" },
        { name: "Date", value: "Thu, 6 Nov 2025 16:40:00 +0530" },
      ],
      body: {
        data: "Dear Govardhan, your Paytm refund for Transaction #PTM9001 has been initiated successfully. You will receive ₹899 in your Paytm Wallet within 24 hours.",
      },
    },
    internalDate: "1730872200000",
  },
];

const llm = new ChatGroq({
  model: "openai/gpt-oss-120b",
  temperature: 0,
  maxTokens: undefined,
  maxRetries: 2,
  // other params...
});

const getEmails = tool(
  () => {
    return JSON.stringify(gmailEmails);
  },
  {
    name: "get_emails",
    description: "Get the emails from inbox",
  }
);

const refund = tool(
  ({ emails }) => {
    return "All refunds processed successfully.";
  },
  {
    name: "refund",
    description: "process the refund for given emails",
    schema: z.object({
      emails: z
        .array(z.string())
        .describe("list of the emails which need to be refunded"),
    }),
  }
);

const agent = createAgent({
  model: llm,
  tools: [getEmails, refund],
  middleware: [
    humanInTheLoopMiddleware({
      interruptOn: { refund: true },
      descriptionPrefix: "refund pending approval",
    }),
  ],
  checkpointer: new MemorySaver(),
});

async function main() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  let interrupts = [];

  while (true) {
    const query = await rl.question("You: ");
    if (query.toLowerCase() === "exit" || query.toLowerCase() === "quit" || query.toLowerCase() === "/bye") {
      console.log("Exiting...");
      break;
    }
    const response = await agent.invoke(
      interrupts?.length
        ? new Command({
            resume: {
              [interrupts?.[0]?.id]: {
                decisions: [{ type: query === "1" ? "approve" : "reject" }],
              },
            },
          })
        : {
            messages: [
              {
                role: "user",
                content: query,
              },
            ],
          },
      { configurable: { thread_id: "1" } }
    );
    //console.log(JSON.stringify(response?.__interrupt__))

    interrupts = [];
    
    let output = "";

    if (response?.__interrupt__?.length) {
      interrupts?.push(response?.__interrupt__?.[0]);

      // narrow/cast interrupt so TypeScript knows the shape before property access
      const interrupt = (response as any)?.__interrupt__?.[0];

      if (interrupt) {
        const actionDesc = interrupt?.value?.actionRequests?.[0]?.description ?? "";
        output += actionDesc + "\n\n";
        output += "Choose:\n";

        const allowed: string[] = interrupt?.value?.reviewConfigs?.[0]?.allowedDescriptions ?? [];
        output += allowed
          .filter((decision) => decision !== "edit")
          .map((decision, idx) => `${idx + 1}. ${decision}`)
          .join("\n");
      } else {
        // fallback if interrupt unexpectedly missing
        output += "No interrupt details available.\n";
      }
    } else {
      output += response.messages[response.messages.length - 1].content;
    }
    console.log(output);
  }
  rl.close()
}

main();



// // Error handler (must be at last in code)
app.use(errorHandler);

export { server as app }; // export the server
