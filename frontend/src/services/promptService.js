import axios from 'axios';

export async function generatePrompt(formData, backendUrl, settings = {}) {
  const { task, inputs, structure } = formData;
  const { apiKey, provider } = settings;
  
  try {
    const response = await axios.post(`${backendUrl}/api/generate-prompt`, {
      task,
      inputs,
      structure,
      api_key: apiKey || null,
      provider: provider || 'openai',
    });
    
    return {
      prompt: response.data.prompt,
      provider_used: response.data.provider_used,
    };
  } catch (error) {
    console.error('Error generating prompt:', error);
    throw error;
  }
}
