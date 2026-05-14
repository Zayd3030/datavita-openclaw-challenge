import { useState, useCallback } from 'react'
import { QUALIFICATION_STAGES, extractQualificationData, mapToService } from '../lib/agent.js'
import { fetchIntelligenceContext } from '../lib/intelligence.js'
import { logEnquiry } from '../lib/supabase.js'
import { getPriorityLevel } from '../lib/routing.js'

export function useQualification() {
  const [messages, setMessages] = useState([])
  const [stage, setStage] = useState(QUALIFICATION_STAGES.GREETING)
  const [isLoading, setIsLoading] = useState(false)
  const [brief, setBrief] = useState(null)
  const [qualificationData, setQualificationData] = useState(null)
  const [error, setError] = useState(null)

  const sendMessage = useCallback(async (userInput) => {
    if (!userInput.trim() || isLoading) return

    const newMessages = [
      ...messages,
      { role: 'user', content: userInput.trim() },
    ]
    setMessages(newMessages)
    setIsLoading(true)
    setError(null)

    if (stage === QUALIFICATION_STAGES.GREETING) {
      setStage(QUALIFICATION_STAGES.QUESTIONING)
    }

    try {
      const response = await fetch('/api/qualify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages, stage }),
      })

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}))
        throw new Error(errData.error || `API error ${response.status}`)
      }

      const { message, isComplete } = await response.json()

      const updatedMessages = [
        ...newMessages,
        { role: 'assistant', content: message },
      ]
      setMessages(updatedMessages)

      if (isComplete) {
        setStage(QUALIFICATION_STAGES.GENERATING)
        await generateBrief(updatedMessages)
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }, [messages, stage, isLoading])

  const generateBrief = useCallback(async (msgs) => {
    setIsLoading(true)
    try {
      const extracted = extractQualificationData(msgs)
      const { service, confidence } = mapToService(extracted)
      const priority = getPriorityLevel(extracted)

      const enrichedData = {
        ...extracted,
        mapped_service: service,
        routing_confidence: confidence,
      }

      let intelligenceContext = ''
      try {
        const intel = await fetchIntelligenceContext(enrichedData)
        intelligenceContext = intel.context || ''
      } catch {
        intelligenceContext = 'DataVita operates two Tier III certified data centres in Scotland: DV1 in Lanarkshire (100% renewable, PUE 1.18) and DV2 at 177 Bothwell Street, Glasgow. Lanarkshire is a designated UK AI Growth Zone, and DataVita has a strategic CoreWeave partnership for GPU/HPC infrastructure. Key clients include the Scottish Government, Virgin Money, and multiple Scottish councils.'
      }

      const briefResponse = await fetch('/api/qualify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: msgs,
          stage: 'generating',
          generateBrief: true,
          qualificationData: enrichedData,
          intelligenceContext,
          priority,
        }),
      })

      if (!briefResponse.ok) throw new Error('Brief generation failed')

      const { brief: briefText } = await briefResponse.json()

      const finalData = {
        ...enrichedData,
        brief_text: briefText,
        intelligence_context: intelligenceContext,
        status: 'new',
      }

      setQualificationData(finalData)
      setBrief(briefText)
      setStage(QUALIFICATION_STAGES.COMPLETE)

      logEnquiry(finalData).catch(console.error)
    } catch (err) {
      setError(err.message)
      setStage(QUALIFICATION_STAGES.COMPLETE)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const reset = useCallback(() => {
    setMessages([])
    setStage(QUALIFICATION_STAGES.GREETING)
    setIsLoading(false)
    setBrief(null)
    setQualificationData(null)
    setError(null)
  }, [])

  return {
    messages,
    stage,
    isLoading,
    brief,
    qualificationData,
    error,
    sendMessage,
    reset,
  }
}
