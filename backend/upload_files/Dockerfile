FROM python:3.10
RUN mkdir /upload_image
WORKDIR /upload_image
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
CMD gunicorn main:app --workers 1 --worker-class uvicorn.workers.UvicornWorker --bind=0.0.0.0:8000
EXPOSE 8000