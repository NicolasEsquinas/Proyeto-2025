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


# -----------------------------
# CONFIG CLOUDINARY
# -----------------------------
cloudinary.config(
    cloud_name="dyfdso8kb",
    api_key="648813154733984",
    api_secret="6IUPsPx4JPi48mSWgyYUBEIa-5M"
)

# Directorio base
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

app = Flask(__name__)

UPLOAD_FOLDER = os.path.join(BASE_DIR, 'uploads')
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'webp'}

# -----------------------------
# CARGA DE MODELOS YOLO
# -----------------------------
modelo_maestro = YOLO(os.path.join(BASE_DIR, "IA/proyec.pt"))
modelo_partes = YOLO(os.path.join(BASE_DIR, "IA/partescuerpo.pt"))

modelos_lesiones = {
    "edema": YOLO(os.path.join(BASE_DIR, "IA/edema.pt")),
    "eritema": YOLO(os.path.join(BASE_DIR, "IA/eritema.pt")),
    "excoriacion": YOLO(os.path.join(BASE_DIR, "IA/excoriacion.pt")),
    "exudacion": YOLO(os.path.join(BASE_DIR, "IA/exudacion.pt")),
    "liquenificacion": YOLO(os.path.join(BASE_DIR, "IA/liquenificacion.pt")),
    "xerosis": YOLO(os.path.join(BASE_DIR, "IA/xerosis.pt")),
}



def allowed_file(filename):
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS


# -----------------------------
# MAPEO DE PARTES DEL CUERPO
# -----------------------------
def clasificar_region(nombre):

    nombre = nombre.lower()

    if nombre in ["head"]:
        return "cabeza"

    if nombre in ["left arm", "left hand"]:
        return "brazo_izquierdo"

    if nombre in ["right arm", "right hand"]:
        return "brazo_derecho"

    if nombre in ["left leg", "left foot"]:
        return "pierna_izquierda"

    if nombre in ["right leg", "right foot"]:
        return "pierna_derecha"

    if nombre in ["chest", "stomach", "hip"]:
        return "torso"

    return None


divisores = {
    "cabeza": 9,
    "brazo_izquierdo": 9,
    "brazo_derecho": 9,
    "torso": 36,
    "pierna_izquierda": 18,
    "pierna_derecha": 18,
}

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

@app.route('/auth/<path:filename>')
def auth_files(filename):
    return send_from_directory(os.path.join(BASE_DIR, 'auth'), filename)

@app.route('/index/<path:filename>')
def index_files(filename):
    return send_from_directory(os.path.join(BASE_DIR, 'index'), filename)

@app.route('/JS/<path:filename>')
def js_files(filename):
    return send_from_directory(os.path.join(BASE_DIR, 'JS'), filename)

@app.route("/procesar", methods=["POST"])
def procesar():

    # -----------------------------------
    # VALIDACIÓN IMAGEN
    # -----------------------------------
    if "imagen" not in request.files:
        return jsonify({"error": "No se subió ninguna imagen"}), 400

    file = request.files["imagen"]

    if file.filename == "":
        return jsonify({"error": "No se seleccionó ninguna imagen"}), 400

    if not allowed_file(file.filename):
        return jsonify({"error": "Tipo de archivo no permitido"}), 400

    # Crear nombre único
    timestamp = int(time.time())
    filename = secure_filename(f"{timestamp}_{file.filename}")
    img_path = os.path.join(UPLOAD_FOLDER, filename)
    file.save(img_path)

    img = cv2.imread(img_path)

    if img is None:
        os.remove(img_path)
        return jsonify({"error": "No se pudo leer la imagen"}), 400

    h, w = img.shape[:2]
    area_total_img = h * w

    # -----------------------------------
    # 1. DETECCIÓN DE PARTES DEL CUERPO
    # -----------------------------------
    partes_res = modelo_partes(img, conf=0.01)[0]

    region_detectada = None

    for box in partes_res.boxes:
        cls = int(box.cls)
        nombre = partes_res.names[cls]
        region_detectada = clasificar_region(nombre)
        if region_detectada:
            break

    if region_detectada is None:
        region_detectada = "torso"  # fallback seguro

    divisor = divisores[region_detectada]

    # -----------------------------------
    # 2. DETECCIÓN GLOBAL DE LESIONES (proyec.pt)
    # -----------------------------------
    maestro = modelo_maestro(img, conf=0.01)[0]

    lesiones_detectadas = {}

    for box in maestro.boxes:
        cls = int(box.cls)
        nombre = maestro.names[cls]

        x1, y1, x2, y2 = map(int, box.xyxy[0])
        recorte = img[y1:y2, x1:x2]

        if recorte.size == 0:
            continue

        if nombre not in modelos_lesiones:
            continue

        modelo_ind = modelos_lesiones[nombre]
        sub_res = modelo_ind(recorte, conf=0.01)[0]

        mejor_severidad = 0

        for sbox in sub_res.boxes:
            sub_cls = int(sbox.cls)
            # nombre clase = por ejemplo "xerosis 3"
            clase_txt = sub_res.names[sub_cls]

            try:
                numero = int(clase_txt.split()[-1])
            except:
                continue

            if numero > mejor_severidad:
                mejor_severidad = numero

        if mejor_severidad > 0:
            lesiones_detectadas[nombre] = mejor_severidad

    # -----------------------------------
    # 3. CALCULO DE SEVERIDAD GLOBAL
    # (la más grave detectada entre todos los modelos)
    # -----------------------------------
    if len(lesiones_detectadas) == 0:
        severidad_global = 1
    else:
        severidad_global = max(lesiones_detectadas.values())

    # -----------------------------------
    # 4. CALCULO DEL PORCENTAJE DEL ÁREA DETECTADA
    # -----------------------------------
    area_lesiones = 0

    for box in maestro.boxes:
        x1, y1, x2, y2 = map(int, box.xyxy[0])
        area_lesiones += (x2 - x1) * (y2 - y1)

    porcentaje_area = (area_lesiones / area_total_img) * 100
    area_relativa = porcentaje_area / divisor

    # -----------------------------------
    # 5. FORMULA FINAL
    # -----------------------------------
    resultado_area_mod = area_relativa / 5
    resultado_severidad_mod = (severidad_global * 7) / 2

    resultado_total = resultado_severidad_mod + resultado_area_mod

    # -----------------------------------
    # 6. SEVERIDAD FINAL SEGÚN RESULTADO_TOTAL
    # -----------------------------------
    if resultado_total < 25:
        severidad_texto = "leve"
    elif 25 <= resultado_total < 50:
        severidad_texto = "moderada"
    else:
        severidad_texto = "grave"

    # -----------------------------------
    # 7. SUBIR IMAGEN A CLOUDINARY
    # -----------------------------------
    upload_result = cloudinary.uploader.upload(img_path, folder="dermascan")
    image_url = upload_result["secure_url"]

    # -----------------------------------
    # 8. ELIMINAR LOCAL
    # -----------------------------------
    os.remove(img_path)

    # -----------------------------------
    # 9. RESPUESTA FINAL
    # -----------------------------------
    return jsonify({
        "severidad": severidad_texto,
        "score": resultado_total,
        "processed_image": image_url
    })


if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5000)
