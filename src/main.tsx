import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import { enablePreventLostFocus } from './utils/preventLostFocus.ts'
import './index.css'

// prevent focus loss when clicking outside of interactive elements
enablePreventLostFocus('root');

ReactDOM.createRoot(document.getElementById('root')!).render(
    <App />
)
