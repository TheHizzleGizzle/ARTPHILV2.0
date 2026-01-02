import axios from 'axios';

export async function generatePrompt(formData, backendUrl) {
  const { task, inputs, structure } = formData;
  
  try {
    const response = await axios.post(`${backendUrl}/api/generate-prompt`, {
      task,
      inputs,
      structure,
    });
    
    return response.data.prompt;
  } catch (error) {
    console.error('Error generating prompt:', error);
    throw error;
  }
}
