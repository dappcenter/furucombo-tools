import AbiSigGen from "./pages/AbiSigGen";
import ParseTxData from "./pages/ParseTxData";
import ParseConfig from "./pages/ParseConfig";
import FormatAddr from "./pages/FormatAddr";
import ToLower from "./pages/ToLower";

export const routeConfigs = [
  { name: "ParseTxData", path: "/parse_tx_data", component: ParseTxData },
  { name: "FuncSig", path: "/func_sig", component: AbiSigGen },
  { name: "ParseConfig", path: "/parse_config", component: ParseConfig },
  { name: "FormatAddress", path: "/format_address", component: FormatAddr },
  { name: "ToLowerCase", path: "/to_lower", component: ToLower },
];
