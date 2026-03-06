import React from 'react'
import { renderToString } from 'react-dom/server'
import { StaticRouter } from 'react-router-dom/server'
import App from './src/App.tsx'

try {
    // Try to render the app to string to catch any synchronous React throw errors
    const html = renderToString(
        <StaticRouter location="/settings">
            <App />
        </StaticRouter>
    )
    console.log("RENDER SUCCESS. HTML length:", html.length)
} catch (e) {
    console.error("RENDER ERROR:", e)
}
