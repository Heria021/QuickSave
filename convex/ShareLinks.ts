import { ConvexError, v } from "convex/values";
import { query } from "./_generated/server";

export const getPublicLinks = query({
    args: {
        id: v.optional(v.id("Share")),
    },
    handler: async (ctx, args) => {
        if (!args.id) {
            throw new ConvexError("ID is required");
        }

        const identity = await ctx.auth.getUserIdentity();

        if (!identity) {
            throw new ConvexError('Unauthorized');
        }

        const shareEntry = await ctx.db.get(args.id);

        if (!shareEntry || shareEntry.r_email !== identity.email) {
            throw new ConvexError("Share entry not found or access denied");
        }

        const s_email = shareEntry.s_email;

        const publicLinks = await ctx.db.query('links')
        .withIndex('by_email_and_privacy', (q) => 
            q.eq('email', s_email)
            .eq('privacy', true)
        )
        .collect();

        return publicLinks;
    },
});