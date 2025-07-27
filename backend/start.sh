#!/bin/bash

export PYTHONPATH=$PYTHONPATH:./chatbot
uvicorn chatbot.main:app --host=0.0.0.0 --port=10000
