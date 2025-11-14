import React, { useState } from 'react'
import { Download, Copy, X } from 'lucide-react'

const UrlInput = ({ onConvert, clipboardUrl, onDismissClipboard }) => {
  const [url, setUrl] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!url.trim() || isLoading) return

    setIsLoading(true)
    try {
      await onConvert(url)
      setUrl('')
    } catch (error) {
      console.error('Conversion error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText()
      setUrl(text)
    } catch (error) {
      console.log('Clipboard access not available')
    }
  }

  return (
    <div className="slide-in">
      {clipboardUrl && (
        <div className="clipboard-banner">
          <div className="clipboard-content">
            <Copy size={18} />
            <span>URL detected in clipboard</span>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={() => onConvert(clipboardUrl)}
              className="btn btn-secondary"
              style={{ padding: '8px 12px', minHeight: 'auto' }}
            >
              Convert
            </button>
            <button 
              onClick={onDismissClipboard}
              className="btn btn-secondary"
              style={{ padding: '8px', minHeight: 'auto' }}
            >
              <X size={16} />
            </button>
          </div>
        </div>
      )}

      <div className="card">
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="url" className="block text-sm font-medium mb-2">
              YouTube URL
            </label>
            <input
              id="url"
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://www.youtube.com/watch?v=..."
              className="input"
              required
            />
          </div>
          
          <div className="flex gap-3">
            <button
              type="button"
              onClick={handlePaste}
              className="btn btn-secondary flex-1"
              disabled={isLoading}
            >
              <Copy size={18} />
              Paste
            </button>
            <button
              type="submit"
              disabled={!url.trim() || isLoading}
              className="btn btn-primary flex-1"
            >
              {isLoading ? (
                <>
                  <div className="spinner"></div>
                  Converting...
                </>
              ) : (
                <>
                  <Download size={18} />
                  Convert
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default UrlInput
