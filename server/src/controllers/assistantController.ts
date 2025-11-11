import { Request, Response } from "express";
import * as ai from "../services/aiService.js";
import * as prompts from "../services/promptTemplates.js";
import orderModel from "../models/orderModel.js";
import productModel from "../models/productModel.js";
import CartModel from "../models/cartModel.js";
import { Message } from "../models/MessageModel.js";

/**
 * POST /assistant/query
 * body: { userId, message, context }
 */
export async function handleQuery(req: Request, res: Response) {
  const { userId, message, context } = req.body;
  // Save user message
  await Message.create({ userId, role: "user", text: message });

  // *** quick heuristic routing: detect intent ***
  const txt = message.toLowerCase();
  try {
    if (/order|tracking|track|where is my order/.test(txt)) {
      // try to extract order id from message (simple regex)
      const idMatch = message.match(/([A-Z0-9\-]{6,})/i);
      if (idMatch) {
        const orderId = idMatch[1];
        const order = await orderModel.findOne({ _id: orderId }).lean();
        if (!order) return res.json({ reply: `I couldn't find order ${orderId}. Can you confirm the order id?` });
        // Compose assistant prompt & call AI for a friendly summary
        const system = prompts.assistantSystemPrompt();
        const prompt = prompts.prompt_checkOrder(orderId) + `\nDatabase: ${JSON.stringify(order, null, 2)}`;
        const aiResp = await ai.chat([{ role: "system", content: system }, { role: "user", content: prompt }], { max_tokens: 180 });
        await Message.create({ userId, role: "assistant", text: aiResp });
        return res.json({ reply: aiResp, structured: { order } });
      } else {
        return res.json({ reply: "Please share your order ID (it usually looks like ABC123 or a long hex).", needClarify: true });
      }
    }

    if (/recommend|suggest|what should i buy|looking for|i want/i.test(message)) {
      // product recommendations
      const system = prompts.assistantSystemPrompt();
      const prompt = prompts.prompt_productRec({ userId, query: message });
      const aiResp = await ai.chat([{ role: "system", content: system }, { role: "user", content: prompt }], { max_tokens: 240 });
      await Message.create({ userId, role: "assistant", text: aiResp });
      // Optionally parse expected skus from aiResp and fetch product details
      // naive parse for skus:
      const skuMatches = Array.from(aiResp.matchAll(/sku[:\s]*([A-Z0-9\-]+)/gi)).map(m => m[1]);
      const products = skuMatches.length ? await productModel.find({ sku: { $in: skuMatches } }).lean() : [];
      return res.json({ reply: aiResp, products });
    }

    if (/return|refund/.test(txt)) {
      return handleReturnHelp(req, res);
    }

    if (/cart|my cart|add to cart|remove from cart/.test(txt)) {
      return handleCartAssist(req, res);
    }

    // fallback: general customer-support
    const system = prompts.assistantSystemPrompt();
    const aiResp = await ai.chat([{ role: "system", content: system }, { role: "user", content: message }], { max_tokens: 200 });
    await Message.create({ userId, role: "assistant", text: aiResp });
    return res.json({ reply: aiResp });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "assistant_error", detail: String(err) });
  }
}

async function handleReturnHelp(req: Request, res: Response) {
  const { userId, message } = req.body;
  // Try to find orderId
  const idMatch = message.match(/([A-Z0-9\-]{6,})/i);
  if (!idMatch) return res.json({ reply: "Please give the order ID you'd like to return." });
  const order = await orderModel.findById(idMatch[1]).lean();
  if (!order) return res.json({ reply: "Couldn't find that order. Check the ID." });
  // instruct AI to provide return steps and eligibility
  const system = prompts.assistantSystemPrompt();
  const prompt = `User asks about return/refund for order ${idMatch[1]}. Order: ${JSON.stringify(order)}. Provide eligibility summary, steps to request return, and typical refund timelines.`;
  const aiResp = await ai.chat([{ role: "system", content: system }, { role: "user", content: prompt }], { max_tokens: 300 });
  await Message.create({ userId, role: "assistant", text: aiResp });
  return res.json({ reply: aiResp });
}

async function handleCartAssist(req: Request, res: Response) {
  const { userId, message } = req.body;
  const cart = await CartModel.findOne({ userId }).populate("items.productId").lean();
  if (!cart) return res.json({ reply: "Your cart is empty." });
  // ask AI to recommend cross-sells/upsells based on cart items
  const system = prompts.assistantSystemPrompt();
  const prompt = `User's cart: ${JSON.stringify(cart)}. User message: ${message}. Suggest 3 cross-sell/up-sell or complementary items with reasons. Respond in bullet points with sku references.`;
  const aiResp = await ai.chat([{ role: "system", content: system }, { role: "user", content: prompt }], { max_tokens: 220 });
  await Message.create({ userId, role: "assistant", text: aiResp });
  return res.json({ reply: aiResp });
}
