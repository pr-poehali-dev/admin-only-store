-- Таблица заказов
CREATE TABLE IF NOT EXISTS orders (
  id SERIAL PRIMARY KEY,
  order_number VARCHAR(50) UNIQUE NOT NULL,
  product_id VARCHAR(50) NOT NULL,
  product_name VARCHAR(255) NOT NULL,
  product_price DECIMAL(10, 2) NOT NULL,
  product_image TEXT,
  
  customer_name VARCHAR(255) NOT NULL,
  customer_phone VARCHAR(50) NOT NULL,
  customer_email VARCHAR(255),
  
  delivery_method VARCHAR(50) NOT NULL,
  delivery_company VARCHAR(50),
  delivery_address TEXT,
  
  payment_method VARCHAR(50) NOT NULL,
  comment TEXT,
  
  total_price DECIMAL(10, 2) NOT NULL,
  status VARCHAR(50) DEFAULT 'new',
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Таблица сообщений
CREATE TABLE IF NOT EXISTS messages (
  id SERIAL PRIMARY KEY,
  order_number VARCHAR(50) NOT NULL,
  sender_type VARCHAR(20) NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Индексы для быстрого поиска
CREATE INDEX IF NOT EXISTS idx_orders_number ON orders(order_number);
CREATE INDEX IF NOT EXISTS idx_messages_order ON messages(order_number);
CREATE INDEX IF NOT EXISTS idx_messages_read ON messages(is_read);
CREATE INDEX IF NOT EXISTS idx_orders_created ON orders(created_at DESC);