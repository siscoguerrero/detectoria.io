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
    
    // Crear gráfico de probabilidad
    const chartHtml = `
        <canvas id="probabilityChart" width="400" height="200"></canvas>
        <canvas id="metricsChart" width="400" height="200"></canvas>
    `;
    
    // Mostrar resultados detallados
    let sectionsHtml = '';
    if(data.sections && data.sections.length > 0) {
        sectionsHtml = '<h4>Análisis por secciones:</h4>';
        data.sections.forEach((section, index) => {
            sectionsHtml += `
                <div class="section">
                    <p><strong>Sección ${index + 1}:</strong> ${section.probability}% probabilidad IA</p>
                    <p class="section-text">${section.text}</p>
                </div>
            `;
        });
    }
    
    resultsDiv.innerHTML = `
        <div class="result">
            <h3>Resultados del análisis:</h3>
            <p>Probabilidad: <strong>${data.probability}%</strong> (${data.label})</p>
            <p>Perplexity: ${data.perplexity}</p>
            <p>Burstiness: ${data.burstiness}</p>
            <p>${data.explanation}</p>
            ${chartHtml}
            ${sectionsHtml}
        </div>
    `;
    
    // Inicializar gráficos con Chart.js
    initCharts(data);
}

function initCharts(data) {
    // Gráfico de probabilidad
    const ctx1 = document.getElementById('probabilityChart').getContext('2d');
    new Chart(ctx1, {
        type: 'bar',
        data: {
            labels: ['Probabilidad IA'],
            datasets: [{
                label: 'Probabilidad',
                data: [data.probability],
                backgroundColor: 'rgba(54, 162, 235, 0.5)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100
                }
            }
        }
    });
    
    // Gráfico de métricas
    const ctx2 = document.getElementById('metricsChart').getContext('2d');
    new Chart(ctx2, {
        type: 'radar',
        data: {
            labels: ['Perplexity', 'Burstiness'],
            datasets: [{
                label: 'Métricas',
                data: [data.perplexity, data.burstiness],
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                borderColor: 'rgba(255, 99, 132, 1)',
                pointBackgroundColor: 'rgba(255, 99, 132, 1)',
                pointBorderColor: '#fff',
                pointHoverBackgroundColor: '#fff',
                pointHoverBorderColor: 'rgba(255, 99, 132, 1)'
            }]
        },
        options: {
            scales: {
                r: {
                    angleLines: {
                        display: true
                    },
                    suggestedMin: 0,
                    suggestedMax: 10
                }
            }
        }
    });
}