from flask import Flask, request, jsonify
import numpy as np

app = Flask(__name__)

# Esta es una función de ejemplo para simular el análisis de texto
def analyze_text(text):
    """
    Función que simula el análisis de texto para detectar si fue generado por IA.
    En una implementación real, aquí iría un modelo de NLP entrenado.
    """
    # Simulamos un análisis básico basado en longitud del texto
    text_length = len(text)
    
    # Probabilidad base (esto es solo un ejemplo)
    probability = min(90, max(10, np.random.normal(50, 20)))
    
    return {
        'probability': round(probability, 2),
        'explanation': 'El análisis sugiere que este texto podría haber sido generado por IA basado en patrones lingüísticos.'
    }

@app.route('/analyze', methods=['POST'])
def analyze():
    data = request.get_json()
    text = data.get('text', '')
    
    if not text:
        return jsonify({'error': 'No se proporcionó texto para analizar'}), 400
    
    results = analyze_text(text)
    return jsonify(results)

if __name__ == '__main__':
    app.run(debug=True)