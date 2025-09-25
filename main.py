from flask import Flask, request, jsonify, send_from_directory
from ultralytics import YOLO
import cv2
import numpy as np
import os
from werkzeug.utils import secure_filename
import time

# Directorio base del proyecto
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

app = Flask(__name__)

# Carpeta para guardar imágenes procesadas
UPLOAD_FOLDER = os.path.join(BASE_DIR, 'uploads')
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# Extensiones permitidas
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'webp'}

# Cargar modelos YOLO
try:
    modelo_piel = YOLO('last.pt')      # Modelo para segmentar piel
    modelo_lesiones = YOLO('lesions.pt')  # Modelo para detectar lesiones
except Exception as e:
    print(f"Error al cargar los modelos YOLO: {e}")
    exit(1)


def allowed_file(filename):
    """Verifica si la extensión del archivo está permitida"""
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


# Ruta principal → sirve index.html desde la raíz
@app.route('/')
def index():
    try:
        return send_from_directory(BASE_DIR, 'index.html')
    except Exception as e:
        return jsonify({'error': f'No se pudo encontrar index.html: {str(e)}'}), 404

@app.route('/Css/<path:filename>')
def css_files(filename):
    return send_from_directory(os.path.join(BASE_DIR, 'Css'), filename)

@app.route('/images/<path:filename>')
def image_files(filename):
    return send_from_directory(os.path.join(BASE_DIR, 'images'), filename)

@app.route('/JS/<path:filename>')
def js_files(filename):
    return send_from_directory(os.path.join(BASE_DIR, 'JS'), filename)

# Endpoint para procesar imágenes
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

        # Leer imagen con OpenCV
        img = cv2.imread(img_path)
        if img is None:
            os.remove(img_path)
            return jsonify({'error': 'No se pudo leer la imagen'}), 400

        # Paso 1: Segmentar piel con el primer modelo
        resultados_piel = modelo_piel(img)[0]
        mascara = np.zeros(img.shape[:2], dtype=np.uint8)
        for box in resultados_piel.boxes:
            x1, y1, x2, y2 = map(int, box.xyxy[0])
            mascara[y1:y2, x1:x2] = 255

        # Recortar piel
        solo_piel = cv2.bitwise_and(img, img, mask=mascara)

        # Guardar imagen recortada
        cropped_filename = f"cropped_{filename}"
        cropped_path = os.path.join(app.config['UPLOAD_FOLDER'], cropped_filename)
        cv2.imwrite(cropped_path, solo_piel)

        # Paso 2: Detectar lesiones con el segundo modelo
        resultados_lesiones = modelo_lesiones(solo_piel)[0]
        lesiones = []
        for box in resultados_lesiones.boxes:
            lesion_name = resultados_lesiones.names[int(box.cls)]  # Nombre de la clase
            lesiones.append(lesion_name)

        # Generar texto de resultado
        lesiones_texto = ", ".join(lesiones) if lesiones else "No se detectaron lesiones específicas"

        # Eliminar archivo original
        os.remove(img_path)

        # Respuesta JSON
        return jsonify({
            'lesions': lesiones_texto,
            'processed_image': f'/uploads/{cropped_filename}'
        })

    return jsonify({'error': 'Tipo de archivo no permitido'}), 400


# Ruta para servir imágenes procesadas desde /uploads/
@app.route('/uploads/<filename>')
def uploaded_file(filename):
    try:
        return send_from_directory(app.config['UPLOAD_FOLDER'], filename)
    except Exception as e:
        return jsonify({'error': f'No se pudo encontrar el archivo: {str(e)}'}), 404


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
