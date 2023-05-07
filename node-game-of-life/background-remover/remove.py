import sys
import os
import io
sys.path.insert(0, "/Users/jackli/.pyenv/versions/3.10.11/lib/python3.10/site-packages")

import boto3
import cv2
import numpy as np
from PIL import Image
from rembg import remove

KEY=sys.argv[1]
BUCKET=sys.argv[2]
ACCESS_KEY=sys.argv[3]
SECRET_KEY=sys.argv[4]

s3 = boto3.client('s3', aws_access_key_id=ACCESS_KEY,
                      aws_secret_access_key=SECRET_KEY)
def image_from_s3():
    image_from_s3_data = s3.get_object(Bucket=BUCKET, Key=KEY)['Body'].read()
    image_from_s3 = Image.open(io.BytesIO(image_from_s3_data))
    return image_from_s3

def image_to_s3(output):
    image_to_s3_data = io.BytesIO()
    output.save(image_to_s3_data, format='PNG')
    image_to_s3_data = image_to_s3_data.getvalue()
    s3.put_object(Body=image_to_s3_data, Bucket=BUCKET, Key=KEY, ContentType='image/png')

if __name__ == "__main__":
    input_img = image_from_s3()
    try:
        output_img = remove(input_img)
    except:
        print("error")
    else:
        image_to_s3(output_img)
    finally:
        input_img.close()
        output_img.close()
