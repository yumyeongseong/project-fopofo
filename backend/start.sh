#!/bin/bash
export PYTHONPATH=$PYTHONPATH:$(pwd)/backend/chatbot
uvicorn main:app --host=0.0.0.0 --port=10000
