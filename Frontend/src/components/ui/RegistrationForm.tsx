import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import Input from "./Input"

import Person from "../../assets/images/person.svg?react";
import Email from "../../assets/images/email.svg?react";

const RegistrationForm = () => {
  return (
    <form className="flex flex-col gap-4">
      <Input
        label="FULL NAME"
        placeholder="Joe Smith"
        endIcon={<Person />}
      />
      <Input
        label="EMAIL ADDRESS"
        type="email"
        placeholder="joe@ledger.io"
        endIcon={<Email />}
      />
      <Input
        label="PASSWORD"
        type="password"
        placeholder="••••••••"
      />
      <Input
        label="CONFIRM"
        type="password"
        placeholder="••••••••"
      />
    </form>
  )
}

export default RegistrationForm