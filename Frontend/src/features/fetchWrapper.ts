export const fetchWrapper = async (url: string, options: RequestInit = {}): Promise<T> => {
    const token = localStorage.getItem("token")

    const res = await fetch(url, {
        ...options,
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            ...options.headers,
        },
    })

    if (!res.ok) {
        let errorMessage = "Request Failed" 
        try {
            const errorData = await res.json()
            errorMessage = errorData.message || errorMessage
        } catch (error) {
            console.error(error)
        }
        throw new Error(errorMessage)
    }

    return res.json()
}
    