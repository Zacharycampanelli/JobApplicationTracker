import Icon from "../../assets/svg/Icon";
import { twMerge } from "tailwind-merge";

type HeaderProps = {
  inverted? : boolean
}

const Header = ({ inverted = false }: HeaderProps) => {
  const textColor = inverted ? "text-white" : "text-on-surface";
  return (
     <div className={twMerge("flex w-full justify-start items-center gap-2 mb-4 md:col-span-12", textColor)}>
        <Icon fill={inverted ? "#f8f9fb" : undefined} />
        <h1 className="text-brand ml-2">Architectural Ledger</h1>
      </div>
  )
}

export default Header
