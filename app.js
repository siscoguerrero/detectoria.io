document.getElementById('analyze-btn').addEventListener('click', async () => {
    const text = document.getElementById('text-input').value;
    if (!text.trim()) {
        alert('Por favor ingresa texto para analizar');
        return;
    }

    try {
        const response = await fetch('/analyze', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ text })
        });
        
        const data = await response.json();
        displayResults(data);
    } catch (error) {
        console.error('Error:', error);
        document.getElementById('results').innerHTML = 
            '<div class="error">Error al analizar el texto. Intenta nuevamente.</div>';
    }
});

function displayResults(data) {
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = `
        <div class="result">
            <h3>Resultados del análisis:</h3>
            <p>Probabilidad de ser generado por IA: <strong>${data.probability}%</strong></p>
            <p>${data.explanation}</p>
        </div>
    `;
}