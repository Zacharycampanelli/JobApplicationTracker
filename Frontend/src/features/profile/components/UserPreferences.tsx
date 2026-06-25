import { useState } from 'react'

const UserPreferences = () => {
    const [publicProfileEnabled, setPublicProfileEnabled] = useState(false)
    const [automaticStatusUpdates, setAutomaticStatusUpdates] = useState(false)
    const [darkMode, setDarkMode] = useState(false)
    const [passwordAndMFAEnabled, setPasswordAndMFAEnabled] = useState(false)
    const [deactivateAccountEnabled, setDeactivateAccountEnabled] = useState(false)
    
    const preferenceOptions = [
        { preference: "Public profile", icon: "", mode: "switch", isDangerous: false, description: "", children: <Toggle id="publicProfile" checked={publicProfileEnabled} onChange={setPublicProfileEnabled} />}
    ]
  return (
    <div className='flex flex-col gap-4'>

    </div>
  )
}

export default UserPreferences