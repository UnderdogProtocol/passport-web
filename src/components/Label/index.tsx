import { HiOutlineQuestionMarkCircle } from "react-icons/hi2";

import { Tooltip } from "../Tooltip";

export type LabelProps = {
  label?: string;
  help?: string;
  htmlFor?: string;
};

export function Label({ label, htmlFor, help }: LabelProps) {
  if (!label && !help) return null;

  return (
    <div className="mb-0.5 flex items-center space-x-1 text-light">
      {label && (
        <label className="text-sm" htmlFor={htmlFor}>
          {label}
        </label>
      )}

      {help && (
        <Tooltip text={help} position="right">
          <HiOutlineQuestionMarkCircle />
        </Tooltip>
      )}
    </div>
  );
}
