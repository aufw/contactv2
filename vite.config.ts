import { defineConfig } from 'vite';

export default defineConfig({
    server: {
        port: 4200,
        open: true,
        proxy: {
            '/api.php': {
                target: 'http://localhost:8000',
                changeOrigin: true,
                secure: false,
                configure: (proxy) => {
                    proxy.on('error', (err) => {
                        console.error('Proxy error:', err);
                    });
                    proxy.on('proxyReq', (proxyReq) => {
                        console.log('Proxying request:', proxyReq.path);
                    });
                }
            }
        }
    },
    build: {
        outDir: 'dist',
        target: 'es2020'
    }
});