export interface IamPolicyCondition {
  not: boolean;
  resource?: string;
  propertyKey: string;
  type: string;
  values: Array<unknown>;
}
