import { useState, HTMLInputTypeAttribute, HTMLProps, forwardRef } from "react";

import clsx from "clsx";
import {
  TailwindSize,
  sizeToFontSizeClassName,
  sizeToPaddingClassName,
} from "@/lib/tailwind";
import { Error, ErrorProps } from "../Error";
import { Label, LabelProps } from "../Label";

export interface InputProps
  extends Omit<HTMLProps<HTMLInputElement>, "size">,
    ErrorProps,
    LabelProps {
  htmlType?: HTMLInputTypeAttribute;
  size?: TailwindSize;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      size = "md",
      htmlType,
      className,
      maxLength,
      error,
      label,
      help,
      ...inputProps
    },
    ref
  ) => {
    const [currentLength, setCurrentLength] = useState(0);
    const paddingClassName = sizeToPaddingClassName[size];
    const fontSizeClassName = sizeToFontSizeClassName[size];

    const inputClassName = clsx(
      "focus:outline-none w-full placeholder-dark-accent bg-transparent",
      paddingClassName,
      className
    );

    const containerClassName = clsx(
      "flex items-center rounded-md overflow-hidden text-light transition-colors border",
      "bg-dark-light border-dark-accent focus-within:border-lightPurple-400",
      fontSizeClassName
    );

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setCurrentLength(e.target.value.length);
      if (inputProps.onChange) inputProps.onChange(e);
    };

    return (
      <div className={className}>
        {label && <Label label={label} help={help} />}

        <div className={clsx("w-full", inputProps.disabled && "opacity-50")}>
          <div className="relative">
            <div className={containerClassName}>
              <input
                {...inputProps}
                ref={ref}
                maxLength={maxLength}
                type={htmlType}
                className={inputClassName}
                style={{ WebkitAppearance: "none" }}
                onChange={handleInputChange}
              />
              {maxLength && (
                <div className="text-dark-accent absolute bottom-1 right-2 text-xs">
                  {`${currentLength}/${maxLength}`}
                </div>
              )}
            </div>
          </div>
        </div>
        <Error error={error} className="mt-0.5" />
      </div>
    );
  }
);

Input.displayName = "Input";


export { Input };
