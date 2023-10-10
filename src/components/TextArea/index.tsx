import { useState, HTMLProps, forwardRef } from "react";

import clsx from "clsx";
import {
  TailwindSize,
  sizeToFontSizeClassName,
  sizeToPaddingClassName,
} from "@/lib/tailwind";
import { ErrorOption } from "react-hook-form";
import { Error, ErrorProps } from "../Error";
import { Label, LabelProps } from "../Label";

export interface TextAreaProps
  extends Omit<HTMLProps<HTMLTextAreaElement>, "size">,
    ErrorProps,
    LabelProps {
  size?: TailwindSize;
  error?: ErrorOption;
}

const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  (
    { size = "md", error, className, maxLength, label, help, ...textAreaProps },
    ref
  ) => {
    const [currentLength, setCurrentLength] = useState(0);
    const paddingClassName = sizeToPaddingClassName[size];
    const fontSizeClassName = sizeToFontSizeClassName[size];

    const textAreaClassName = clsx(
      "focus:outline-none w-full placeholder-dark-accent bg-transparent",
      paddingClassName,
      className
    );

    const containerClassName = clsx(
      "flex items-center rounded-md overflow-hidden text-dark dark:text-light transition-colors border",
      "bg-dark-light border-dark-accent focus-within:border-lightPurple-400",
      fontSizeClassName
    );

    const handleTextAreaChange = (
      e: React.ChangeEvent<HTMLTextAreaElement>
    ) => {
      setCurrentLength(e.target.value.length);
      if (textAreaProps.onChange) textAreaProps.onChange(e);
    };

    return (
      <div className={className}>
        {label && <Label label={label} help={help} />}
        <div className={clsx("w-full", textAreaProps.disabled && "opacity-50")}>
          <div className="relative">
            <div className={containerClassName}>
              <textarea
                {...textAreaProps}
                ref={ref} // Passing the ref to the textarea element
                maxLength={maxLength}
                className={textAreaClassName}
                style={{ WebkitAppearance: "none" }}
                onChange={handleTextAreaChange}
              />
              {maxLength && (
                <div className="text-dark-accent absolute bottom-1 right-2 text-xs">
                  {`${currentLength}/${maxLength}`}
                </div>
              )}
            </div>
          </div>
        </div>
        <Error error={error} className="mt-2" />
      </div>
    );
  }
);

TextArea.displayName = "TextArea"; // Add this line

export { TextArea };