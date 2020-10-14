export interface Field {
  path: string;
  type: string;
}

export class ProjectIndex {
  index: string;
  fields: Field[];

  static sortTextaFactsAsFirstItem(fields: ProjectIndex[]): ProjectIndex[] {
    fields = JSON.parse(JSON.stringify(fields)); // deep clone, dont want to change original
    return fields.map((field: ProjectIndex) => {
      field.fields.sort((x, y) => (x.type === 'fact' ? -1 : y.type === 'fact' ? 1 : 0));
      return field;
    });
  }

  static isProjectFields(val: unknown): val is ProjectIndex | ProjectIndex[] {
    if (Array.isArray(val) && val.length > 0) {
      return (
        (val[0] as ProjectIndex).index !== undefined &&
        (val[0] as ProjectIndex).fields !== undefined
      );
    } else {
      return (
        (val as ProjectIndex).index !== undefined &&
        (val as ProjectIndex).fields !== undefined
      );
    }
  }

  static cleanProjectIndicesFields(fields: ProjectIndex[], whiteList: string[], blackList: string[], whiteListAll?: boolean): ProjectIndex[] {
    fields = JSON.parse(JSON.stringify(fields)); // deep clone, dont want to change original
    const filteredField: ProjectIndex[] = [];
    const whiteListTypes = whiteList && whiteList.length > 0 ? whiteList : null;
    const blackListTypes = blackList && blackList.length > 0 ? blackList : null;
    for (const index of fields) {
      index.fields = index.fields.filter(element => {
          if (whiteListTypes && whiteListTypes.includes(element.type)) {
            return true;
          }
          if (blackListTypes && blackListTypes.includes(element.type)) {
            return false;
          }
          if (whiteListAll) {
            return true;
          }
        }
      );
      if (index.fields.length > 0) {
        filteredField.push(index);
      }
    }
    return filteredField;
  }
}
