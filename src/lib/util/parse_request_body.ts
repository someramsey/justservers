import * as v from "valibot";
import { error } from "@sveltejs/kit";

export async function parseRequestBody<
    TSchema extends v.BaseSchema<unknown, unknown, v.BaseIssue<unknown>>
>(request: Request, schema: TSchema): Promise<v.InferOutput<TSchema>> {
    let body: unknown;

    try {
        body = await request.json();
    } catch (jsonError) {
        error(400, {
            message: jsonError instanceof SyntaxError
                ? "Invalid JSON syntax in request body"
                : "Failed to parse request body as JSON"
        });
    }

    const parseResult = v.safeParse(schema, body);

    if (!parseResult.success) {
        const issues = v.flatten(parseResult.issues);
        const errorMessages = formatValidationErrors(issues);

        error(400, {
            message: `Request validation failed: ${errorMessages}`,
        });
    }

    return parseResult.output;
}

function formatValidationErrors(issues: v.FlatErrors<any>): string {
    const messages: string[] = [];

    if (issues.root) {
        messages.push(...issues.root);
    }

    if (issues.nested) {
        Object.entries(issues.nested).forEach(([field, fieldIssues]) => {
            if (Array.isArray(fieldIssues)) {
                fieldIssues.forEach(issue => {
                    messages.push(`${field}: ${issue}`);
                });
            }
        });
    }

    return messages.length > 0 ? messages.join(", ") : "Unknown validation error";
}