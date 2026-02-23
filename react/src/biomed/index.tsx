import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {
  FluentProvider, webLightTheme,
} from "@fluentui/react-components";
import '../index.css'
import { FacultySection } from './faculty'
import { AgendaSection } from './agenda'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <FluentProvider theme={webLightTheme}>
      <FacultySection />
      <AgendaSection />
    </FluentProvider>
  </StrictMode>,
)