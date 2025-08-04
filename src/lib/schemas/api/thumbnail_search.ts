import * as v from "valibot";

export const ThumbnailSearchRequestSchema = v.object({
    targets: v.array(v.number())
});

export type ThumbnailSearchRequest = v.InferOutput<typeof ThumbnailSearchRequestSchema>;

export const ThumbnailSearchResponseSchema = v.variant('success', [
    v.object({
        success: v.literal(true),
        data: v.array(v.object({
            thumbnailUrl: v.string(),
            robloxId: v.number(),
        }))
    }),
    v.object({
        success: v.literal(false),
        message: v.string()
    }),
]);

export type ThumbnailSearchResponse = v.InferOutput<typeof ThumbnailSearchResponseSchema>;