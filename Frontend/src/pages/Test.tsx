import React, { useState } from "react";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import Select from "../components/ui/Select";
import Textarea from "../components/ui/Textarea";
import Toggle from "../components/ui/Toggle";

const Test = () => {
  const [toggle, setToggle] = useState(true);
  return (
    <div className="m-10">
      <div>
        <Button variant="primary">1</Button>
      </div>
      <div>
        <Button variant="secondary">2</Button>
      </div>
      <div>
        <Button variant="ghost">3</Button>
      </div>
      <div>
        <Button variant="danger">4</Button>
      </div>
      <Input placeholder="testing" type="password" />
      <Select options={[{ label: "1", value: "1" }]} placeholder="Select one" />
      <Textarea label="hi" />
      <Toggle
        checked={toggle}
        onChange={() => {
          setToggle(!toggle);
        }}
        label="1"
        secondLabel="2"
      />
    </div>
  );
};

export default Test;
