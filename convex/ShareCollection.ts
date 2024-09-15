import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const createShare = mutation({
    args: {
        r_email: v.string(),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();

        if (!identity) {
            throw new ConvexError("Unauthorized");
        }

        if (!identity.email || !args.r_email) {
            throw new ConvexError("Sender and receiver emails are required");
        }
        const existingShare = await ctx.db.query("Share")
            .withIndex("receiver_sender_email", (q) =>
                q.eq("s_email", identity.email || '').eq("r_email", args.r_email)
            )
            .unique();

        if (existingShare) {
            throw new ConvexError("Share entry already exists");
        }

        const newShare = await ctx.db.insert("Share", {
            s_email: identity.email,
            r_email: args.r_email,
        });

        return newShare;
    },
});

export const createMember = mutation({
    args: {
        s_email: v.string(),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();

        if (!identity) {
            throw new ConvexError("Unauthorized");
        }

        if (!identity.email || !args.s_email) {
            throw new ConvexError("Sender and receiver emails are required");
        }
        const existingShare = await ctx.db.query("Share")
            .withIndex("receiver_sender_email", (q) =>
                q.eq("s_email", args.s_email).eq("r_email", identity.email || '')
            )
            .unique();

        if (existingShare) {
            throw new ConvexError("Share entry already exists");
        }

        const newShare = await ctx.db.insert("Share", {
            r_email: identity.email,
            s_email: args.s_email,
        });

        return newShare;
    },
});


export const getShares = query(async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
        throw new ConvexError("Unauthorized");
    }

    const shares = await ctx.db.query("Share")
        .withIndex("receiver_sender_email", (q) => q.eq("s_email", identity.email || ""))
        .collect();

    return shares;
});


export const getAdded = query(async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
        throw new ConvexError("Unauthorized");
    }

    const shares = await ctx.db.query("Share")
        .withIndex("receiver_email", (q) => q.eq("r_email", identity.email || ""))
        .collect();

    return shares;
});


export const removeShare = mutation({
    args: {
        id: v.id("Share"),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();

        if (!identity) {
            throw new ConvexError("Unauthorized");
        }

        const existingShare = await ctx.db.get(args.id);
        if (!existingShare) {
            throw new ConvexError("Share entry not found");
        }

        await ctx.db.delete(args.id);

        return { success: true };
    },
});
