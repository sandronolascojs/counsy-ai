// Simple SQS worker factory.
// Usage:
// export const handler = createSqsWorker(async (message, attrs, { messageId }) => { ... });

type SimpleSqsRecord = { messageId: string; body: string };
type SimpleSqsEvent = { Records: SimpleSqsRecord[] };

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function tryJsonParse(value: string): unknown {
  try {
    return JSON.parse(value);
  } catch {
    return value; // non-JSON payload, return as-is
  }
}

function extractSnsFromSqsBody(body: string): { payload: unknown; attrs: Record<string, string> } {
  const outer = tryJsonParse(body);
  if (isObject(outer) && typeof outer.Message === 'string') {
    const inner = tryJsonParse(outer.Message);
    const rawAttrs = (outer.MessageAttributes ?? {}) as Record<
      string,
      { Type?: string; Value?: string }
    >;
    const attrs: Record<string, string> = {};
    for (const k in rawAttrs) {
      const v = rawAttrs[k]?.Value;
      if (typeof v === 'string') attrs[k] = v;
    }
    return { payload: inner, attrs };
  }
  return { payload: outer, attrs: {} };
}

export function createSqsWorker(
  processor: (
    message: unknown,
    attrs: Record<string, string>,
    meta: { messageId: string },
  ) => Promise<void>,
) {
  return async (event: SimpleSqsEvent): Promise<void> => {
    for (const record of event.Records) {
      const { payload, attrs } = extractSnsFromSqsBody(record.body);
      try {
        await processor(payload, attrs, { messageId: record.messageId });
      } catch (err) {
        // Rethrow to let SQS retry and route to DLQ as configured
        throw err instanceof Error ? err : new Error(String(err));
      }
    }
  };
}
