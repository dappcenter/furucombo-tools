import { Interface, defaultAbiCoder } from "@ethersproject/abi";
import { BigNumber } from "@ethersproject/bignumber";
import FurucomboABI from "./Furucombo.json";

const iface = new Interface(FurucomboABI);

export function parseData(data: string): string[] {
  const sig: string = data.slice(0, 10);
  const _data: string = data.slice(10);
  if (sig === "0x1cff79cd") {
    const result = iface.decodeFunctionData("execute", data);
    let _return: string[] = ["", sig];
    _return = [..._return, result["_target"] as string, ""];
    _return = [..._return, ...parseData(result["_data"] as string), ""];
    return _return;
  }
  if (sig === "0x38c5c08e") {
    const result = iface.decodeFunctionData("batchExec", data);
    let _return: string[] = ["", sig];
    _return = [..._return, ...(result.tos as string[]), ""];
    _return = [..._return, ...(result.configs as string[]), ""];
    (result.datas as string[]).forEach((data) => {
      if (data.startsWith("0x00000000")) {
        const _result = defaultAbiCoder.decode(["uint256", "bytes"], data);
        _return = [
          ..._return,
          `call value: ${_result[0].toHexString()}`,
          ...parseData(_result[1]),
        ];
      } else {
        _return = [..._return, ...parseData(data)];
      }
    });
    return _return;
  }
  if (sig === "0x28849140") {
    const result = iface.decodeFunctionData("injectAndBatchExec", data);
    let _return: string[] = ["", sig];

    _return = [..._return, ...(result.tokensIn as string[])];
    _return = [
      ..._return,
      ...(result.amountsIn as BigNumber[]).map((amount) =>
        amount.toHexString()
      ),
    ];
    _return = [..._return, ...(result.tokensOut as string[]), ""];
    _return = [..._return, ...(result.tos as string[]), ""];
    _return = [..._return, ...(result.configs as string[]), ""];
    (result.datas as string[]).forEach((data) => {
      _return.push(data.slice(0, 10));
      _return = [..._return, ...(data.slice(10).match(/.{64}/g) as string[])];
    });
    return _return;
  }
  return [sig, ...(_data.match(/.{64}/g) as string[])];
}
