import * as z from "zod";

export const schemaSampleInfo = z.object({
  item: z.string(),
  features: z.record(z.number()),
  bucketings: z.record(z.string()),
});

export const schemaCoverageItem = z.object({
  hitLines: z.array(z.number()),
  missedLines: z.array(z.number()),
});

export const schemaSuccessTestInfo = z.object({
  type: z.literal("success").optional(),
  samples: z.array(schemaSampleInfo),
  coverage: z.record(schemaCoverageItem),
});

export const schemaFailureTestInfo = z.object({
  type: z.literal("failure"),
  counterExample: schemaSampleInfo,
  message: z.string(),
});

export const schemaTestInfo = z.union([schemaSuccessTestInfo, schemaFailureTestInfo]);

export const schemaSuccessReport = z.object({
  type: z.literal("success").optional(),
  clear: z.boolean().optional(),
  report: z.record(schemaTestInfo),
});

export const schemaFailureReport = z.object({
  type: z.literal("failure"),
  message: z.string(),
});

export const schemaReport = z.union([schemaSuccessReport, schemaFailureReport]);

export type SampleInfo = z.infer<typeof schemaSampleInfo>;

export type CoverageItem = z.infer<typeof schemaCoverageItem>;

export type SuccessTestInfo = z.infer<typeof schemaSuccessTestInfo>;

export type FailureTestInfo = z.infer<typeof schemaFailureTestInfo>;

export type TestInfo = z.infer<typeof schemaTestInfo>;


export type SuccessReport = z.infer<typeof schemaSuccessReport>;

export type FailureReport = z.infer<typeof schemaFailureReport>;

export type Report = z.infer<typeof schemaReport>;

export type ExampleFilter = {
  feature: string;
  value: number;
} | {
  bucketing: string,
  value: string
};

export const mergeCoverage = (oldCoverage: { [key: string]: CoverageItem }, newCoverage: { [key: string]: CoverageItem }): { [key: string]: CoverageItem } => {
  const result: { [key: string]: CoverageItem } = oldCoverage;
  Object.keys(newCoverage).forEach((key) => {
    if (key in result) {
      result[key].hitLines = Array.from(new Set([...result[key].hitLines, ...newCoverage[key].hitLines]));
      result[key].missedLines = result[key].missedLines.filter((l) => l in newCoverage[key].missedLines);
    } else {
      result[key] = newCoverage[key];
    }
  });
  return result;
};

export const mergeReports = (oldReport: Report | undefined, newReport: SuccessReport): SuccessReport => {
  if (!oldReport || oldReport.type === "failure" || newReport.clear) {
    return newReport;
  } else {
    return {
      clear: false,
      report: {
        ...oldReport.report,
        ...newReport.report,
      },
    };
  }
};