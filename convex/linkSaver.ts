import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const create = mutation({
    args: {
        url: v.string(),
        note: v.string(),
        pageurl: v.string(),
        imageUrl: v.string(),
        title: v.string(),
        siteName: v.string(),
        privacy: v.boolean(),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();

        if (!identity) {
            throw new ConvexError('Unauthorized');
        }

        if (!args.url || !/^https?:\/\/[^\s]+$/.test(args.url)) {
            throw new ConvexError('Invalid URL');
        }

        const existingLink = await ctx.db.query('links')
            .withIndex('by_url_and_email', (q) => q
                .eq('url', args.url)
                .eq('email', identity.email || '')
            )
            .unique();
        if (existingLink) {
            throw new ConvexError('Link already exists');
        }

        const newLink = await ctx.db.insert('links', {
            url: args.url,
            email: identity.email || '',
            note: args.note || '',
            pageurl: args.pageurl,
            imageUrl: args.imageUrl,
            title: args.title,
            siteName: args.siteName,
            privacy: args.privacy,
        });

        return newLink;
    },
});

export const get = query(async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
        throw new ConvexError('Unauthorized');
    }

    const links = await ctx.db.query('links').withIndex('by_email', (q) => q.eq('email', identity.email || '')).collect();

    return links;
});


export const remove = mutation({
    args: {
        id: v.id("links"),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();

        if (!identity) {
            throw new ConvexError("Unauthorized");
        }

        const existingLink = await ctx.db.get(args.id);
        if (!existingLink) {
            throw new ConvexError("Link not found");
        }

        if (existingLink.email !== identity.email) {
            throw new ConvexError("You do not have permission to delete this link");
        }


        await ctx.db.delete(args.id);

        return { success: true };
    },
});


export const update = mutation({
    args: {
        id: v.id("links"),
        url: v.string(),
        note: v.string(),
        privacy: v.boolean()
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();

        if (!identity) {
            throw new ConvexError("Unauthorized");
        }

        if (!args.url || !/^https?:\/\/[^\s]+$/.test(args.url)) {
            throw new ConvexError("Invalid URL");
        }

        const existingLink = await ctx.db.get(args.id);
        if (!existingLink) {
            throw new ConvexError("Link not found");
        }

        if (existingLink.email !== identity.email) {
            throw new ConvexError("You do not have permission to update this link");
        }

        const updatedLink = await ctx.db.patch(args.id, {
            url: args.url,
            note: args.note || "",
            privacy: args.privacy
        });

        return updatedLink;
    },
});