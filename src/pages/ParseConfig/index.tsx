import React, { useState } from "react";
import TextFieldInput from "../../components/TextFieldInput";
import { isHexString, parseHex2Num } from "../../helper/hex";
import remove from "lodash/remove";

type Config = {
  isDymanicInput: boolean;
  isCall: boolean;
  referenceCount: number;
  params: [number, number][];
};

type k = keyof Config;

const defaultConfig: Config = {
  isDymanicInput: false,
  isCall: false,
  referenceCount: 0,
  params: [],
};

const configTypes: Omit<k[], "referenceCount" | "params"> = [
  "isDymanicInput",
  "isCall",
];

export function parseConfig(data: string): Config | undefined {
  let config = data;
  config = config.replace(/^0x/, "");
  const isValidConfig = isHexString(config) && config.length === 64;
  if (!isValidConfig) {
    return undefined;
  }
  const configType = config.slice(0, 2);
  const returnCount = config.slice(2, 4);
  const params = config.slice(4, 20);
  const stack = config.slice(20, 65);
  let _config: Config = { ...defaultConfig };

  const numConfigType = parseHex2Num(configType);
  for (let i = 0; i < configTypes.length; i++) {
    if ((numConfigType >> i) & 1) {
      (_config[configTypes[i]] as boolean) = true;
    }
  }
  _config.referenceCount = parseHex2Num(returnCount);
  let numParam = parseHex2Num(params);
  const stackArray = remove(
    stack.match(/.{2}/g)?.reverse() as string[],
    (s) => s !== "ff"
  );
  let stackCount = 0;
  _config.params = [];
  for (let i = 0; ; i++) {
    if ((numParam >> i) & 1) {
      _config.params.push([i + 1, parseHex2Num(stackArray[stackCount])]);
      stackCount++;
    }
    if (!(numParam >> i)) break;
  }
  return _config;
}

export default function ParseConfig(): JSX.Element {
  const [config, setConfig] = useState<Config>();

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const _config = parseConfig(event.target.value);
    setConfig(_config);
  };
  return (
    <div>
      <TextFieldInput
        placeholder="config"
        style={{ marginBottom: 30, width: 600 }}
        onChange={handleChange}
      />
      {config && (
        <div style={{ color: "white", fontSize: 20 }}>
          Dymanic input: {config.isDymanicInput.toString()}
          <br />
          DelegateCall/ Call: {config.isCall ? "Call" : "DelegateCall"}
          <br />
          Reference Count: {config.referenceCount}
          <br />
          Reference Config:
          <br />
          <div style={{ paddingLeft: 30 }}>
            {config.params.map(([ref, stack]) => (
              <>
                {`params[${ref}] <- local stack[${stack}]`}
                <br />
              </>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
