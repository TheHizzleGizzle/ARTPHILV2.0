import axios from 'axios';

export async function generatePrompt(formData, backendUrl, settings = {}) {
  const { task, inputs, structure } = formData;
  const { apiKey, provider, model, customModel } = settings;
  
  // Determine the model to use - custom model takes priority
  const modelToUse = customModel || model || null;
  
  try {
    const response = await axios.post(`${backendUrl}/api/generate-prompt`, {
      task,
      inputs,
      structure,
      api_key: apiKey || null,
      provider: provider || 'openai',
      model: modelToUse,
    });
    
    return {
      prompt: response.data.prompt,
      provider_used: response.data.provider_used,
      model_used: response.data.model_used,
    };
  } catch (error) {
    console.error('Error generating prompt:', error);
    throw error;
  }
}
