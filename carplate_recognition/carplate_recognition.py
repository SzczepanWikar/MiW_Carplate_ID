import cv2
from fastapi import HTTPException
from matplotlib import pyplot as plt
import easyocr
import re
import numpy as np

async def recognize(file):
    rois = await detect_car_plate_candidates(file)
    plate_number = await get_car_plate_content(rois)

    return plate_number


async def get_cv2_image(file):
    if file.content_type.split('/')[0] != 'image':
        raise HTTPException(status_code=400, detail='File is not image.')

    contents = await file.read()
    nparr = np.frombuffer(contents, np.uint8)

    return cv2.imdecode(nparr, cv2.IMREAD_COLOR)


def get_rois(plates, img_gray):
    img_rois = []
    for (x,y,w,h) in plates:
        cv2.rectangle(img_gray, (x,y), (x+w, y+h), (0,255,0), 2)
        cv2.putText(img_gray, "Number Plate", (x,y-5), cv2.FONT_HERSHEY_COMPLEX_SMALL, 1, (255, 0, 255), 2)

        img_roi = img_gray[y: y+h, x:x+w]
        img_rois.append(img_roi)
        plt.imshow(img_roi, cmap='gray')

    return img_rois


async def get_car_plate_content(rois):
    reader = easyocr.Reader(['pl', 'en'])

    car_plate_content = await read_car_plates_content(reader, rois)
    car_plate = select_first_valid_car_plate(car_plate_content)

    return car_plate


async def read_car_plates_content(reader, rois):
    car_plate_content = []
    for img_roi in rois:
        output = reader.readtext(img_roi)
        car_plate_content.append(output)

    flattened_list = [item[1] for sublist in car_plate_content for item in sublist]

    return flattened_list


async def detect_car_plate_candidates(file):
    haarcascade = "model/haarcascade_russian_plate_number.xml"
    plate_cascade = cv2.CascadeClassifier(haarcascade)
    img = await get_cv2_image(file)
    img_gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    plates = plate_cascade.detectMultiScale(img_gray, 1.1, 4)
    rois = get_rois(plates, img_gray)

    return rois

def select_first_valid_car_plate(car_plate_content):
        license_plate_pattern = re.compile(
        r'^(?:[A-Z]{2}\d{4,5}[A-Z]{0,1}|[A-Z]{3}\d{4}[A-Z]{2}|[A-Z]{1}[A-Z0-9]{1,2}\d{4,5}|[A-Z]{2}[A-Z0-9]{1,3}\d{2,4}|[A-Z]{2}\s\d{4,5}[A-Z]{0,1}|[A-Z]{3}\s\d{4}[A-Z]{2}|[A-Z]{1}\s[A-Z0-9]{1,2}\s\d{4,5}|[A-Z]{2}\s[A-Z0-9]{1,3}\s\d{2,4})$')

        for txt in car_plate_content:
            if license_plate_pattern.match(txt):
                return txt

