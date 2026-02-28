// ─────────────────────────────────────────────────────────────────────────────
// Field type discriminant — add new variants here when needed.
// ─────────────────────────────────────────────────────────────────────────────

export type FieldType =
  | "text-input"
  | "number-input"
  | "textarea"
  | "static-select"
  | "api-select";

// ─────────────────────────────────────────────────────────────────────────────
// Shared base — every field config has these.
// ─────────────────────────────────────────────────────────────────────────────

interface BaseFieldConfig {
  fieldName: string;
  label: string;
  required?: boolean;
  placeholder?: string;
  /** How many grid columns this field should span (default: 1). */
  colSpan?: 1 | 2 | 3 | 4;
}

// ─────────────────────────────────────────────────────────────────────────────
// Concrete variants
// ─────────────────────────────────────────────────────────────────────────────

export interface TextFieldConfig extends BaseFieldConfig {
  fieldType: "text-input";
}

export interface NumberFieldConfig extends BaseFieldConfig {
  fieldType: "number-input";
  min?: number;
  max?: number;
  step?: number;
}

export interface TextareaFieldConfig extends BaseFieldConfig {
  fieldType: "textarea";
  rows?: number;
}

export interface StaticSelectConfig extends BaseFieldConfig {
  fieldType: "static-select";
  options: Array<{ value: string; label: string }>;
}

export interface ApiSelectConfig extends BaseFieldConfig {
  fieldType: "api-select";
  apiFunctionName: string;
  /** Which custom component DynamicField should render for this field. */
  customComponent: "ItemTreeSelect" | "ItemGenericSelect" | "ItemCategorySelect";
    displayField?: "code" | "name";
}

// ─────────────────────────────────────────────────────────────────────────────
// Union — TypeScript discriminates on `fieldType`.
// ─────────────────────────────────────────────────────────────────────────────

export type FieldConfig =
  | TextFieldConfig
  | NumberFieldConfig
  | TextareaFieldConfig
  | StaticSelectConfig
  | ApiSelectConfig;