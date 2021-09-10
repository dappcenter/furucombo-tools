import React from "react";
import TextFieldInput from "../../components/TextFieldInput";

export default function ToLower(): JSX.Element {
  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    try {
      let data = event.target.value;
      event.target.value = data.toLowerCase();
    } catch (error) {}
  };
  return (
    <div>
      <TextFieldInput
        placeholder="input"
        style={{ marginBottom: 30, width: 600 }}
        onChange={handleChange}
      />
    </div>
  );
}
