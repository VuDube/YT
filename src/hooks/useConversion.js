import { useState, useCallback } from 'react'
import { useLocalStorage } from './useLocalStorage'

export const useConversion = () => {
  const [currentJob, setCurrentJob] = useState(null)
  const [queue, setQueue] = useState([])
  const [history, setHistory] = useLocalStorage('conversion-history', [])

  // Mock conversion function - replace with actual Cloudflare Worker call
  const convertUrl = useCallback(async (url, settings) => {
    const jobId = Date.now().toString()
    
    const newJob = {
      id: jobId,
      url,
      status: 'processing',
      progress: 0,
      title: 'Extracting video info...',
      thumbnail: null,
      metadata: {
        title: '',
        artist: '',
        album: '',
        year: '',
        track: ''
      },
      settings,
      createdAt: new Date().toISOString()
    }

    setCurrentJob(newJob)

    // Simulate conversion process
    const steps = [
      'Fetching video data...',
      'Extracting audio...',
      'Converting to MP3...',
      'Adding metadata...',
      'Finalizing...'
    ]

    for (let i = 0; i < steps.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 1000))
      setCurrentJob(prev => prev ? {
        ...prev,
        progress: ((i + 1) / steps.length) * 100,
        title: steps[i]
      } : null)
    }

    // Simulate completion
    const completedJob = {
      ...newJob,
      status: 'completed',
      progress: 100,
      title: 'Conversion complete!',
      metadata: {
        title: 'Sample Audio Track',
        artist: 'Unknown Artist',
        album: 'YouTube Conversions',
        year: new Date().getFullYear().toString(),
        track: '1'
      },
      downloadUrl: '#' // Replace with actual download URL from Worker
    }

    setCurrentJob(completedJob)
    setHistory(prev => [completedJob, ...prev.slice(0, 49)]) // Keep last 50

    return completedJob
  }, [setHistory])

  const addToQueue = useCallback((url, settings) => {
    const newJob = {
      id: Date.now().toString(),
      url,
      settings,
      status: 'queued',
      createdAt: new Date().toISOString()
    }
    setQueue(prev => [...prev, newJob])
  }, [])

  const removeFromQueue = useCallback((jobId) => {
    setQueue(prev => prev.filter(job => job.id !== jobId))
  }, [])

  const clearQueue = useCallback(() => {
    setQueue([])
  }, [])

  const updateJobTags = useCallback((jobId, metadata) => {
    setCurrentJob(prev => prev?.id === jobId ? { ...prev, metadata } : prev)
    setHistory(prev => prev.map(job => 
      job.id === jobId ? { ...job, metadata } : job
    ))
  }, [setHistory])

  return {
    currentJob,
    queue,
    history,
    convertUrl,
    addToQueue,
    removeFromQueue,
    clearQueue,
    updateJobTags
  }
}
