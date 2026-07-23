import { useState, useEffect } from 'react'

const DynamicImage = ({imageName}: {imageName: string}) => {
    const [imageSrc, setImageSrc] = useState<string | null>(null)
    
    useEffect(() => {
        import(`../assets/images/${imageName.toLowerCase()}.svg?react`)
        .then((module) => {
            setImageSrc(() => module.default)
        })
        .catch((error) => {
            console.error(`Failed to load image: ${imageName}`, error)
        })
    }, [imageName])

    return imageSrc
}

export default DynamicImage