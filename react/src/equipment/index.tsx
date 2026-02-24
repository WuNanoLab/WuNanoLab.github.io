import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {
  FluentProvider, webLightTheme,
} from "@fluentui/react-components";
import '../index.css'
import { EquipmentGallery } from './gallery';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <FluentProvider theme={webLightTheme}>
      <EquipmentGallery data={} />
    </FluentProvider>
  </StrictMode>,
)