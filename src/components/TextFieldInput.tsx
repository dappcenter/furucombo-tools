import React, { forwardRef, useMemo } from "react";

// components
import { makeStyles } from "@material-ui/core/styles";
import TextField, { TextFieldProps } from "@material-ui/core/TextField";

// libs
import clsx from "clsx";

export type TextFieldInputProps = TextFieldProps & {
  selectAll?: boolean;
  textAlign?: "left" | "right";
  disableUnderline?: boolean;
  readOnly?: boolean;
  warning?: boolean;
};

const useInputStyles = makeStyles((theme) => ({
  root: {
    color: "white",
    fontSize: "1.375rem",
    "&:hover": {
      "&$underline:before": {
        borderBottom: `1px solid white`,
      },
    },
  },
  underline: {
    "&:before": {
      borderBottom: `1px solid white`,
    },
    "&:after": {
      borderBottom: "1px solid white",
    },
  },
  disabled: {
    color: "white",
  },
  inputMarginDense: {
    fontSize: "1rem",
  },
}));

const useStyles = makeStyles((theme) => ({
  warning: {
    "& .MuiInput-root": {
      color: "white",
    },
  },
  textAlignRight: {
    "& .MuiInputBase-input, & .MuiFormHelperText-root": {
      textAlign: "right",
    },
  },
}));

function TextFieldInput(
  {
    className,
    selectAll,
    size,
    textAlign,
    disableUnderline,
    readOnly,
    warning,
    InputProps: InputPropsProp = {},
    ...otherProps
  }: TextFieldInputProps,
  ref: React.ForwardedRef<unknown>
): JSX.Element {
  const classesInput = useInputStyles();
  const classes = useStyles();

  const InputProps = useMemo(
    () => ({
      ...InputPropsProp,
      classes: classesInput,
      disableUnderline,
      readOnly,
    }),
    [InputPropsProp, classesInput, disableUnderline, readOnly]
  );

  return (
    <TextField
      className={clsx(className, {
        [classes.warning]: warning,
        [classes.textAlignRight]: textAlign === "right",
      })}
      inputRef={ref}
      InputProps={InputProps}
      fullWidth
      margin={size === "small" ? "dense" : undefined}
      {...otherProps}
    />
  );
}

export default forwardRef(TextFieldInput);
