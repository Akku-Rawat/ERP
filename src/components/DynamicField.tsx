import React from 'react';
import type { 
  FieldConfig, 
  StaticSelectConfig, 
  ApiFieldConfig 
} from '../types/fieldConfig.types';
import ItemCategorySelect from "../components/selects/ItemCategorySelect";
import ItemTreeSelect from '../components/selects/ItemTreeSelect';
import ItemGenericSelect from '../components/selects/ItemGenericSelect';
import { getApiFunction } from '../config/apiRegistry';
interface DynamicFieldProps {
  config: FieldConfig;
  value: any;
  onChange: (name: string, value: any) => void;
  onApiChange?: (data: any) => void; // For special components that need callbacks
}

export const DynamicField: React.FC<DynamicFieldProps> = ({
  config,
  value,
  onChange,
  onApiChange,
}) => {
  const colSpanClass = config.colSpan ? `col-span-${config.colSpan}` : 'col-span-1';

  // ========================================
  // TEXT INPUT
  // ========================================
  if (config.fieldType === 'text-input') {
    return (
      <label className={`flex flex-col gap-1 text-sm ${colSpanClass}`}>
        <span className="font-medium text-muted">
          {config.label}
          {config.required && <span className="text-red-500 ml-1">*</span>}
        </span>
        <input
          type="text"
          name={config.fieldName}
          value={value || ''}
          onChange={(e) => onChange(config.fieldName, e.target.value)}
          placeholder={config.placeholder}
          required={config.required}
          className="rounded border border-theme bg-card text-main px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
        />
      </label>
    );
  }

  // ========================================
  // TEXTAREA
  // ========================================
  if (config.fieldType === 'textarea') {
    return (
      <label className={`flex flex-col gap-1 text-sm ${colSpanClass}`}>
        <span className="font-medium text-muted">
          {config.label}
          {config.required && <span className="text-red-500 ml-1">*</span>}
        </span>
        <textarea
          name={config.fieldName}
          value={value || ''}
          onChange={(e) => onChange(config.fieldName, e.target.value)}
          placeholder={config.placeholder}
          required={config.required}
          rows={3}
          className="rounded border border-theme bg-card text-main px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
        />
      </label>
    );
  }

 // ========================================
  // STATIC SELECT
  // ========================================
  if (config.fieldType === 'static-select') {
    // TypeScript now knows this is StaticSelectConfig
    const selectConfig = config as StaticSelectConfig;
    
    return (
      <label className={`flex flex-col gap-1 text-sm ${colSpanClass}`}>
        <span className="font-medium text-muted">
          {selectConfig.label}
          {selectConfig.required && <span className="text-red-500 ml-1">*</span>}
        </span>
        <select
          name={selectConfig.fieldName}
          value={value || ''}
          onChange={(e) => onChange(selectConfig.fieldName, e.target.value)}
          required={selectConfig.required}
          className="rounded border border-theme bg-card text-main px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
        >
          {!selectConfig.required && <option value="">Select...</option>}
          {selectConfig.options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </label>
    );
  }
// ========================================
  // API SELECT
  // ========================================
  if (config.fieldType === 'api-select') {
    // TypeScript now knows this is ApiFieldConfig
    const apiConfig = config as ApiFieldConfig; // Type assertion for safety
    const { customComponent, apiFunctionName } = apiConfig;

    // ItemCategorySelect (special component)
    if (customComponent === 'ItemCategorySelect') {
      return (
        <div className={colSpanClass}>
          <ItemCategorySelect
            value={value}
            onChange={({ name, id }) => {
              onChange(apiConfig.fieldName, name);
              onApiChange?.({ name, id });
            }}
            className="w-full"
          />
        </div>
      );
    }

    // ItemTreeSelect
    if (customComponent === 'ItemTreeSelect') {
      const fetchFn = getApiFunction(apiFunctionName);
      if (!fetchFn) return null;

      return (
        <div className={colSpanClass}>
          <ItemTreeSelect
            label={apiConfig.label}
            value={value}
            fetchData={fetchFn}
            onChange={({ id }) => onChange(apiConfig.fieldName, id)}
          />
        </div>
      );
    }

    // ItemGenericSelect
    if (customComponent === 'ItemGenericSelect') {
      const fetchFn = getApiFunction(apiFunctionName);
      if (!fetchFn) return null;

      return (
        <div className={colSpanClass}>
          <ItemGenericSelect
            label={apiConfig.label}
            value={value}
            fetchData={fetchFn}
            onChange={({ id }) => onChange(apiConfig.fieldName, id)}
          />
        </div>
      );
    }

    // Fallback: shouldn't reach here
    return null;
  } }