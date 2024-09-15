import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
    users: defineTable({
        username: v.string(),
        imageUrl: v.string(),
        clerkId: v.string(),
        email: v.string(),
        content: v.boolean(),
    })
    .index("by_email", ["email"])
    .index("by_username", ["username"]) 
    .index("by_clerkId", ["clerkId"]),
    

    links: defineTable({
        url: v.string(),
        email: v.string(),
        note: v.string(),
        pageurl: v.string(),
        imageUrl: v.union(v.string(), v.null()), 
        title: v.string(),
        siteName: v.string(),
        privacy: v.boolean(),
    })
    .index("by_url", ["url"])
    .index("by_email", ["email"])
    .index("privacy", ['privacy'])
    .index("by_email_and_privacy", ["email", "privacy"]) 
    .index('by_url_and_email', ['url', 'email']),

    Share: defineTable({
        s_email: v.string(),
        r_email: v.string()
    })
    .index('receiver_sender_email', ['s_email', 'r_email'])
    .index('receiver_email', ['r_email'])
});