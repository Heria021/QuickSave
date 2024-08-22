import { ConvexError, v } from "convex/values";
import { query } from "./_generated/server";

export const getUserByEmail = query({
    args: {
        email: v.string(),
    },
    handler: async (ctx, args) => {
        const user = await ctx.db.query("users")
            .withIndex("by_email", (q) => q.eq("email", args.email))
            .unique(); 
        if (!user) {
            throw new ConvexError("User not found");
        }

        return user;
    },
});
