'''
Business: Управление заказами для администратора - список заказов и отправка сообщений
Args: event с httpMethod GET/POST
Returns: Список всех заказов или результат отправки сообщения
'''

import json
import os
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
        try:
            conn = psycopg2.connect(database_url)
            cur = conn.cursor()
            
            cur.execute('''
                SELECT 
                    o.id, o.order_number, o.product_name, o.customer_name, 
                    o.customer_phone, o.customer_email, o.total_price, 
                    o.status, o.created_at,
                    COUNT(m.id) as message_count
                FROM orders o
                LEFT JOIN order_messages m ON o.id = m.order_id
                GROUP BY o.id
                ORDER BY o.created_at DESC
            ''')
            
            orders = []
            for row in cur.fetchall():
                orders.append({
                    'id': row[0],
                    'orderNumber': row[1],
                    'productName': row[2],
                    'customerName': row[3],
                    'customerPhone': row[4],
                    'customerEmail': row[5],
                    'totalPrice': row[6],
                    'status': row[7],
                    'createdAt': row[8].isoformat(),
                    'messageCount': row[9]
                })
            
            cur.close()
            conn.close()
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'orders': orders}),
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
