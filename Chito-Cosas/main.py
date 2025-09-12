from flask import Flask, request, jsonify, send_from_directory
from ultralytics import YOLO
import cv2
import numpy as np
import os
from werkzeug.utils import secure_filename
import time

app = Flask(__name__)

# Configuración
UPLOAD_FOLDER = 'static/uploads'
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'webp'}

# Cargar el modelo YOLO
modelo = YOLO('last.pt')

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/')
def index():
    return send_from_directory('templates', 'index.html')

@app.route('/procesar', methods=['POST'])
def procesar_imagen():
    if 'imagen' not in request.files:
        return jsonify({'error': 'No se subió ninguna imagen'}), 400

    file = request.files['imagen']
    if file.filename == '':
        return jsonify({'error': 'No se seleccionó ninguna imagen'}), 400

    if file and allowed_file(file.filename):
        # Generar nombre único para evitar colisiones
        timestamp = int(time.time())
        filename = secure_filename(f"{timestamp}_{file.filename}")
        img_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(img_path)

        # Leer imagen
        img = cv2.imread(img_path)
        if img is None:
            os.remove(img_path)
            return jsonify({'error': 'No se pudo leer la imagen'}), 400

        # Procesar con YOLO
        resultados = modelo(img)[0]

        # Crear máscara
        mascara = np.zeros(img.shape[:2], dtype=np.uint8)
        confidence = 0
        for box in resultados.boxes:
            x1, y1, x2, y2 = map(int, box.xyxy[0])
            mascara[y1:y2, x1:x2] = 255
            confidence = max(confidence, float(box.conf))  # Confianza máxima

        # Aplicar máscara
        solo_piel = cv2.bitwise_and(img, img, mask=mascara)

        # Guardar imagen procesada
        processed_filename = f"processed_{filename}"
        processed_path = os.path.join(app.config['UPLOAD_FOLDER'], processed_filename)
        cv2.imwrite(processed_path, solo_piel)

        # Estimar severidad e inflamación (lógica simulada basada en confianza y área)
        area = np.sum(mascara == 255)
        total_area = img.shape[0] * img.shape[1]
        severity = min(100, int((area / total_area) * 200))  # Ejemplo: proporcional al área segmentada
        inflammation = min(100, int(confidence * 100))  # Ejemplo: proporcional a confianza

        # Determinar diagnóstico
        diagnosis = "Dermatitis Atópica" if confidence > 0.5 else "Condición no identificada"
        diagnosis_details = "Probabilidad alta basada en las características visuales" if confidence > 0.5 else "No se detectaron características claras de dermatitis"

        # Limpiar archivo original
        os.remove(img_path)

        # Respuesta JSON
        return jsonify({
            'confidence': confidence,
            'processed_image': f'/static/uploads/{processed_filename}',
            'diagnosis': diagnosis,
            'diagnosis_details': diagnosis_details,
            'severity': severity,
            'inflammation': inflammation
        })

    return jsonify({'error': 'Tipo de archivo no permitido'}), 400

@app.route('/static/uploads/<filename>')
def uploaded_file(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)