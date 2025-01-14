import React from 'react';
import Message from './Message';

interface ChatInterfaceProps {
  messages: Message[];
  input: string;
  isLoading: boolean;
  answer: string;
  citations: string[];
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  selectedEmbedding: string;
  onEmbeddingChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  selectedLLM: string;
  onLLMChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  minSimilarityScore: string;
  onMinSimilarityScoreChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  minYesProbabilityThreshold: string;
  onMinYesProbabilityThresholdChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled: boolean;
  showInputs: boolean;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({
  messages,
  input,
  isLoading,
  answer,
  citations,
  onInputChange,
  onSubmit,
  selectedEmbedding,
  onEmbeddingChange,
  selectedLLM,
  onLLMChange,
  minSimilarityScore,
  onMinSimilarityScoreChange,
  minYesProbabilityThreshold,
  onMinYesProbabilityThresholdChange,
  disabled,
  showInputs,
}) => {
  const embeddings = [
    { id: 3, name: 'Alibaba-NLP/gte-multilingual-base (with title)' },
    { id: 4, name: 'Alibaba-NLP/gte-multilingual-base (without title)' },
    { id: 5, name: 'sentence-transformers/paraphrase-multilingual-mpnet-base-v2 (with title)' },
    { id: 6, name: 'sentence-transformers/paraphrase-multilingual-mpnet-base-v2 (without title)' },
  ];

  const llms = [
    'meta-llama/Llama-3.2-3B-Instruct',
    'sail/Sailor-4B-Chat',
  ];

  const validateFloatInput = (value: string) => {
    return value === '' || (!isNaN(parseFloat(value)) && parseFloat(value) >= 0 && parseFloat(value) <= 1);
  };

  return (
    <div className="d-flex flex-column vh-100">
      <div className="flex-grow-1 overflow-auto p-3">
        {messages.map((m) => (
          <div key={m.id} className={`mb-3 ${m.role === 'user' ? 'text-end' : ''}`}>
            <div
              className={`d-inline-block p-2 rounded-3 ${
                m.role === 'user' ? 'bg-primary text-white' : 'bg-light'
              }`}
            >
              {m.content}
            </div>
          </div>
        ))}
        {isLoading && <div className="text-center">Processing your query...</div>}
        {answer && (
          <div className="bg-success bg-opacity-10 p-3 rounded-3 mt-3">
            <h5 className="mb-2">Answer:</h5>
            <p>{answer}</p>
            {citations.length > 0 && (
              <div className="mt-3">
                <h6 className="mb-2">Citations:</h6>
                <ul className="list-unstyled">
                  {citations.map((citation, index) => (
                    <li key={index}>{citation}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
      {showInputs && (
        <div className="p-3 border-top">
          <form onSubmit={onSubmit}>
            <div className="mb-3">
              <select
                className="form-select mb-2"
                value={selectedEmbedding}
                onChange={onEmbeddingChange}
                disabled={disabled}
              >
                <option value="">Select Embedding</option>
                {embeddings.map((embedding) => (
                  <option key={embedding.id} value={embedding.id.toString()}>
                    {embedding.name}
                  </option>
                ))}
              </select>
              <select
                className="form-select mb-2"
                value={selectedLLM}
                onChange={onLLMChange}
                disabled={disabled}
              >
                <option value="">Select LLM</option>
                {llms.map((llm) => (
                  <option key={llm} value={llm}>
                    {llm}
                  </option>
                ))}
              </select>
              <div className="input-group mb-2">
                <span className="input-group-text">Min Similarity Score</span>
                <input
                  type="text"
                  className="form-control"
                  value={minSimilarityScore}
                  onChange={(e) => {
                    if (validateFloatInput(e.target.value)) {
                      onMinSimilarityScoreChange(e);
                    }
                  }}
                  placeholder="0.0 - 1.0"
                  disabled={disabled}
                  aria-label="Minimum Similarity Score"
                />
              </div>
              <div className="input-group mb-2">
                <span className="input-group-text">Min Yes Probability</span>
                <input
                  type="text"
                  className="form-control"
                  value={minYesProbabilityThreshold}
                  onChange={(e) => {
                    if (validateFloatInput(e.target.value)) {
                      onMinYesProbabilityThresholdChange(e);
                    }
                  }}
                  placeholder="0.0 - 1.0"
                  disabled={disabled}
                  aria-label="Minimum Yes Probability Threshold"
                />
              </div>
            </div>
            <div className="input-group">
              <input
                type="text"
                className="form-control"
                value={input}
                onChange={onInputChange}
                placeholder="Ask a question..."
                disabled={disabled}
              />
              <button type="submit" className="btn btn-primary" disabled={disabled || isLoading}>
                {isLoading ? 'Processing...' : 'Send'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default ChatInterface;

