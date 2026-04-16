import './index.css'
import React from 'react'
import { createRoot } from 'react-dom/client'
import { HeroFlipWords } from './components/HeroFlipWords'
import { DesigningInteriorsWhisper } from './components/DesigningInteriorsWhisper'

// Mount Hero FlipWords
const flipWordsRoot = document.getElementById('hero-flipwords-root')
if (flipWordsRoot) {
  createRoot(flipWordsRoot).render(
    <React.StrictMode>
      <HeroFlipWords />
    </React.StrictMode>,
  )
}

// Mount Designing Interiors Whisper
const whisperRoot = document.getElementById('designing-interiors-whisper-root')
if (whisperRoot) {
  createRoot(whisperRoot).render(
    <React.StrictMode>
      <DesigningInteriorsWhisper />
    </React.StrictMode>,
  )
}
