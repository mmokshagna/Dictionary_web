const form = document.querySelector('form');
const resultDiv = document.querySelector('.result');

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const word = form.elements[0].value;
    await getWordInfo(word);
});

const getWordInfo = async (word) => {
    try {
        const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
        const data = await response.json();

        if (data && data.length > 0) {
            const wordData = data[0];
            const meanings = wordData.meanings;
            
            if (meanings && meanings.length > 0) {
                const firstMeaning = meanings[0];
                const partOfSpeech = firstMeaning.partOfSpeech;
                const definitions = firstMeaning.definitions;

                let htmlContent = `
                    <h2><strong>Word:</strong> ${wordData.word}</h2>
                    <p class="partOfSpeech">${partOfSpeech}</p>
                    <p><strong>Meaning:</strong> ${definitions && definitions.length > 0 ? definitions[0].definition : 'Not Found'}</p>
                `;

                if (definitions && definitions.length > 0 && definitions[0].antonyms && definitions[0].antonyms.length > 0) {
                    htmlContent += '<ul>';
                    definitions[0].antonyms.forEach(antonym => {
                        htmlContent += `<li>${antonym}</li>`;
                    });
                    htmlContent += '</ul>';
                }

                resultDiv.innerHTML = htmlContent;
                console.log(data);
            } else {
                resultDiv.innerHTML = `<p>No meanings found for ${word}</p>`;
            }
        } else {
            resultDiv.innerHTML = `<p>No data found for ${word}</p>`;
        }
    } catch (error) {
        console.error('Error fetching word info:', error);
        resultDiv.innerHTML = `<p>Error fetching data. Please try again later.</p>`;
    }
};
