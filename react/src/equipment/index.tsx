import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {
  FluentProvider, webLightTheme,
} from "@fluentui/react-components";
import '../index.css'
import { EquipmentGallery } from './gallery';
import { PhotoSection } from './photo';
import equipmentData from './equipment.json';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <FluentProvider theme={webLightTheme}>
      <PhotoSection />
      <EquipmentGallery data={equipmentData} />
    </FluentProvider>
  </StrictMode>,
)