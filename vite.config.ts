import {defineConfig} from 'vite'
import {svelte} from '@sveltejs/vite-plugin-svelte'
import {VitePWA} from "vite-plugin-pwa";

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        svelte(),
        VitePWA({
            registerType: 'autoUpdate',
            injectRegister: 'script',
            manifest: {
                name: "KIT Vorlesungs Roulette",
                short_name: "KIT Vorlesungs Roulette",
                start_url: "/",
                display: "standalone",
                theme_color: "#333333",
                icons:[
                    {
                        "src": "pwa-icons/manifest-icon-192.png",
                        "sizes": "192x192",
                        "type": "image/png",
                        "purpose": "maskable any"
                    },
                    {
                        "src": "pwa-icons/manifest-icon-512.png",
                        "sizes": "512x512",
                        "type": "image/png",
                        "purpose": "maskable any"
                    }
                ]
            }
        })
    ]
})
