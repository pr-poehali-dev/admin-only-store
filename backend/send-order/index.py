'''
Business: Принимает заказы от покупателей, сохраняет в БД и отправляет email-уведомления
Args: event с httpMethod POST и body с данными заказа
Returns: HTTP response с номером заказа для доступа к чату
'''

import json
import os
import smtplib
import secrets
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from typing import Dict, Any
import psycopg2

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    if method != 'POST':
        return {
            'statusCode': 405,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Method not allowed'}),
            'isBase64Encoded': False
        }
    
    body_data = json.loads(event.get('body', '{}'))
    
    product = body_data.get('product', {})
    customer = body_data.get('customer', {})
    total_price = body_data.get('totalPrice', 0)
    
    order_number = 'ORD-' + secrets.token_hex(6).upper()
    
    database_url = os.environ.get('DATABASE_URL', '')
    
    if not database_url:
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Database not configured'}),
            'isBase64Encoded': False
        }
    
    try:
        conn = psycopg2.connect(database_url)
        cur = conn.cursor()
        
        cur.execute('''
            INSERT INTO orders (
                order_number, product_id, product_name, product_price,
                customer_name, customer_phone, customer_email,
                delivery_method, delivery_company, delivery_address, payment_method,
                total_price, comment, status
            ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
        ''', (
            order_number,
            product.get('id', ''),
            product.get('name', ''),
            product.get('price', 0),
            customer.get('name', ''),
            customer.get('phone', ''),
            customer.get('email', ''),
            customer.get('deliveryMethod', 'pickup'),
            customer.get('deliveryCompany', 'none'),
            customer.get('address', ''),
            customer.get('paymentMethod', 'cash'),
            total_price,
            customer.get('comment', ''),
            'new'
        ))
        
        conn.commit()
        cur.close()
        conn.close()
        
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': f'Database error: {str(e)}'}),
            'isBase64Encoded': False
        }
    
    delivery_methods = {
        'pickup': 'Самовывоз',
        'delivery': 'Доставка'
    }
    
    delivery_companies = {
        'cdek': 'СДЭК',
        'boxberry': 'Boxberry',
        'pochta': 'Почта России',
        'dpd': 'DPD',
        'yandex': 'Яндекс Доставка',
        'none': 'Своя служба доставки'
    }
    
    payment_methods = {
        'cash': 'Наличными при получении',
        'card': 'Картой при получении',
        'online': 'Онлайн оплата (СБП)'
    }
    
    email_body = f'''
    <html>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <h2 style="color: #4F46E5;">🎉 Новый заказ #{order_number}</h2>
        
        <h3>Товар:</h3>
        <p>
          <strong>{product.get('name', 'Неизвестно')}</strong><br>
          Цена: <strong>{product.get('price', 0)} ₽</strong>
        </p>
        
        <h3>Покупатель:</h3>
        <p>
          Имя: <strong>{customer.get('name', 'Не указано')}</strong><br>
          Телефон: <strong>{customer.get('phone', 'Не указан')}</strong><br>
          Email: {customer.get('email', 'Не указан')}
        </p>
        
        <h3>Доставка:</h3>
        <p>
          <strong>{delivery_methods.get(customer.get('deliveryMethod', 'pickup'), 'Самовывоз')}</strong>
        </p>
        {f"<p>Транспортная компания: <strong>{delivery_companies.get(customer.get('deliveryCompany', 'none'), 'Не выбрана')}</strong></p>" if customer.get('deliveryMethod') == 'delivery' else ''}
        {f"<p>Адрес: {customer.get('address', '')}</p>" if customer.get('address') else ''}
        
        <h3>Оплата:</h3>
        <p><strong>{payment_methods.get(customer.get('paymentMethod', 'cash'), 'Наличными')}</strong></p>
        
        {f"<h3>Комментарий:</h3><p>{customer.get('comment', '')}</p>" if customer.get('comment') else ''}
        
        <hr style="margin: 20px 0; border: none; border-top: 1px solid #ddd;">
        <h3>Итого: <span style="color: #4F46E5;">{total_price} ₽</span></h3>
      </body>
    </html>
    '''
    
    gmail_user = 'danilaanikanov4107@gmail.com'
    gmail_password = os.environ.get('GMAIL_APP_PASSWORD', '')
    
    if gmail_password:
        try:
            msg = MIMEMultipart('alternative')
            msg['Subject'] = f'Новый заказ #{order_number}: {product.get("name", "Товар")}'
            msg['From'] = gmail_user
            msg['To'] = gmail_user
            
            html_part = MIMEText(email_body, 'html')
            msg.attach(html_part)
            
            with smtplib.SMTP_SSL('smtp.gmail.com', 465) as smtp_server:
                smtp_server.login(gmail_user, gmail_password)
                smtp_server.send_message(msg)
        except Exception as e:
            pass
    
    return {
        'statusCode': 200,
        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({'success': True, 'orderNumber': order_number}),
        'isBase64Encoded': False
    }