import React, { useState, useCallback } from "react";
import Card from "@material-ui/core/Card";
import Paper from "@material-ui/core/Paper";
import FileCopyIcon from "@material-ui/icons/FileCopy";
import ButtonBase from "@material-ui/core/ButtonBase";
import TextFieldInput from "../../components/TextFieldInput";
import copy from "copy-to-clipboard";
import { regularParse } from "./regularParse";
import { parseData } from "./abiParse";
import { makeStyles, Tab, Tabs } from "@material-ui/core";

const useStyles = makeStyles(() => ({
  tab: {
    color: "white",
  },
}));

const tabs = ["ABI", "Original"];

export default function ParseTxData(): JSX.Element {
  const [decodeResult, setDecodeResult] = useState<string[]>([]);
  const [txData, setTxData] = useState("");
  const [tab, setTab] = useState("ABI");

  const handleCopy = useCallback(() => {
    copy(decodeResult.join("\n"));
  }, [decodeResult]);

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ): void => {
    const _txData = event.target.value;
    try {
      let _data: string[] = [];
      if (tab === "ABI") {
        _data = [...parseData(_txData)];
      } else {
        _data = [...regularParse(_txData)];
      }
      setTxData(_txData);
      setDecodeResult(_data);
    } catch (error) {
      console.log(error);
      setDecodeResult([]);
    }
  };

  const hanldeTabChange = useCallback(
    (_: any, value: string) => {
      let _data: string[] = [];
      try {
        if (value === "ABI") {
          _data = [...parseData(txData)];
        } else {
          _data = [...regularParse(txData)];
        }
      } catch (error) {}
      setTab(value);
      setDecodeResult(_data);
    },
    [txData]
  );

  const classes = useStyles();

  return (
    <div>
      <TextFieldInput
        placeholder="txData"
        style={{ marginBottom: 15, width: 600 }}
        onChange={handleChange}
      />
      <Tabs value={tab} onChange={hanldeTabChange} textColor="primary">
        {tabs.map((tab) => (
          <Tab
            value={tab}
            label={tab}
            classes={{
              root: classes.tab,
            }}
          />
        ))}
      </Tabs>
      <Card style={{ marginTop: 15, maxWidth: 600 }}>
        {decodeResult.length > 0 && (
          <>
            <div
              className="d-flex"
              style={{ justifyContent: "end", padding: "5px 15px 0px 15px" }}
            >
              <ButtonBase onClick={handleCopy}>
                <FileCopyIcon />
              </ButtonBase>
            </div>
            <Paper
              style={{
                maxHeight: "60vh",
                overflow: "auto",
                padding: "0px 25px",
              }}
            >
              <p>
                {decodeResult.map((data) => (
                  <>
                    {data}
                    <br />
                  </>
                ))}
              </p>
            </Paper>
          </>
        )}
      </Card>
    </div>
  );
}
