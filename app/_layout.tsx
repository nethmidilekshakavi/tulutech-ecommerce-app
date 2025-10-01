import React from "react"
import "./../global.css"
import { Slot } from "expo-router"
import { AuthProvider } from "@/context/AuthContext"
// import { LoaderProvider } from "@/context/LoaderContext"
// import { ThemeProvider } from "@/context/ThemeContext"
// import { FavoritesProvider } from "@/app/(tabs)/Favorites";

const RootLayout = () => {
    return (

            <AuthProvider>
                        <Slot />
            </AuthProvider>

    )
}

export default RootLayout
