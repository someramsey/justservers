import * as v from "valibot";

export const OperationResultResponseSchema = v.variant('success', [
    v.object({
        success: v.literal(true)
    }),
    v.object({
        success: v.literal(false),
        message: v.string()
    }),
]);

export type OperationResultResponse = v.InferOutput<typeof OperationResultResponseSchema>;
