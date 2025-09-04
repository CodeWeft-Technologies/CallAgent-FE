import React from 'react'
import { PhoneIncoming, PhoneOutgoing, Eye } from 'lucide-react'

interface Call {
  _id: string
  phone_number: string | number
  direction?: 'inbound' | 'outbound'
  lead_id?: string
  lead?: {
    name: string
    company?: string
    email?: string
  }
  call_date: string
  status: 'completed' | 'failed' | 'missed' | 'initiated'
  duration: number
  transcription: Array<{
    type: 'user' | 'bot' | 'greeting' | 'exit'
    content: string
    timestamp: string
  }>
  ai_responses: Array<{
    type: 'bot' | 'greeting' | 'exit'
    content: string
    timestamp: string
  }>
  call_summary: string
  sentiment: string
  interest_analysis?: {
    interest_status: 'interested' | 'not_interested' | 'neutral'
    confidence: number
    reasoning: string
    key_indicators: string[]
  }
  created_at: string
  webhook_data?: {
    from?: number
    to?: number
    [key: string]: any
  }
}

interface MemoizedCallRowProps {
  call: Call
  index: number
  getStatusBadge: (status: string) => React.ReactNode
  getDirectionBadge: (call: Call) => React.ReactNode
  getInterestBadge: (interest_analysis?: Call['interest_analysis']) => React.ReactNode
  formatDuration: (seconds: number) => string
  formatDate: (dateString: string) => string
  onSelectCall: (call: Call) => void
}

const MemoizedCallRow = React.memo<MemoizedCallRowProps>(({
  call,
  index,
  getStatusBadge,
  getDirectionBadge,
  getInterestBadge,
  formatDuration,
  formatDate,
  onSelectCall
}) => {
  console.log(`🔄 Rendering MemoizedCallRow for call ${call._id} (index: ${index})`)
  
  return (
    <tr className={`hover:bg-slate-800/50 transition-colors ${index % 2 === 0 ? 'bg-slate-900' : 'bg-slate-900/50'}`}>
      <td className="px-4 py-4">
        {getDirectionBadge(call)}
      </td>
      <td className="px-4 py-4">
        <div className="text-sm text-white font-medium">{formatDate(call.call_date)}</div>
      </td>
      <td className="px-4 py-4">
        {call.lead ? (
          <div className="space-y-1">
            <div className="font-medium text-white">{call.lead.name || '—'}</div>
            {call.lead.company && (
              <div className="text-xs text-slate-400">{call.lead.company}</div>
            )}
          </div>
        ) : (
          <div className="text-slate-500 text-sm">No lead</div>
        )}
      </td>
      <td className="px-4 py-4">
        {getStatusBadge(call.status)}
      </td>
      <td className="px-4 py-4">
        {getInterestBadge(call.interest_analysis)}
      </td>
      <td className="px-4 py-4">
        <div className="text-sm text-white font-medium">{formatDuration(call.duration)}</div>
      </td>
      <td className="px-4 py-4">
        <div className="text-xs space-y-1">
          <div className="text-white">
            {call.transcription.length} user messages
          </div>
          <div className="text-slate-400">
            {call.ai_responses.length} AI responses
          </div>
        </div>
      </td>
      <td className="px-4 py-4">
        <button
          onClick={() => onSelectCall(call)}
          className="flex items-center space-x-2 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-all text-sm"
        >
          <Eye className="w-4 h-4" />
          <span>View</span>
        </button>
      </td>
    </tr>
  )
})

MemoizedCallRow.displayName = 'MemoizedCallRow'

export default MemoizedCallRow
