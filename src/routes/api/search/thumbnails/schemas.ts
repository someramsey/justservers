import * as v from "valibot";

export const ThumbnailSearchRequestSchema = v.object({
    targets: v.array(v.number())
});

export type ThumbnailSearchRequest = v.InferOutput<typeof ThumbnailSearchRequestSchema>;

export const ThumbnailReferenceSchema = v.object({
    thumbnailUrl: v.string(),
    userId: v.number(),
});

export type ThumbnailReference = v.InferOutput<typeof ThumbnailReferenceSchema>;

export const ThumbnailSearchResponseSchema = v.variant('success', [
    v.object({
        success: v.literal(true),
        data: v.array(ThumbnailReferenceSchema)
    }),
    v.object({
        success: v.literal(false),
        message: v.string()
    }),
]);

export type ThumbnailSearchResponse = v.InferOutput<typeof ThumbnailSearchResponseSchema>;