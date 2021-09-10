import React, { useState, useCallback } from "react";
import { useForm, Controller } from "react-hook-form";
import {
  Button,
  ButtonBase,
  InputBase,
  makeStyles,
  Paper,
} from "@material-ui/core";
import TextField from "@material-ui/core/TextField";
import Card from "@material-ui/core/Card";
import SearchIcon from "@material-ui/icons/Search";
import FileCopyIcon from "@material-ui/icons/FileCopy";
import { Interface } from "@ethersproject/abi";
import copy from "copy-to-clipboard";

const useStyles = makeStyles((theme) => ({
  root: {
    color: "white",
    minWidth: 600,
    width: "100%",
    "& .MuiOutlinedInput-root": {
      "& fieldset": {
        borderColor: "white",
      },
      "&:hover fieldset": {
        borderColor: "white",
      },
      "&.Mui-focused fieldset": {
        borderColor: "#3f51b5",
      },
    },
    marginBottom: 15,
  },
  title: {
    color: "white",
    fontSize: "24px",
    marginBottom: 15,
  },
  cardRoot: {
    padding: "0 20px !important",
    marginBottom: 25,
  },
}));

interface DataFieldSet {
  abi: string;
  search: string;
}

export default function AbiSigGen(): JSX.Element {
  const classes = useStyles();

  const { register, control, handleSubmit, watch, setValue } =
    useForm<DataFieldSet>({
      defaultValues: { abi: "" },
    });

  const [funcSigs, setFuncSigs] = useState<string[]>([]);

  const onSubmit = (data: DataFieldSet) => {
    setValue("search", "");
    const iface = new Interface(data.abi);
    const funcs = Object.keys(iface.functions);
    let _funcSigs: string[] = [];
    funcs.forEach((func) =>
      _funcSigs.push(`${iface.getSighash(func)} : ${func}`)
    );
    setFuncSigs(_funcSigs);
  };

  const handleCopy = useCallback(() => {
    copy(JSON.stringify(funcSigs, null, 2));
  }, [funcSigs]);
  const search = watch("search");

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <div className={classes.title}>ABI Sig Generator</div>
        {funcSigs.length > 0 && (
          <Card className={classes.cardRoot}>
            <div className="d-flex" style={{ justifyContent: "space-between" }}>
              <InputBase
                placeholder="search"
                {...register("search")}
                startAdornment={<SearchIcon />}
                style={{ borderBottom: "1px solid black" }}
              />
              <ButtonBase onClick={handleCopy}>
                <FileCopyIcon />
              </ButtonBase>
            </div>
            <Paper style={{ maxHeight: "30vh", overflow: "auto" }}>
              {funcSigs.map((funcSig) => {
                if (search?.length > 0 && funcSig.includes(search)) {
                  return <p>{funcSig}</p>;
                } else if (!search) {
                  return <p>{funcSig}</p>;
                }
                return null;
              })}
            </Paper>
          </Card>
        )}
        <Controller
          control={control}
          name="abi"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextField
              className={classes.root}
              id="outlined-multiline-static"
              label="ABI"
              multiline
              rows={10}
              placeholder="input your ABI"
              InputLabelProps={{
                className: classes.root,
              }}
              InputProps={{
                className: classes.root,
              }}
              defaultValue="Default Value"
              variant="outlined"
              color="primary"
              onBlur={onBlur}
              onChange={onChange}
              value={value}
            />
          )}
        />
        <div>
          <Button
            type="submit"
            variant="outlined"
            color="primary"
            style={{ float: "right" }}
          >
            Generate
          </Button>
        </div>
      </div>
    </form>
  );
}
