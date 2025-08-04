import * as v from "valibot";

export const UpdateAccessCodeRequestSchema = v.object({
    code: v.pipe(v.string(), v.minLength(4))
});

export type UpdateAccessCodeRequest = v.InferOutput<typeof UpdateAccessCodeRequestSchema>;

export const UpdateAccessCodeResponseSchema = v.variant('success', [
    v.object({
        success: v.literal(true)
    }),
    v.object({
        success: v.literal(false),
        message: v.string()
    }),
]);

export type UpdateAccessCodeResponse = v.InferOutput<typeof UpdateAccessCodeResponseSchema>;
