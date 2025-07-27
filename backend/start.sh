#!/bin/bash
export PYTHONPATH=.
uvicorn chatbot.main:app --host=0.0.0.0 --port=10000
