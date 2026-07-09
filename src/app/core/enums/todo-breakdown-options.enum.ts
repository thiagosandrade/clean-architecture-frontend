export enum BreakdownComplexity {
  Simple = 0,
  Standard = 1,
  Detailed = 2
}


export enum BreakdownStrategy {
  Sequential = 0,
  Category = 1,
  Deliverables = 2,
  Checklist = 3
}


export interface TodoBreakdownOptions {
  complexity: BreakdownComplexity;
  strategy: BreakdownStrategy;
}
