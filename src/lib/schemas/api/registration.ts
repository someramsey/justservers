import * as v from "valibot";

export const RegisterRequestSchema = v.object({
    robloxId: v.pipe(v.number(), v.minValue(1)),
    accessCode: v.pipe(v.string(), v.minLength(4))
});

export type RegistrationRequest = v.InferOutput<typeof RegisterRequestSchema>;

export const RegisterResponseSchema = v.variant('success', [
    v.object({
        success: v.literal(true),
        clientId: v.string(),
    }),
    v.object({
        success: v.literal(false),
        message: v.string()
    }),
]);

export type RegistrationResponse = v.InferOutput<typeof RegisterResponseSchema>;
