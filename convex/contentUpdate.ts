import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const contentUpdate = mutation({
  args: {
    content: v.boolean(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    
    if (!identity) {
      throw new Error("Unauthorized");
    }

    const user = await ctx.db.query("users")
      .withIndex("by_email", (q) => q.eq("email", identity.email || ''))
      .first();

    if (!user) {
      throw new Error("User not found");
    }

    await ctx.db.patch(user._id, {
      content: args.content,
    });

    return { success: true };
  },
});

export const getContent = query({
  args: {
    email: v.string(),
  },
  handler: async (ctx, args) => {
    const { email } = args;

    const user = await ctx.db.query("users")
      .withIndex("by_email", (q) => q.eq("email", email))
      .first();

    if (!user) {
      throw new Error("User not found");
    }

    return { content: user.content };
  },
});