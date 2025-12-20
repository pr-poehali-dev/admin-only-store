import json
import os
import psycopg2
from typing import Dict, Any, List

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Проверяет пароль администратора, возвращает список заказов и обновляет статусы
    GET: получить список заказов или конкретный заказ
    POST: проверка пароля или обновление статуса
    PUT: обновление статуса заказа
    '''
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    if method == 'POST':
        body_data = json.loads(event.get('body', '{}'))
        
        if 'password' in body_data:
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
        
        if 'orderId' in body_data and 'status' in body_data:
            conn = psycopg2.connect(os.environ['DATABASE_URL'])
            cursor = conn.cursor()
            
            cursor.execute('''
                UPDATE t_p23352485_admin_only_store.orders
                SET status = %s
                WHERE id = %s
            ''', (body_data['status'], body_data['orderId']))
            
            conn.commit()
            cursor.close()
            conn.close()
            
            return {
                'statusCode': 200,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'success': True}),
                'isBase64Encoded': False
            }
    
    if method == 'GET':
        conn = psycopg2.connect(os.environ['DATABASE_URL'])
        cursor = conn.cursor()
        
        query_params = event.get('queryStringParameters', {})
        order_number = query_params.get('orderNumber', '')
        
        if order_number:
            cursor.execute('''
                SELECT 
                    id, order_number, product_name, customer_name, 
                    customer_phone, customer_email, delivery_method, 
                    delivery_company, delivery_address, total_price, 
                    status, created_at
                FROM t_p23352485_admin_only_store.orders
                WHERE order_number = %s
            ''', (order_number,))
            
            row = cursor.fetchone()
            cursor.close()
            conn.close()
            
            if not row:
                return {
                    'statusCode': 404,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'body': json.dumps({'error': 'Order not found'}),
                    'isBase64Encoded': False
                }
            
            order = {
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
            }
            
            return {
                'statusCode': 200,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'order': order}),
                'isBase64Encoded': False
            }
        
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