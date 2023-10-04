import clsx from "clsx";
import { ErrorOption } from "react-hook-form";

export type ErrorProps = {
  error?: ErrorOption;
  className?: string;
};

const errorToMessage = (error: ErrorOption) => {
  switch (error.type) {
    case "required":
      return "This field is required";

    default:
      return "Something went wrong";
  }
};

export const Error: React.FC<ErrorProps> = ({ error, className }) => {
  return error ? (
    <p className={clsx("text-sm text-rubin-400", className)}>
      {error.message || errorToMessage(error)}
    </p>
  ) : undefined;
};
