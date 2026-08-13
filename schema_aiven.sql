-- Esquema para la app "Rúbrica de evaluación de proyectos productivos"
-- Versión para Aiven: usa la base "defaultdb" que Aiven ya crea automáticamente,
-- en vez de crear una base nueva (el plan gratuito no lo permite).
--
-- No necesitas ejecutar esto desde la línea de comandos: puedes pegarlo
-- directamente en la pestaña "Query editor" / "SQL" del panel de Aiven.

CREATE TABLE IF NOT EXISTS kv_store (
  k VARCHAR(255) NOT NULL,
  shared TINYINT(1) NOT NULL DEFAULT 1,
  v LONGTEXT,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (k, shared)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
