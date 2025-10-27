export function assistantSystemPrompt() {
  return `You are an AI shopping assistant for an ecommerce store called GoStore. 
Your job is to help customers with:
- Order tracking and shipping information
- Product recommendations
- Return and refund support
- Cart management
- General customer support
Always reply politely and clearly.You must be helpful, concise, and -- when asked for actions like checking order status -- return a JSON object when the user asks for structured info. 
When providing product recommendations, ask for preferences if ambiguous.`;
}

export function prompt_checkOrder(orderId: string) {
  return `User asks to check order status. Order ID: ${orderId}. 
Return a short human-friendly text with current status and shipping carrier/tracking if available. Also provide a 'next_actions' array with possible structured options (e.g., ["track","cancel","return","support"]).`;
}

export function prompt_productRec(context: { userId?: string, query?: string, cartItems?: string[] }) {
  return `User requested product recommendations.
Context: ${JSON.stringify(context)}.
Return 3 product suggestions: sku, title, short_reason. If insufficient info, ask a clarifying question.`;
}
