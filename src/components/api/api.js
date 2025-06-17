// Using fetch API
export const translateText = async (text, targetLanguage) => {
   try {
      const response = await fetch('http://localhost:5000/', {
         method: 'POST',
         headers: {
            'Content-Type': 'application/json',
         },
         body: JSON.stringify({
            text: text,
            targetLanguage: targetLanguage,
            // Add other parameters your endpoint expects
         }),
      });

      if (!response.ok) {
         throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.translatedText; // Adjust based on your response structure
   } catch (error) {
      console.error('Translation failed:', error);
      throw error;
   }
};
