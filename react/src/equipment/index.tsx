import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {
  FluentProvider, webLightTheme,
} from "@fluentui/react-components";
import '../index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <FluentProvider theme={webLightTheme}>
      
    </FluentProvider>
  </StrictMode>,
)