import React, { useState, useCallback } from 'react'
import { 
  Download, 
  Music, 
  Settings, 
  History, 
  Play,
  Copy,
  Check,
  X,
  Edit3,
  Image as ImageIcon
} from 'lucide-react'
import UrlInput from './components/UrlInput'
import ConversionStatus from './components/ConversionStatus'
import TagEditor from './components/TagEditor'
import BatchQueue from './components/BatchQueue'
import HistoryManager from './components/HistoryManager'
import SettingsPanel from './components/SettingsPanel'
import { useConversion } from './hooks/useConversion'
import { useLocalStorage } from './hooks/useLocalStorage'
import { usePWA } from './hooks/usePWA'
import './styles/App.css'

const TABS = {
  CONVERT: 'convert',
  BATCH: 'batch',
  HISTORY: 'history',
  SETTINGS: 'settings'
}

function App() {
  const [activeTab, setActiveTab] = useState(TABS.CONVERT)
  const [clipboardUrl, setClipboardUrl] = useState('')
  const [showTagEditor, setShowTagEditor] = useState(false)
  
  const {
    currentJob,
    queue,
    history,
    convertUrl,
    addToQueue,
    removeFromQueue,
    clearQueue,
    updateJobTags
  } = useConversion()

  const [settings, setSettings] = useLocalStorage('converter-settings', {
    autoPaste: true,
    includeArtwork: true,
    quality: '320kbps',
    theme: 'system'
  })

  usePWA()

  // Check clipboard for URLs
  const checkClipboard = useCallback(async () => {
    if (!settings.autoPaste) return
    
    try {
      const text = await navigator.clipboard.readText()
      if (text.includes('youtube.com/watch') || text.includes('youtu.be/')) {
        setClipboardUrl(text)
      }
    } catch (err) {
      // Clipboard access might be denied in some contexts
      console.log('Clipboard access not available')
    }
  }, [settings.autoPaste])

  React.useEffect(() => {
    checkClipboard()
  }, [checkClipboard])

  const handleQuickConvert = useCallback((url) => {
    convertUrl(url, settings)
    setClipboardUrl('')
  }, [convertUrl, settings])

  return (
    <div className="app" data-theme={settings.theme}>
      <header className="app-header">
        <div className="header-content">
          <Music className="header-icon" />
          <h1>Streamline Converter</h1>
        </div>
      </header>

      <main className="app-main">
        {activeTab === TABS.CONVERT && (
          <div className="convert-view">
            <UrlInput 
              onConvert={handleQuickConvert}
              clipboardUrl={clipboardUrl}
              onDismissClipboard={() => setClipboardUrl('')}
            />
            
            {currentJob && (
              <ConversionStatus 
                job={currentJob}
                onEditTags={() => setShowTagEditor(true)}
              />
            )}

            {showTagEditor && currentJob && (
              <TagEditor
                job={currentJob}
                onSave={(tags) => {
                  updateJobTags(currentJob.id, tags)
                  setShowTagEditor(false)
                }}
                onCancel={() => setShowTagEditor(false)}
                includeArtwork={settings.includeArtwork}
              />
            )}
          </div>
        )}

        {activeTab === TABS.BATCH && (
          <BatchQueue
            queue={queue}
            onConvert={convertUrl}
            onRemove={removeFromQueue}
            onClear={clearQueue}
            settings={settings}
          />
        )}

        {activeTab === TABS.HISTORY && (
          <HistoryManager
            history={history}
            onReconvert={convertUrl}
          />
        )}

        {activeTab === TABS.SETTINGS && (
          <SettingsPanel
            settings={settings}
            onSettingsChange={setSettings}
          />
        )}
      </main>

      <nav className="bottom-nav">
        <button 
          className={`nav-item ${activeTab === TABS.CONVERT ? 'active' : ''}`}
          onClick={() => setActiveTab(TABS.CONVERT)}
        >
          <Download size={20} />
          <span>Convert</span>
        </button>
        
        <button 
          className={`nav-item ${activeTab === TABS.BATCH ? 'active' : ''}`}
          onClick={() => setActiveTab(TABS.BATCH)}
        >
          <Play size={20} />
          <span>Queue</span>
        </button>
        
        <button 
          className={`nav-item ${activeTab === TABS.HISTORY ? 'active' : ''}`}
          onClick={() => setActiveTab(TABS.HISTORY)}
        >
          <History size={20} />
          <span>History</span>
        </button>
        
        <button 
          className={`nav-item ${activeTab === TABS.SETTINGS ? 'active' : ''}`}
          onClick={() => setActiveTab(TABS.SETTINGS)}
        >
          <Settings size={20} />
          <span>Settings</span>
        </button>
      </nav>
    </div>
  )
}

export default App
