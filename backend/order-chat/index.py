'''
Business: Управляет чатом между покупателем и продавцом по конкретному заказу
Args: event с httpMethod GET/POST и параметрами order_number, message
Returns: Список сообщений или подтверждение отправки с уведомлениями
'''

import json
import os
import smtplib
import urllib.request
import urllib.parse
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
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    database_url = os.environ.get('DATABASE_URL', '')
    
    if not database_url:
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Database not configured'}),
            'isBase64Encoded': False
        }
    
    if method == 'GET':
        params = event.get('queryStringParameters', {}) or {}
        order_number = params.get('orderNumber', '')
        
        if not order_number:
            return {
                'statusCode': 400,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'Order number required'}),
                'isBase64Encoded': False
            }
        
        try:
            conn = psycopg2.connect(database_url)
            cur = conn.cursor()
            
            cur.execute('SELECT id, product_name, customer_name, status, created_at FROM orders WHERE order_number = %s', (order_number,))
            order_row = cur.fetchone()
            
            if not order_row:
                cur.close()
                conn.close()
                return {
                    'statusCode': 404,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Order not found'}),
                    'isBase64Encoded': False
                }
            
            order_id = order_row[0]
            
            cur.execute('''
                SELECT sender_type, message_text, created_at 
                FROM order_messages 
                WHERE order_id = %s 
                ORDER BY created_at ASC
            ''', (order_id,))
            
            messages = []
            for row in cur.fetchall():
                messages.append({
                    'sender': row[0],
                    'text': row[1],
                    'timestamp': row[2].isoformat()
                })
            
            cur.close()
            conn.close()
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({
                    'order': {
                        'number': order_number,
                        'productName': order_row[1],
                        'customerName': order_row[2],
                        'status': order_row[3]
                    },
                    'messages': messages
                }),
                'isBase64Encoded': False
            }
            
        except Exception as e:
            return {
                'statusCode': 500,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': str(e)}),
                'isBase64Encoded': False
            }
    
    if method == 'POST':
        body_data = json.loads(event.get('body', '{}'))
        order_number = body_data.get('orderNumber', '')
        message_text = body_data.get('message', '')
        sender_type = body_data.get('sender', 'customer')
        
        if not order_number or not message_text:
            return {
                'statusCode': 400,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'Order number and message required'}),
                'isBase64Encoded': False
            }
        
        try:
            conn = psycopg2.connect(database_url)
            cur = conn.cursor()
            
            cur.execute('''
                SELECT id, customer_email, customer_phone, customer_name, product_name 
                FROM orders 
                WHERE order_number = %s
            ''', (order_number,))
            
            order_row = cur.fetchone()
            
            if not order_row:
                cur.close()
                conn.close()
                return {
                    'statusCode': 404,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Order not found'}),
                    'isBase64Encoded': False
                }
            
            order_id = order_row[0]
            customer_email = order_row[1]
            customer_phone = order_row[2]
            customer_name = order_row[3]
            product_name = order_row[4]
            
            cur.execute('''
                INSERT INTO order_messages (order_id, sender_type, message_text)
                VALUES (%s, %s, %s)
            ''', (order_id, sender_type, message_text))
            
            conn.commit()
            cur.close()
            conn.close()
            
            if sender_type == 'admin':
                if customer_email:
                    gmail_user = 'danilaanikanov4107@gmail.com'
                    gmail_password = os.environ.get('GMAIL_APP_PASSWORD', '')
                    
                    if gmail_password:
                        try:
                            email_body = f'''
                            <html>
                              <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                                <h2 style="color: #4F46E5;">💬 Новое сообщение по заказу #{order_number}</h2>
                                <p>Здравствуйте, {customer_name}!</p>
                                <p>Вам пришло новое сообщение по вашему заказу <strong>{product_name}</strong>:</p>
                                <blockquote style="background: #f5f5f5; padding: 15px; border-left: 4px solid #4F46E5; margin: 20px 0;">
                                  {message_text}
                                </blockquote>
                              </body>
                            </html>
                            '''
                            
                            msg = MIMEMultipart('alternative')
                            msg['Subject'] = f'Новое сообщение по заказу #{order_number}'
                            msg['From'] = gmail_user
                            msg['To'] = customer_email
                            
                            html_part = MIMEText(email_body, 'html')
                            msg.attach(html_part)
                            
                            with smtplib.SMTP_SSL('smtp.gmail.com', 465) as smtp_server:
                                smtp_server.login(gmail_user, gmail_password)
                                smtp_server.send_message(msg)
                        except Exception as e:
                            pass
                
                if customer_phone:
                    sms_api_key = os.environ.get('SMS_API_KEY', '')
                    
                    if sms_api_key:
                        try:
                            phone_clean = ''.join(filter(str.isdigit, customer_phone))
                            sms_text = f'Новое сообщение по заказу #{order_number}: {message_text[:100]}'
                            
                            url = 'https://sms.ru/sms/send'
                            data = urllib.parse.urlencode({
                                'api_id': sms_api_key,
                                'to': phone_clean,
                                'msg': sms_text,
                                'json': 1
                            }).encode()
                            
                            req = urllib.request.Request(url, data=data)
                            urllib.request.urlopen(req)
                        except Exception as e:
                            pass
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'success': True}),
                'isBase64Encoded': False
            }
            
        except Exception as e:
            return {
                'statusCode': 500,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': str(e)}),
                'isBase64Encoded': False
            }
    
    return {
        'statusCode': 405,
        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({'error': 'Method not allowed'}),
        'isBase64Encoded': False
    }
