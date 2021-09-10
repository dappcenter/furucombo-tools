import React, { useState } from "react";
import TextFieldInput from "../../components/TextFieldInput";
import { getAddress } from "@ethersproject/address";

export default function FormatAddr(): JSX.Element {
  const [addr, setAddr] = useState("");
  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    try {
      let data = event.target.value;
      setAddr(data.toLowerCase());
      event.target.value = getAddress(data);
    } catch (error) {}
  };
  return (
    <div>
      <TextFieldInput
        placeholder="address"
        style={{ marginBottom: 30, width: 600 }}
        onChange={handleChange}
      />
      <div style={{ color: "white", fontSize: 20 }}>
        lower case address: {addr}
      </div>
    </div>
  );
}
