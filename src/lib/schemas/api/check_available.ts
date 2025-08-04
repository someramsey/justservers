import * as v from "valibot";

export const UserAvailableCheckRequestSchema = v.object({
    robloxId: v.number()
});

export type UserAvailableCheckRequest = v.InferOutput<typeof UserAvailableCheckRequestSchema>;

export const UserAvailableCheckResponse = v.object({
    available: v.boolean(),
});

export type UserAvailableCheckResponseSchema = v.InferOutput<typeof UserAvailableCheckResponse>;
