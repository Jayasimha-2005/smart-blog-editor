import { useState } from 'react';
import { Sparkles, CheckCircle, AlertCircle } from 'lucide-react';
import { aiAPI } from '../services/api';

function AIButton({ onInsertText, extractPlainText }) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [lastAction, setLastAction] = useState(null);
  const [error, setError] = useState(null);

  const handleGenerate = async (type) => {
    setError(null);
    setIsGenerating(true);
    setLastAction(type);

    try {
      // Extract plain text from Lexical editor
      const content = extractPlainText();

      if (!content || content.trim().length === 0) {
        throw new Error('No content to process. Write something first.');
      }

      // Call AI API
      const response = await aiAPI.generate(content, type);
      const result = response.data.result;

      // Insert generated text into editor
      onInsertText(result);

      // Show success feedback
      console.log(`AI ${type} generated successfully`);
      
    } catch (err) {
      console.error('AI generation failed:', err);
      setError(err.response?.data?.detail || err.message || 'AI generation failed');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      {/* Generate Summary Button */}
      <button
        onClick={() => handleGenerate('summary')}
        disabled={isGenerating}
        className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-purple-700 bg-purple-50 hover:bg-purple-100 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
        title="Generate Summary"
      >
        <Sparkles size={16} className={isGenerating && lastAction === 'summary' ? 'animate-pulse' : ''} />
        {isGenerating && lastAction === 'summary' ? 'Generating...' : 'Summary'}
      </button>

      {/* Fix Grammar Button */}
      <button
        onClick={() => handleGenerate('grammar')}
        disabled={isGenerating}
        className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
        title="Fix Grammar"
      >
        <CheckCircle size={16} className={isGenerating && lastAction === 'grammar' ? 'animate-pulse' : ''} />
        {isGenerating && lastAction === 'grammar' ? 'Fixing...' : 'Grammar'}
      </button>

      {/* Error indicator */}
      {error && (
        <div className="flex items-center gap-1.5 text-xs text-red-600">
          <AlertCircle size={14} />
          <span className="max-w-xs truncate" title={error}>{error}</span>
        </div>
      )}
    </div>
  );
}

export default AIButton;
