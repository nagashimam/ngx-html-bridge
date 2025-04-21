type PropertyName = string;
type PropertyInitialValue = string;
export type Properties = Map<PropertyName, PropertyInitialValue>;

// It's possible for one attribute name to have multiple possible values, since you can use ternary operator in attribute binding in Angular
// For example, `<p [attr.data-example]="flag ? 'one' : anotherFlag ? 'two' : 'three'"></p>`
export type Attr = { name: string; values: string[] };
export type ParsedAttr = { name: string; value: string };
