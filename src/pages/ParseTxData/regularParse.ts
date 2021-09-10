import { isHexString, parseHex2Num } from "../../helper/hex";
import { parseConfig } from "../ParseConfig";

// optimze the data slice for furucombo sig

const padForSig = Array(56).fill("0").join("");

function parseBatchExec(data: string): string[] {
  let _txData: string[] = [];
  const taskLen = parseHex2Num(data.slice(200, 264));

  const params = data.slice(8, 456 + 192 * taskLen).match(/.{64}/g);
  const configs = params?.slice(5 + taskLen, 8 + taskLen) as string[];

  _txData = [..._txData, ...(params as string[])];
  // 192 = 64 * 3
  let dataLenHex = data.slice(392 + 192 * taskLen, 456 + 192 * taskLen);
  let dataStart = 456 + 192 * taskLen;
  for (let i = 0; i < taskLen; i++) {
    const config = parseConfig(configs[i]);
    let d = data.slice(dataStart, dataStart + parseHex2Num(dataLenHex) * 2);
    let callValue: string[] = [];
    if (config?.isCall) {
      callValue = d.slice(0, 192).match(/.{64}/g) as string[];
      d = d.slice(192);
    }
    const _data = regularParse(d);

    const endWithLenAt = config?.isCall
      ? parseHex2Num(dataLenHex) * 2 + 64
      : parseHex2Num(dataLenHex) * 2 + 120;
    dataLenHex = data.slice(
      config?.isCall
        ? dataStart + parseHex2Num(dataLenHex) * 2
        : dataStart + parseHex2Num(dataLenHex) * 2 + 56, // pendding end
      dataStart + endWithLenAt // len end
    );

    _txData = [..._txData, ...callValue, ..._data, padForSig, dataLenHex];

    dataStart = dataStart + endWithLenAt;
  }
  return _txData;
}

function parseInjectAndBatchExec(data: string): string[] {
  let _txData: string[] = [];
  const tokensInLenNum = parseHex2Num(data.slice(8 + 64 * 6, 456));

  const _tokensOutLenStart = 8 + 64 * (8 + 2 * tokensInLenNum);
  const tokensOutLenNum = parseHex2Num(
    data.slice(_tokensOutLenStart, _tokensOutLenStart + 64)
  );

  const _tosLenStart = 8 + 64 * (9 + 2 * tokensInLenNum + tokensOutLenNum);
  const tosLenNum = parseHex2Num(data.slice(_tosLenStart, _tosLenStart + 64));
  const params = data
    .slice(
      8,
      64 * (13 + tokensInLenNum * 2 + tokensOutLenNum + tosLenNum * 3) + 8
    )
    .match(/.{64}/g);

  _txData = [..._txData, ...(params as string[])];

  const _dataLenHexStart =
    64 * (12 + tokensInLenNum * 2 + tokensOutLenNum + tosLenNum * 3) + 8;
  let dataLenHex = data.slice(_dataLenHexStart, _dataLenHexStart + 64);

  let dataStart = _dataLenHexStart + 64;

  for (let i = 0; i < tosLenNum; i++) {
    const _data = regularParse(
      data.slice(dataStart, dataStart + parseHex2Num(dataLenHex) * 2)
    );
    const endWithLenAt = parseHex2Num(dataLenHex) * 2 + 120;
    dataLenHex = data.slice(
      dataStart + parseHex2Num(dataLenHex) * 2 + 56, // pendding end
      dataStart + endWithLenAt // len end
    );

    _txData = [..._txData, ..._data, padForSig, dataLenHex];

    dataStart = dataStart + endWithLenAt;
  }
  return _txData;
}

function parseExecute(data: string): string[] {
  const params = data.slice(8, 200).match(/.{64}/g) as string[];
  const _data = regularParse(data.slice(200, -56));
  return [...params, ..._data];
}

export function regularParse(str: string): string[] {
  const data = str.replace(/^0x/, "");
  if (!isHexString(data)) console.log("is not hex string");
  const sig = data.slice(0, 8);
  let _data: string[] = [];
  if (sig === "1cff79cd") {
    // execute
    _data = parseExecute(data);
  } else if (sig === "38c5c08e") {
    // batchExec
    _data = parseBatchExec(data);
  } else if (sig === "28849140") {
    // injectAndBatchExec
    _data = parseInjectAndBatchExec(data);
  } else {
    // other
    _data = data.slice(8).match(/.{64}/g) as string[];
  }
  return [sig, ..._data];
}
