import { internalMutation, internalQuery } from "./_generated/server";
import { v } from 'convex/values';

export const create = internalMutation({
    args: {
        username: v.string(),
        imageUrl: v.string(),
        clerkId: v.string(),
        email: v.string(),
        content: v.boolean(), 
    },
    handler: async (ctx, args) => {
        const data = {
            username: args.username,
            imageUrl: args.imageUrl,
            clerkId: args.clerkId,
            email: args.email,
            content: args.content !== undefined ? args.content : false, // Default to false if Content is not provided
        };
        await ctx.db.insert("users", data);
    },
});

export const get = internalQuery({
    args: {
        clerkId: v.string()
    },
    handler(ctx, args) {
        return ctx.db.query("users")
            .withIndex("by_clerkId", q => q.eq("clerkId", args.clerkId))
            .unique();
    },
});
