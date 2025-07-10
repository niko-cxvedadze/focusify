import { createRoot } from 'react-dom/client'

import App from './App'
import './assets/index.css'
import { Providers } from './providers/Providers'

createRoot(document.getElementById('app')!).render(
  <Providers>
    <App />
  </Providers>
)
