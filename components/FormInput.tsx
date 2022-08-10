import { InputHTMLAttributes } from "react";

interface FormInputProps extends InputHTMLAttributes<HTMLInputElement> {
    label: string;
    placeholder?: string;
    required?: boolean;
    setState: (state: any) => void;
    state: any;
    id: string;
    type?: string;
    options?: SelectOption[];
}

interface SelectOption {
    value: string;
    label: string;
    disabled?: boolean;
}

export default function FormInput({
    label,
    placeholder,
    id,
    type = "text",
    state,
    setState,
    required = false,
    options,
    disabled,
}: FormInputProps) {
    if (type === "select") {
        return (
            <>
                <label htmlFor={id}>{label}</label>
                <select
                    id={id}
                    value={state}
                    placeholder={placeholder}
                    onChange={(e) => setState(e.target.value)}
                    required={required}
                    className="dark:bg-zinc-700 bg-zinc-300 rounded-sm"
                    disabled={disabled}
                >
                    {options?.map((option) => (
                        <>
                            <option
                                disabled={option.disabled ?? false}
                                value={option.value}
                            >
                                {option.label}
                            </option>
                        </>
                    ))}
                </select>
            </>
        );
    }

    return (
        <>
            <label htmlFor={id}>{label}</label>
            <input
                id={id}
                placeholder={placeholder}
                type={type}
                value={state}
                required={required}
                className="dark:bg-zinc-700 bg-zinc-300 rounded-sm"
                onChange={(e) => {
                    setState(e.target.value);
                }}
                disabled={disabled}
            />
        </>
    );
}
