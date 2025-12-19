-- Добавляем колонку delivery_company в таблицу orders
ALTER TABLE orders ADD COLUMN IF NOT EXISTS delivery_company VARCHAR(50);