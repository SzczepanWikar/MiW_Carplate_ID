from fastapi import FastAPI, UploadFile
from carplate_recognition import recognize

app = FastAPI()


@app.get("/")
def read_root():
    return "Car plate recognition API is working!"


@app.post("/recognize")
async def recognize_car_plate(file: UploadFile):
    res = await recognize(file)
    return res
