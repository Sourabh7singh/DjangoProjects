# Use Ubuntu as the base image
FROM ubuntu:latest

# Set the working directory
WORKDIR /app

# Install dependencies
RUN apt-get update && \
    apt-get install -y python3 python3-pip && \
    apt-get install -y nodejs npm && \
    apt-get install -y g++ && \
    apt-get install -y clang && \
    apt-get install -y cmake && \
    apt-get clean

# Copy your Django project into the container
COPY . /app

# Install any Python dependencies (if needed)
# RUN pip3 install -r requirements.txt

# Set the default command to bash
CMD ["bash"]

# build enviroment
docker build -t my-django-env .

# run enviroment
docker run -it -v $(pwd):/app my-django-env
