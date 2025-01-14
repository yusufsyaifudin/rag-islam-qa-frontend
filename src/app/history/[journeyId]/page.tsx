'use client'

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import HistoryPanel from '../../../components/HistoryPanel';

interface HistoryData {
  journeyId: string;
  question: string;
  minSimilarityScore?: number;
  minYesProbabilityThreshold?: number;
  embeddings_search: {
    embeddings_id: number;
    embeddings_name: string;
    data: Array<{
      chunk_id: number;
      chunk_doc_id: number;
      chunk_text: string;
      score: number;
    }>;
  };
  documents: {
    embeddings_id: number;
    embeddings_name: string;
    data: Array<{
      doc_id: number;
      title: string;
      category: string;
      text: string;
      link: string;
      average_score: number;
    }>;
  };
  reranked_documents_with_probabilities: Array<{
    doc_id: number;
    generated_text: string;
    yes_probability: number;
  }>;
  generated_answer_without_reranking: {
    generated_text: string;
    input_token: number;
    output_token: number;
  };
  generated_answer_with_reranking: {
    generated_text: string;
    input_token: number;
    output_token: number;
  };
  citation_without_reranking: Array<{
    doc_id: number;
    generated_text_start_index: number;
    generated_text_end_index: number;
    generated_text_sentence: string;
    doc_start_index: number;
    doc_end_index: number;
    doc_sentence: string;
    score: number;
  }>;
  citation_with_reranking: Array<{
    doc_id: number;
    generated_text_start_index: number;
    generated_text_end_index: number;
    generated_text_sentence: string;
    doc_start_index: number;
    doc_end_index: number;
    doc_sentence: string;
    score: number;
  }>;
}

const HISTORY_API_HOST = 'https://another-server.com';

export default function HistoryPage() {
  const params = useParams();
  const { journeyId } = params;
  const [historyData, setHistoryData] = useState<HistoryData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchHistoryItem = async () => {
      try {
        const response = await fetch(`${HISTORY_API_HOST}/api/history/${journeyId}`);
        const data = await response.json();
        setHistoryData(data.data);
      } catch (error) {
        console.error('Error fetching history item:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (journeyId) {
      fetchHistoryItem();
    }
  }, [journeyId]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!historyData) {
    return <div>Error loading history item</div>;
  }

  return (
    <div className="container-fluid">
      <div className="row">
        <HistoryPanel />
        <div className="col-md-9">
          <h1 className="mb-4">History Item</h1>
          <div className="card mb-4">
            <div className="card-body">
              <h5 className="card-title">Question</h5>
              <p className="card-text">{historyData.question}</p>
              {historyData.minSimilarityScore !== undefined && (
                <p className="card-text">
                  <small className="text-muted">
                    Min Similarity Score: {historyData.minSimilarityScore}
                  </small>
                </p>
              )}
              {historyData.minYesProbabilityThreshold !== undefined && (
                <p className="card-text">
                  <small className="text-muted">
                    Min Yes Probability Threshold: {historyData.minYesProbabilityThreshold}
                  </small>
                </p>
              )}
            </div>
          </div>
          <div className="card mb-4">
            <div className="card-body">
              <h5 className="card-title">Answer (with reranking)</h5>
              <p className="card-text">{historyData.generated_answer_with_reranking.generated_text}</p>
              <p className="card-text">
                <small className="text-muted">
                  Input tokens: {historyData.generated_answer_with_reranking.input_token},
                  Output tokens: {historyData.generated_answer_with_reranking.output_token}
                </small>
              </p>
            </div>
          </div>
          <div className="card mb-4">
            <div className="card-body">
              <h5 className="card-title">Citations (with reranking)</h5>
              <ul className="list-group list-group-flush">
                {historyData.citation_with_reranking.map((citation, index) => (
                  <li key={index} className="list-group-item">
                    <p>Document ID: {citation.doc_id}</p>
                    <p>Sentence: {citation.generated_text_sentence}</p>
                    <p>Score: {citation.score}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="card mb-4">
            <div className="card-body">
              <h5 className="card-title">Embeddings Search</h5>
              <p>Embeddings ID: {historyData.embeddings_search.embeddings_id}</p>
              <p>Embeddings Name: {historyData.embeddings_search.embeddings_name}</p>
              <ul className="list-group list-group-flush">
                {historyData.embeddings_search.data.map((chunk, index) => (
                  <li key={index} className="list-group-item">
                    <p>Chunk ID: {chunk.chunk_id}</p>
                    <p>Document ID: {chunk.chunk_doc_id}</p>
                    <p>Text: {chunk.chunk_text}</p>
                    <p>Score: {chunk.score}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="mt-4">
            <Link href="/new" className="btn btn-primary">
              Start New Chat
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

