-- Esquema para la app "Rúbrica de evaluación de proyectos productivos"
-- Ejecuta este archivo una sola vez en tu servidor MySQL:
--   mysql -u root -p < schema.sql

CREATE DATABASE IF NOT EXISTS rubrica_evaluacion
  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE rubrica_evaluacion;

-- Tabla genérica de almacenamiento clave-valor.
-- Aquí se guardan tanto la configuración (equipos, jurados, criterios, logo)
-- como cada evaluación registrada, igual que hacía window.storage en claude.ai.
CREATE TABLE IF NOT EXISTS kv_store (
  k VARCHAR(255) NOT NULL,
  shared TINYINT(1) NOT NULL DEFAULT 1,
  v LONGTEXT,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (k, shared)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
