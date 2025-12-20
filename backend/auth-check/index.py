import json
import os
import psycopg2
from typing import Dict, Any, List

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Проверяет пароль администратора и возвращает список заказов
    '''
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
    
    if method == 'POST':
        body_data = json.loads(event.get('body', '{}'))
        password = body_data.get('password', '')
        admin_password = os.environ.get('ADMIN_PASSWORD', '')
        
        is_valid = password == admin_password and len(admin_password) > 0
        
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'valid': is_valid}),
            'isBase64Encoded': False
        }
    
    if method == 'GET':
        conn = psycopg2.connect(os.environ['DATABASE_URL'])
        cursor = conn.cursor()
        
        cursor.execute('''
            SELECT 
                o.id, o.order_number, o.product_name, o.customer_name, 
                o.customer_phone, o.customer_email, o.delivery_method, 
                o.delivery_company, o.delivery_address, o.total_price, 
                o.status, o.created_at,
                COALESCE((SELECT COUNT(*) FROM t_p23352485_admin_only_store.order_messages 
                          WHERE order_number = o.order_number AND is_from_customer = true), 0) as message_count
            FROM t_p23352485_admin_only_store.orders o
            ORDER BY o.created_at DESC
        ''')
        
        conn.commit()
        
        rows = cursor.fetchall()
        orders: List[Dict[str, Any]] = []
        
        for row in rows:
            orders.append({
                'id': row[0],
                'orderNumber': row[1],
                'productName': row[2],
                'customerName': row[3],
                'customerPhone': row[4],
                'customerEmail': row[5],
                'deliveryMethod': row[6],
                'deliveryCompany': row[7],
                'deliveryAddress': row[8],
                'totalPrice': row[9],
                'status': row[10],
                'createdAt': row[11].isoformat() if row[11] else None,
                'messageCount': row[12]
            })
        
        cursor.close()
        conn.close()
        
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'orders': orders}),
            'isBase64Encoded': False
        }
    
    return {
        'statusCode': 405,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        'body': json.dumps({'error': 'Method not allowed'}),
        'isBase64Encoded': False
    }