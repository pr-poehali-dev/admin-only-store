'''
Business: Принимает заказы от покупателей и отправляет email-уведомления
Args: event с httpMethod POST и body с данными заказа
Returns: HTTP response с подтверждением отправки
'''

import json
import os
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from typing import Dict, Any

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
    
    delivery_methods = {
        'pickup': 'Самовывоз',
        'delivery': 'Доставка'
    }
    
    payment_methods = {
        'cash': 'Наличными при получении',
        'card': 'Картой при получении',
        'online': 'Онлайн оплата (СБП)'
    }
    
    email_body = f'''
    <html>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <h2 style="color: #4F46E5;">🎉 Новый заказ!</h2>
        
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
    
    if not gmail_password:
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Email not configured'}),
            'isBase64Encoded': False
        }
    
    msg = MIMEMultipart('alternative')
    msg['Subject'] = f'Новый заказ: {product.get("name", "Товар")}'
    msg['From'] = gmail_user
    msg['To'] = gmail_user
    
    html_part = MIMEText(email_body, 'html')
    msg.attach(html_part)
    
    try:
        with smtplib.SMTP_SSL('smtp.gmail.com', 465) as smtp_server:
            smtp_server.login(gmail_user, gmail_password)
            smtp_server.send_message(msg)
        
        return {
            'statusCode': 200,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'success': True, 'message': 'Order sent successfully'}),
            'isBase64Encoded': False
        }
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': str(e)}),
            'isBase64Encoded': False
        }
