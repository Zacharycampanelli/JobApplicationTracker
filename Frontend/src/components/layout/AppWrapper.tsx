// When the user is logged in

import { Outlet } from "react-router"
import Navbar from "../ui/Navbar"

const AppWrapper = () => {
  return (
    <div className="min-h-screen bg-slate-50 md:flex">
        <Navbar />
        <main className="flex-1 pb-24 md:pb-0">
            <div className="mx-auto w-full max-w-7xl px-4 py-6 md:px-6 lg:px-8">
                <Outlet />
            </div>
        </main>
    </div>
  )
}

export default AppWrapper