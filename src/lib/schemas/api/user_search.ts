import * as v from "valibot";

export const UserSearchRequestSchema = v.object({
    query: v.string(),
});

export type UserSearchRequest = v.InferOutput<typeof UserSearchRequestSchema>;

export const UserSearchResponseSchema = v.variant('success', [
    v.object({
        success: v.literal(true),
        data: v.array(v.object({
            username: v.string(),
            displayName: v.string(),
            robloxId: v.number(),
        }))
    }),
    v.object({
        success: v.literal(false),
        message: v.string()
    }),
]);

export type UserSearchResponse = v.InferOutput<typeof UserSearchResponseSchema>;

