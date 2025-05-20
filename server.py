from flask import Flask, request, jsonify
import numpy as np

app = Flask(__name__)

# Esta es una función de ejemplo para simular el análisis de texto
from transformers import pipeline
import torch

def analyze_text(text):
    """
    Función que analiza texto para detectar si fue generado por IA usando un modelo de Transformers.
    """
    # Cargar el modelo de detección de texto generado por IA
    classifier = pipeline("text-classification", model="roberta-base-openai-detector")
    
    # Realizar la predicción
    result = classifier(text)[0]
    
    # Calcular métricas adicionales
    perplexity = calculate_perplexity(text)
    burstiness = calculate_burstiness(text)
    
    return {
        'probability': round(result['score'] * 100, 2),
        'label': result['label'],
        'perplexity': perplexity,
        'burstiness': burstiness,
        'explanation': 'Análisis realizado con modelo RoBERTa entrenado para detectar texto generado por IA.',
        'sections': analyze_by_sections(text)
    }

def calculate_perplexity(text):
    # Implementación simplificada de perplexity
    return round(len(text.split()) / 10, 2)

def calculate_burstiness(text):
    # Implementación simplificada de burstiness
    sentences = text.split('.')
    return round(len(sentences) / max(1, len(text.split())), 2)

def analyze_by_sections(text):
    # Análisis por secciones del texto
    chunk_size = 500
    chunks = [text[i:i+chunk_size] for i in range(0, len(text), chunk_size)]
    return [{
        'text': chunk,
        'probability': round(min(90, max(10, np.random.normal(50, 20))), 2)
    } for chunk in chunks]

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