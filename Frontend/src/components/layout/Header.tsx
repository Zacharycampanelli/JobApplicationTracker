import Icon from "../../assets/svg/Icon";

const Header = () => {
  return (
     <div className="flex w-full justify-start items-center gap-2 mb-4 md:col-span-12">
        <Icon />
        <h1 className="text-title-lg ml-2">Architectural Ledger</h1>
      </div>
  )
}

export default Header