import * as v from "valibot";

export const UserSearchRequestSchema = v.object({
    query: v.string(),
});

export type UserSearchRequest = v.InferOutput<typeof UserSearchRequestSchema>;

export const UserListSchema = v.array(v.object({
    username: v.string(),
    displayName: v.string(),
    id: v.number(),
}));

export type UserList = v.InferOutput<typeof UserListSchema>;

export const UserSearchResponseSchema = v.variant('success', [
    v.object({
        success: v.literal(true),
        data: UserListSchema
    }),
    v.object({
        success: v.literal(false),
        message: v.string()
    }),
]);

export type UserSearchResponse = v.InferOutput<typeof UserSearchResponseSchema>;

