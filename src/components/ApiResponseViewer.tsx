import React, { useState } from 'react';

interface ApiResponse {
  elapsed_time_ns: number;
  elapsed_time_retrieve_chunks_ns: number;
  request_id: string;
  use_case_id_embeddings: number;
  use_case_embeddings_name: string;
  use_case_id_llm: number;
  use_case_llm_name: string;
  min_similarity_score_doc_retrieval: number;
  min_similarity_score_doc_retrieval_rerank: number;
  query: string;
  retrieved_chunks: any[];
  retrieved_documents: any[];
  reranked_documents_without_prob: any[];
  reranked_documents_with_prob: any[];
  answer_without_rerank: any;
  answer_rerank_without_prob: any;
  answer_rerank_with_prob: any;
}

interface ApiResponseViewerProps {
  data: ApiResponse;
}

const ApiResponseViewer: React.FC<ApiResponseViewerProps> = ({ data }) => {
  const [activeTab, setActiveTab] = useState('general');

  const renderJsonContent = (content: any) => {
    return <pre className="bg-light p-3 overflow-auto" style={{maxHeight: '400px'}}>{JSON.stringify(content, null, 2)}</pre>;
  };

  return (
    <div className="card">
      <div className="card-header">
        <h5 className="card-title">API Response Viewer</h5>
        <p className="card-text">Explore the different sections of the API response</p>
      </div>
      <div className="card-body">
        <ul className="nav nav-tabs mb-3">
          <li className="nav-item">
            <a className={`nav-link ${activeTab === 'general' ? 'active' : ''}`} onClick={() => setActiveTab('general')} href="#">General Info</a>
          </li>
          <li className="nav-item">
            <a className={`nav-link ${activeTab === 'chunks' ? 'active' : ''}`} onClick={() => setActiveTab('chunks')} href="#">Retrieved Chunks</a>
          </li>
          <li className="nav-item">
            <a className={`nav-link ${activeTab === 'documents' ? 'active' : ''}`} onClick={() => setActiveTab('documents')} href="#">Retrieved Documents</a>
          </li>
          <li className="nav-item">
            <a className={`nav-link ${activeTab === 'reranked' ? 'active' : ''}`} onClick={() => setActiveTab('reranked')} href="#">Reranked Documents</a>
          </li>
          <li className="nav-item">
            <a className={`nav-link ${activeTab === 'answers' ? 'active' : ''}`} onClick={() => setActiveTab('answers')} href="#">Generated Answers</a>
          </li>
        </ul>

        <div className="tab-content">
          <div className={`tab-pane fade ${activeTab === 'general' ? 'show active' : ''}`}>
            <h3 className="h5 mb-3">General Information</h3>
            <p><strong>Elapsed Time:</strong> {data.elapsed_time_ns / 1e9} seconds</p>
            <p><strong>Request ID:</strong> {data.request_id}</p>
            <p><strong>Query:</strong> {data.query}</p>
            <p><strong>Embeddings:</strong> {data.use_case_embeddings_name} (ID: {data.use_case_id_embeddings})</p>
            <p><strong>LLM:</strong> {data.use_case_llm_name} (ID: {data.use_case_id_llm})</p>
          </div>
          <div className={`tab-pane fade ${activeTab === 'chunks' ? 'show active' : ''}`}>
            <h3 className="h5 mb-3">Retrieved Chunks</h3>
            {renderJsonContent(data.retrieved_chunks)}
          </div>
          <div className={`tab-pane fade ${activeTab === 'documents' ? 'show active' : ''}`}>
            <h3 className="h5 mb-3">Retrieved Documents</h3>
            {renderJsonContent(data.retrieved_documents)}
          </div>
          <div className={`tab-pane fade ${activeTab === 'reranked' ? 'show active' : ''}`}>
            <h3 className="h5 mb-3">Reranked Documents</h3>
            <ul className="nav nav-pills mb-3">
              <li className="nav-item">
                <a className="nav-link active" data-bs-toggle="pill" href="#without-prob">Without Probabilities</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" data-bs-toggle="pill" href="#with-prob">With Probabilities</a>
              </li>
            </ul>
            <div className="tab-content">
              <div className="tab-pane fade show active" id="without-prob">
                {renderJsonContent(data.reranked_documents_without_prob)}
              </div>
              <div className="tab-pane fade" id="with-prob">
                {renderJsonContent(data.reranked_documents_with_prob)}
              </div>
            </div>
          </div>
          <div className={`tab-pane fade ${activeTab === 'answers' ? 'show active' : ''}`}>
            <h3 className="h5 mb-3">Generated Answers</h3>
            <ul className="nav nav-pills mb-3">
              <li className="nav-item">
                <a className="nav-link active" data-bs-toggle="pill" href="#without-rerank">Without Rerank</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" data-bs-toggle="pill" href="#rerank-without-prob">Rerank Without Prob</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" data-bs-toggle="pill" href="#rerank-with-prob">Rerank With Prob</a>
              </li>
            </ul>
            <div className="tab-content">
              <div className="tab-pane fade show active" id="without-rerank">
                {renderJsonContent(data.answer_without_rerank)}
              </div>
              <div className="tab-pane fade" id="rerank-without-prob">
                {renderJsonContent(data.answer_rerank_without_prob)}
              </div>
              <div className="tab-pane fade" id="rerank-with-prob">
                {renderJsonContent(data.answer_rerank_with_prob)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApiResponseViewer;

