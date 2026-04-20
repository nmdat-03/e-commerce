import {
  Controller,
  Control,
  FieldValues,
  Path,
  UseFormRegister,
} from "react-hook-form";
import Select from "react-select";

type Option = {
  label: string;
  value: string;
};

type FieldError = {
  message?: string;
};

type BaseProps<T extends FieldValues> = {
  label?: string;
  name: Path<T>;
  error?: FieldError;
  className?: string;
  disabled?: boolean;
};

function Wrapper({
  label,
  error,
  className,
  children,
}: {
  label?: string;
  error?: FieldError;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-medium mb-1">
          {label}
        </label>
      )}

      {children}

      {error?.message && (
        <p className="text-sm text-red-500 mt-1">
          {error.message}
        </p>
      )}
    </div>
  );
}

const fieldClass = (error?: FieldError) =>
  `w-full border rounded-lg px-3 py-2 outline-none transition ${error
    ? "border-red-500"
    : "border-gray-300 focus:border-black"
  }`;

/* ================= INPUT ================= */

export function InputField<T extends FieldValues>({
  label,
  name,
  register,
  error,
  className,
  type = "text",
  disabled,
}: BaseProps<T> & {
  register: UseFormRegister<T>;
  type?: React.HTMLInputTypeAttribute;
}) {
  return (
    <Wrapper
      label={label}
      error={error}
      className={className}
    >
      <input
        type={type}
        {...register(name)}
        disabled={disabled}
        className={fieldClass(error)}
      />
    </Wrapper>
  );
}

/* ================= TEXTAREA ================= */

export function TextareaField<T extends FieldValues>({
  label,
  name,
  register,
  error,
  className,
  disabled,
  rows = 5,
  placeholder,
}: BaseProps<T> & {
  register: UseFormRegister<T>;
  rows?: number;
  placeholder?: string;
}) {
  return (
    <Wrapper
      label={label}
      error={error}
      className={className}
    >
      <textarea
        rows={rows}
        {...register(name)}
        disabled={disabled}
        placeholder={placeholder}
        className={`${fieldClass(
          error
        )} resize-none`}
      />
    </Wrapper>
  );
}

/* ================= SELECT ================= */

export function SelectField<T extends FieldValues>({
  label,
  name,
  register,
  options,
  error,
  className,
  disabled,
}: BaseProps<T> & {
  register: UseFormRegister<T>;
  options: Option[];
}) {
  return (
    <Wrapper
      label={label}
      error={error}
      className={className}
    >
      <select
        {...register(name)}
        disabled={disabled}
        className={fieldClass(error)}
      >
        {options.map((item) => (
          <option
            key={item.value}
            value={item.value}
          >
            {item.label}
          </option>
        ))}
      </select>
    </Wrapper>
  );
}

/* ========== SEARCHABLE SELECT ========== */

export function SearchableSelectField<
  T extends FieldValues
>({
  label,
  name,
  control,
  options,
  error,
  className,
}: BaseProps<T> & {
  control: Control<T>;
  options: Option[];
}) {
  return (
    <Wrapper
      label={label}
      error={error}
      className={className}
    >
      <Controller
        control={control}
        name={name}
        render={({ field }) => (
          <Select
            options={options}
            value={options.find(
              (item) =>
                item.value === field.value
            )}
            onChange={(val) =>
              field.onChange(val?.value)
            }
            classNamePrefix="react-select"
          />
        )}
      />
    </Wrapper>
  );
}