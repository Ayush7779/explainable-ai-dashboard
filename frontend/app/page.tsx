'use client'

import { useState } from 'react'
import { Send, FileText, CheckCircle, AlertCircle } from 'lucide-react'

const API_URL = 'http://localhost:8000'

interface Message {
    role: 'user' | 'assistant'
    content: string
    sources?: Source[]
    confidence?: number
}

interface Source {
    chunk_id: string
    text: string
    source: string
    page: number
    relevance_score: number
}

const PERSONAS = [
    { id: 'supply_chain', name: 'Supply Chain Manager', icon: '📦', color: 'from-blue-500 to-cyan-500' },
    { id: 'education', name: 'School Administrator', icon: '🎓', color: 'from-purple-500 to-pink-500' },
    { id: 'hr', name: 'HR Manager', icon: '👥', color: 'from-green-500 to-emerald-500' },
]

export default function Home() {
    const [messages, setMessages] = useState<Message[]>([])
    const [input, setInput] = useState('')
    const [loading, setLoading] = useState(false)
    const [selectedPersona, setSelectedPersona] = useState(PERSONAS[0])
    const [highlightedSource, setHighlightedSource] = useState<Source | null>(null)

    const sendMessage = async () => {
        if (!input.trim()) return

        const userMessage: Message = { role: 'user', content: input }
        setMessages(prev => [...prev, userMessage])
        setInput('')
        setLoading(true)

        try {
            const response = await fetch(`${API_URL}/chat`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: input,
                    persona: selectedPersona.id
                })
            })

            if (!response.ok) throw new Error('Failed to get response')

            const data = await response.json()
            const assistantMessage: Message = {
                role: 'assistant',
                content: data.answer,
                sources: data.sources,
                confidence: data.confidence
            }

            setMessages(prev => [...prev, assistantMessage])

            // Auto-highlight first source
            if (data.sources && data.sources.length > 0) {
                setHighlightedSource(data.sources[0])
            }
        } catch (error) {
            console.error('Error:', error)
            const errorMessage: Message = {
                role: 'assistant',
                content: 'Sorry, I encountered an error. Please make sure the backend is running.',
                confidence: 0
            }
            setMessages(prev => [...prev, errorMessage])
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="flex h-screen bg-background text-foreground">
            {/* Sidebar - Persona Selector */}
            <div className="w-64 border-r border-border p-4 flex flex-col">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                        ExplainableAI
                    </h1>
                    <p className="text-sm text-foreground/60 mt-1">by EmployGenAI</p>
                </div>

                <div className="space-y-2 flex-1">
                    <h2 className="text-xs uppercase text-foreground/60 font-semibold mb-3">Select Persona</h2>
                    {PERSONAS.map((persona) => (
                        <button
                            key={persona.id}
                            onClick={() => setSelectedPersona(persona)}
                            className={`w-full p-3 rounded-lg text-left transition-all ${selectedPersona.id === persona.id
                                ? 'bg-primary/20 border border-primary'
                                : 'bg-secondary/50 border border-transparent hover:border-border'
                                }`}
                        >
                            <div className="flex items-center gap-2">
                                <span className="text-2xl">{persona.icon}</span>
                                <span className="text-sm font-medium">{persona.name}</span>
                            </div>
                        </button>
                    ))}
                </div>

                <div className="mt-auto pt-4 border-t border-border">
                    <p className="text-xs text-foreground/40">
                        Built for high-impact presentation
                    </p>
                </div>
            </div>

            {/* Main Chat Area */}
            <div className="flex-1 flex flex-col">
                {/* Header */}
                <div className={`p-4 border-b border-border bg-gradient-to-r ${selectedPersona.color} bg-opacity-10`}>
                    <h2 className="text-lg font-semibold">{selectedPersona.name} Dashboard</h2>
                    <p className="text-sm text-foreground/70">Ask questions about your documents with transparent source attribution</p>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                    {messages.length === 0 && (
                        <div className="text-center text-foreground/50 mt-20">
                            <FileText className="w-16 h-16 mx-auto mb-4 opacity-20" />
                            <p className="text-lg">Ask me anything about {selectedPersona.name.toLowerCase()} data</p>
                            <p className="text-sm mt-2">I'll show you exactly where my answers come from</p>
                        </div>
                    )}

                    {messages.map((message, idx) => (
                        <div key={idx} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-2xl ${message.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-secondary'} rounded-lg p-4`}>
                                <p className="whitespace-pre-wrap">{message.content}</p>

                                {message.sources && message.sources.length > 0 && (
                                    <div className="mt-4 space-y-2">
                                        <div className="flex items-center gap-2">
                                            {message.confidence && message.confidence > 0.7 ? (
                                                <CheckCircle className="w-4 h-4 text-green-400" />
                                            ) : (
                                                <AlertCircle className="w-4 h-4 text-yellow-400" />
                                            )}
                                            <span className="text-xs font-semibold">
                                                {message.confidence && message.confidence > 0.7 ? 'Verified from Sources' : 'Low Confidence'}
                                            </span>
                                            <span className="text-xs text-foreground/60">
                                                ({Math.round((message.confidence || 0) * 100)}%)
                                            </span>
                                        </div>
                                        <div className="space-y-1">
                                            {message.sources.map((source, sourceIdx) => (
                                                <button
                                                    key={sourceIdx}
                                                    onClick={() => setHighlightedSource(source)}
                                                    className="block w-full text-left text-xs bg-background/50 p-2 rounded hover:bg-background transition-colors"
                                                >
                                                    <FileText className="w-3 h-3 inline mr-1" />
                                                    {source.source} (Relevance: {Math.round(source.relevance_score * 100)}%)
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}

                    {loading && (
                        <div className="flex justify-start">
                            <div className="bg-secondary rounded-lg p-4">
                                <div className="flex gap-2">
                                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Input */}
                <div className="border-t border-border p-4">
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                            placeholder="Ask a question..."
                            className="flex-1 bg-secondary border border-border rounded-lg px-4 py-3 focus:outline-none focus:border-primary"
                            disabled={loading}
                        />
                        <button
                            onClick={sendMessage}
                            disabled={loading || !input.trim()}
                            className="bg-primary text-primary-foreground px-6 rounded-lg hover:opacity-90 disabled:opacity-50 transition-opacity"
                        >
                            <Send className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Document Viewer */}
            <div className="w-96 border-l border-border p-6 bg-secondary/30 overflow-y-auto">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    Source Document
                </h3>

                {highlightedSource ? (
                    <div className="space-y-4">
                        <div className="bg-primary/20 border border-primary rounded-lg p-4">
                            <div className="text-xs text-foreground/60 mb-2">📄 {highlightedSource.source}</div>
                            <div className="text-sm leading-relaxed bg-background/50 p-3 rounded">
                                {highlightedSource.text}
                            </div>
                            <div className="mt-3 text-xs">
                                <span className="bg-green-500/20 text-green-400 px-2 py-1 rounded">
                                    ✓ Verified Source
                                </span>
                            </div>
                        </div>

                        <div className="text-xs text-foreground/50">
                            <p>💡 <strong>How it works:</strong> When the AI answers your question, it highlights the exact paragraph from the source document it used. This ensures transparency and builds trust.</p>
                        </div>
                    </div>
                ) : (
                    <div className="text-center text-foreground/40 mt-20">
                        <FileText className="w-12 h-12 mx-auto mb-3 opacity-20" />
                        <p className="text-sm">Source documents will appear here</p>
                        <p className="text-xs mt-2">Ask a question to see the magic!</p>
                    </div>
                )}
            </div>
        </div>
    )
}
