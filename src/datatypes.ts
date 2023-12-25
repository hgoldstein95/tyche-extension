/* eslint-disable @typescript-eslint/naming-convention */
import * as z from "zod";

export const schemaTestCaseLine = z.object({
  type: z.literal("test_case"),
  run_start: z.number(),
  property: z.string(),
  status: z.union([z.literal("passed"), z.literal("failed"), z.literal("gave_up")]),
  status_reason: z.string(),
  representation: z.string(),
  arguments: z.any().optional(),
  how_generated: z.string().optional(),
  features: z.record(z.any()),
  coverage: z.union([z.record(z.array(z.number())), z.literal("no_coverage_info"), z.null()]),
  metadata: z.any()
});

export const schemaInfoLine = z.object({
  type: z.union([z.literal("info"), z.literal("alert")]),
  run_start: z.number(),
  property: z.string(),
  title: z.string(),
  content: z.string(),
});

export const schemaErrorLine = z.object({
  type: z.literal("error"),
  run_start: z.number().optional(),
  property: z.string().optional(),
  message: z.string(),
});

export const schemaDataLine = z.union([schemaTestCaseLine, schemaInfoLine]);

export const schemaProtoLine = z.union([schemaTestCaseLine, schemaInfoLine, schemaErrorLine]);

export type TestCaseLine = z.infer<typeof schemaTestCaseLine>;
export type InfoLine = z.infer<typeof schemaInfoLine>;
export type ErrorLine = z.infer<typeof schemaErrorLine>;
export type DataLine = z.infer<typeof schemaDataLine>;
export type ProtoLine = z.infer<typeof schemaProtoLine>;

export function parseDataLines(jsonString: string): DataLine[] | string {
  const dataLines = [];
  for (const line of jsonString.split("\n")) {
    if (line === "") {
      continue;
    }
    try {
      const obj = JSON.parse(line);
      const parsedLine = schemaProtoLine.parse(obj);
      dataLines.push(parsedLine);
    } catch (e) {
      return ("Tyche: Could not parse JSON report.\n" + e + "\nInvalid Object: " + line);
    }
  }

  const errorLine = dataLines.find((line) => line.type === "error") as ErrorLine | undefined;
  if (errorLine !== undefined) {
    return ("Tyche: Encountered unknown failure.\n" + errorLine.message);
  }

  return dataLines as DataLine[];
}

export const schemaSampleInfo = z.object({
  outcome: z.union([z.literal("passed"), z.literal("failed"), z.literal("gave_up")]),
  item: z.string(),
  duplicate: z.boolean(),
  features: z.object({
    ordinal: z.record(z.number()),
    nominal: z.record(z.string()),
  }),
  coverage: z.record(z.array(z.number())),
  metadata: z.any(),
});

export const schemaTestInfo = z.object({
  status: z.union([z.literal("success"), z.literal("failure"), z.literal("warning")]),
  samples: z.array(schemaSampleInfo),
  info: z.array(z.object({ type: z.string(), title: z.string(), content: z.string() })),
});

export const schemaReport = z.object({
  timestamp: z.number(),
  properties: z.record(schemaTestInfo),
});

export type SampleInfo = z.infer<typeof schemaSampleInfo>;

export type TestInfo = z.infer<typeof schemaTestInfo>;

export type Report = z.infer<typeof schemaReport>;

export type ExampleFilter = {
  ordinal: string;
  value: number;
} | {
  nominal: string,
  value: string
};