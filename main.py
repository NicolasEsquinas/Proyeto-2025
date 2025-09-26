from flask import Flask, request, jsonify, send_from_directory
from ultralytics import YOLO
import cv2
import numpy as np
import os
from werkzeug.utils import secure_filename
import time

import cloudinary
import cloudinary.uploader
import requests
from datetime import datetime


cloudinary.config(
    cloud_name="dyfdso8kb",
    api_key="377875972382137",
    api_secret="veQJjh6odaFlNVHJfpPD8PWFW3g"
)

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
@app.route('/procesar', methods=['POST'])
def procesar_imagen():
    if 'imagen' not in request.files:
        return jsonify({'error': 'No se subió ninguna imagen'}), 400

    file = request.files['imagen']
    if file.filename == '':
        return jsonify({'error': 'No se seleccionó ninguna imagen'}), 400

    if file and allowed_file(file.filename):
        # Generar nombre único
        timestamp = int(time.time())
        filename = secure_filename(f"{timestamp}_{file.filename}")
        img_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(img_path)

        # Leer imagen
        img = cv2.imread(img_path)
        if img is None:
            os.remove(img_path)
            return jsonify({'error': 'No se pudo leer la imagen'}), 400

        # Paso 1: Segmentar piel
        resultados_piel = modelo_piel(img)[0]
        mascara = np.zeros(img.shape[:2], dtype=np.uint8)
        for box in resultados_piel.boxes:
            x1, y1, x2, y2 = map(int, box.xyxy[0])
            mascara[y1:y2, x1:x2] = 255

        solo_piel = cv2.bitwise_and(img, img, mask=mascara)

        # Guardar imagen recortada temporalmente
        cropped_filename = f"cropped_{filename}"
        cropped_path = os.path.join(app.config['UPLOAD_FOLDER'], cropped_filename)
        cv2.imwrite(cropped_path, solo_piel)

        # Paso 2: Detectar lesiones
        resultados_lesiones = modelo_lesiones(solo_piel)[0]
        lesiones = []
        for box in resultados_lesiones.boxes:
            lesion_name = resultados_lesiones.names[int(box.cls)]
            lesiones.append(lesion_name)

        lesiones_texto = ", ".join(lesiones) if lesiones else "No se detectaron lesiones específicas"

        # Paso 3: Subir imagen a Cloudinary
        upload_result = cloudinary.uploader.upload(cropped_path, folder="dermascan")
        image_url = upload_result["secure_url"]

        # Paso 4: Mandar a tu backend (historial)
        try:
            payload = {
                "perfil_id": 1,  # ⚠️ cambiar cuando tengas ID real del usuario
                "imagen": image_url,
                "lesiones": lesiones_texto,
                "fecha": datetime.now().isoformat(),
            }
            requests.post("https://derma-scan-backend.vercel.app/api/historial", json=payload)
        except Exception as e:
            print("Error al enviar al backend:", e)

        # Limpiar archivos locales
        os.remove(img_path)
        os.remove(cropped_path)

        # Respuesta al front
        return jsonify({
            'lesions': lesiones_texto,
            'processed_image': image_url
        })

    return jsonify({'error': 'Tipo de archivo no permitido'}), 400
if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
   