import { ConvexError, v } from "convex/values";
import { query } from "./_generated/server";

export const userSearch = query({
    args: {
        searchString: v.string(),
    },
    handler: async (ctx, { searchString }) => {

        if (!searchString) {
            throw new ConvexError('Search string is required');
        }

        const allUsers = await ctx.db.query("users").collect();

        const filteredUsers = allUsers.filter(user =>
            user.username.toLowerCase().includes(searchString.toLowerCase()) ||
            user.email.toLowerCase().includes(searchString.toLowerCase())
        );

        return filteredUsers;
    },
});