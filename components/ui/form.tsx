"use client";

import React, { createContext, useContext, useState, useId } from "react";
import { AlertCircle, Check } from "lucide-react";

// Define interfaces for form elements
interface FormInputProps {
  id?: string;
  name?: string;
  className?: string;
  'aria-invalid'?: string;
  'aria-describedby'?: string;
}

// Form context
interface FormContextType {
  errors: Record<string, string>;
  touched: Record<string, boolean>;
  setFieldTouched: (name: string) => void;
  setFieldError: (name: string, error: string | null) => void;
  isSubmitting: boolean;
  setIsSubmitting: (isSubmitting: boolean) => void;
}

const FormContext = createContext<FormContextType | undefined>(undefined);

export interface FormProps extends React.FormHTMLAttributes<HTMLFormElement> {
  onSubmit?: (e: React.FormEvent<HTMLFormElement>) => void;
  children: React.ReactNode;
  className?: string;
}

export function Form({ onSubmit, children, className = "", ...props }: FormProps) {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const setFieldTouched = (name: string) => {
    setTouched((prev) => ({ ...prev, [name]: true }));
  };

  const setFieldError = (name: string, error: string | null) => {
    setErrors((prev) => {
      if (error === null) {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      }
      return { ...prev, [name]: error };
    });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Mark all fields as touched
    const allFieldsTouched: Record<string, boolean> = {};
    React.Children.forEach(children, (child) => {
      if (React.isValidElement(child)) {
        // Type assertion to access props safely
        const childProps = child.props as Record<string, any>;
        if (childProps.name) {
          allFieldsTouched[childProps.name] = true;
        }
      }
    });
    setTouched(allFieldsTouched);
    
    // If there are no errors, call onSubmit
    if (Object.keys(errors).length === 0 && onSubmit) {
      setIsSubmitting(true);
      onSubmit(e);
    }
  };

  return (
    <FormContext.Provider
      value={{
        errors,
        touched,
        setFieldTouched,
        setFieldError,
        isSubmitting,
        setIsSubmitting,
      }}
    >
      <form onSubmit={handleSubmit} className={className} {...props}>
        {children}
      </form>
    </FormContext.Provider>
  );
}

// Hook to access form context
export function useForm() {
  const context = useContext(FormContext);
  if (!context) {
    throw new Error("useForm must be used within a Form component");
  }
  return context;
}

// Form Field
export interface FormFieldProps {
  name: string;
  label?: string;
  required?: boolean;
  children: React.ReactElement | React.ReactElement[];
  description?: string;
  className?: string;
}

export function FormField({
  name,
  label,
  required = false,
  children,
  description,
  className = "",
}: FormFieldProps) {
  const { errors, touched } = useForm();
  const id = useId();
  const hasError = touched[name] && errors[name];
  
  return (
    <div className={`mb-4 ${className}`}>
      {label && (
        <label
          htmlFor={id}
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
        >
          {label}
          {required && <span className="text-error ml-1">*</span>}
        </label>
      )}
      
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          // Type assertion to access props safely
          const childProps = child.props as Record<string, any>;
          
          // Create props with proper typing
          const newProps: FormInputProps = {
            id,
            name,
            "aria-invalid": hasError ? "true" : "false",
            "aria-describedby": hasError ? `${id}-error` : description ? `${id}-description` : undefined,
            className: `${childProps.className || ""} ${
              hasError
                ? "border-error focus:border-error focus:ring-error"
                : "border-gray-300 dark:border-gray-600 focus:border-primary-500 focus:ring-primary-500"
            }`,
          };
          
          return React.cloneElement(child, newProps);
        }
        return child;
      })}
      
      {description && !hasError && (
        <p id={`${id}-description`} className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          {description}
        </p>
      )}
      
      {hasError && (
        <div id={`${id}-error`} className="mt-1 flex items-center text-error text-sm">
          <AlertCircle className="h-4 w-4 mr-1" />
          <span>{errors[name]}</span>
        </div>
      )}
    </div>
  );
}

// Input component
export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
}

export function Input({
  icon,
  iconPosition = "left",
  className = "",
  ...props
}: InputProps) {
  const baseClasses = "block w-full rounded-md shadow-sm focus:ring-2 focus:ring-opacity-50 dark:bg-gray-700 dark:text-white";
  const paddingClasses = icon
    ? iconPosition === "left"
      ? "pl-10 pr-3"
      : "pl-3 pr-10"
    : "px-3";
  
  return (
    <div className="relative">
      {icon && (
        <div
          className={`absolute inset-y-0 ${
            iconPosition === "left" ? "left-0" : "right-0"
          } flex items-center ${
            iconPosition === "left" ? "pl-3" : "pr-3"
          } pointer-events-none text-gray-500 dark:text-gray-400`}
        >
          {icon}
        </div>
      )}
      <input
        className={`${baseClasses} ${paddingClasses} ${className}`}
        {...props}
      />
    </div>
  );
}

// Textarea component
export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

export function Textarea({ className = "", ...props }: TextareaProps) {
  return (
    <textarea
      className={`block w-full rounded-md shadow-sm focus:ring-2 focus:ring-opacity-50 border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:border-primary-500 focus:ring-primary-500 ${className}`}
      {...props}
    />
  );
}

// Select component
export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  options: Array<{ value: string; label: string }>;
  placeholder?: string;
}

export function Select({
  options,
  placeholder,
  className = "",
  ...props
}: SelectProps) {
  return (
    <select
      className={`block w-full rounded-md shadow-sm focus:ring-2 focus:ring-opacity-50 border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:border-primary-500 focus:ring-primary-500 ${className}`}
      {...props}
    >
      {placeholder && (
        <option value="" disabled>
          {placeholder}
        </option>
      )}
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}

// Checkbox component
export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: string;
}

export function Checkbox({ label, className = "", ...props }: CheckboxProps) {
  const id = useId();
  
  return (
    <div className="flex items-center">
      <input
        id={id}
        type="checkbox"
        className={`h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 ${className}`}
        {...props}
      />
      {label && (
        <label
          htmlFor={id}
          className="ml-2 block text-sm text-gray-700 dark:text-gray-300"
        >
          {label}
        </label>
      )}
    </div>
  );
}

// Radio component
export interface RadioProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: string;
}

export function Radio({ label, className = "", ...props }: RadioProps) {
  const id = useId();
  
  return (
    <div className="flex items-center">
      <input
        id={id}
        type="radio"
        className={`h-4 w-4 border-gray-300 text-primary-600 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 ${className}`}
        {...props}
      />
      {label && (
        <label
          htmlFor={id}
          className="ml-2 block text-sm text-gray-700 dark:text-gray-300"
        >
          {label}
        </label>
      )}
    </div>
  );
}

// Switch component
export interface SwitchProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: string;
  description?: string;
}

export function Switch({ label, description, className = "", ...props }: SwitchProps) {
  const id = useId();
  
  return (
    <div className="flex items-start">
      <div className="flex items-center h-5">
        <input
          id={id}
          type="checkbox"
          className="sr-only"
          {...props}
        />
        <div
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600 ${
            props.checked
              ? "bg-primary-600"
              : "bg-gray-200 dark:bg-gray-700"
          }`}
        >
          <span
            className={`${
              props.checked ? "translate-x-6" : "translate-x-1"
            } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
          />
        </div>
      </div>
      {(label || description) && (
        <div className="ml-3">
          {label && (
            <label
              htmlFor={id}
              className="text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              {label}
            </label>
          )}
          {description && (
            <p className="text-sm text-gray-500 dark:text-gray-400">{description}</p>
          )}
        </div>
      )}
    </div>
  );
}

// Form actions
export function FormActions({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`flex items-center justify-end space-x-2 mt-6 ${className}`}>
      {children}
    </div>
  );
}

// Form divider
export function FormDivider({
  label,
  className = "",
}: {
  label?: string;
  className?: string;
}) {
  return (
    <div className={`relative my-6 ${className}`}>
      <div className="absolute inset-0 flex items-center">
        <div className="w-full border-t border-gray-300 dark:border-gray-600" />
      </div>
      {label && (
        <div className="relative flex justify-center">
          <span className="bg-white dark:bg-gray-800 px-2 text-sm text-gray-500 dark:text-gray-400">
            {label}
          </span>
        </div>
      )}
    </div>
  );
}
