"""
Extensiones de Flask
Aquí se inicializan las extensiones para evitar imports circulares
"""
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()