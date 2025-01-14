const API_HOST = process.env.NEXT_PUBLIC_API_HOST || 'http://localhost:5000';

export async function processQuery(
  query: string,
  embeddingId: string,
  llmName: string,
  minSimilarityScore?: number,
  minYesProbabilityThreshold?: number
) {
  try {
    const response = await fetch(`${API_HOST}/api/ask`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        request_id: '123',
        question: query,
        use_case_id_embeddings: parseInt(embeddingId),
        use_case_id_llm: llmName === 'meta-llama/Llama-3.2-3B-Instruct' ? 1 : 2,
        min_similarity_score_doc_retrieval: minSimilarityScore,
        min_similarity_score_doc_retrieval_rerank: minYesProbabilityThreshold,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error processing query:', error);
    throw error;
  }
}

