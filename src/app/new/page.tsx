'use client'

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { processQuery } from '../../utils/queryProcessor';
import ChatInterface from '../../components/ChatInterface';
import HistoryPanel from '../../components/HistoryPanel';
import ApiResponseViewer from '../../components/ApiResponseViewer';

export default function NewChat() {
  const router = useRouter();
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedEmbedding, setSelectedEmbedding] = useState('');
  const [selectedLLM, setSelectedLLM] = useState('');
  const [minSimilarityScore, setMinSimilarityScore] = useState('');
  const [minYesProbabilityThreshold, setMinYesProbabilityThreshold] = useState('');
  const [apiResponse, setApiResponse] = useState(null);

  const handleQuerySubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const data = await processQuery(
        input,
        selectedEmbedding,
        selectedLLM,
        parseFloat(minSimilarityScore) || undefined,
        parseFloat(minYesProbabilityThreshold) || undefined
      );
      setApiResponse(data);
    } catch (error) {
      console.error('Error processing query:', error);
      alert('An error occurred while processing your query.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const handleEmbeddingChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedEmbedding(e.target.value);
  };

  const handleLLMChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedLLM(e.target.value);
  };

  const handleMinSimilarityScoreChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMinSimilarityScore(e.target.value);
  };

  const handleMinYesProbabilityThresholdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMinYesProbabilityThreshold(e.target.value);
  };

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-3">
          <HistoryPanel />
        </div>
        <div className="col-md-9">
          <h1 className="mb-4">Start a New Chat</h1>
          <ChatInterface
            messages={[]}
            input={input}
            isLoading={isLoading}
            answer=""
            citations={[]}
            onInputChange={handleInputChange}
            onSubmit={handleQuerySubmit}
            selectedEmbedding={selectedEmbedding}
            onEmbeddingChange={handleEmbeddingChange}
            selectedLLM={selectedLLM}
            onLLMChange={handleLLMChange}
            minSimilarityScore={minSimilarityScore}
            onMinSimilarityScoreChange={handleMinSimilarityScoreChange}
            minYesProbabilityThreshold={minYesProbabilityThreshold}
            onMinYesProbabilityThresholdChange={handleMinYesProbabilityThresholdChange}
            disabled={isLoading}
            showInputs={true}
          />
          {apiResponse && <ApiResponseViewer data={apiResponse} />}
        </div>
      </div>
    </div>
  );
}

