import os
import json
import pymysql

def get_db_connection():
    return pymysql.connect(
        host=os.environ['DB_HOST'],        
        user=os.environ['DB_USER'],        
        password=os.environ['DB_PASSWORD'], 
        database=os.environ['DB_NAME'],    
        port=3306,                         
        cursorclass=pymysql.cursors.DictCursor,
        ssl={'ca': '/etc/ssl/certs/ca-certificates.crt'}  
    )

def mix_colors(color1, color2):
    color_set = {color1.lower(), color2.lower()}
    
    if color_set == {"red", "blue"}:
        return "purple"
    elif color_set == {"red", "yellow"}:
        return "orange"
    elif color_set == {"blue", "yellow"}:
        return "green"
    elif color1.lower() == color2.lower():
        return color1
    else:
        return "unknown"

def save_mix(color1, color2, result):
    connection = get_db_connection()
    try:
        with connection.cursor() as cursor:
            sql = "INSERT INTO color_mixes (color1, color2, result) VALUES (%s, %s, %s)"
            cursor.execute(sql, (color1, color2, result))
        connection.commit()
    finally:
        connection.close()

def get_previous_mixes():
    connection = get_db_connection()
    try:
        with connection.cursor() as cursor:
            sql = "SELECT color1, color2, result, timestamp FROM color_mixes ORDER BY timestamp DESC LIMIT 10"
            cursor.execute(sql)
            return cursor.fetchall()
    finally:
        connection.close()

def handler(event, context):
    try:
        if event['httpMethod'] == 'POST':
            data = json.loads(event['body'])
            color1 = data.get('color1')
            color2 = data.get('color2')
            
            if not color1 or not color2:
                return {
                    'statusCode': 400,
                    'body': json.dumps({'error': 'Укажите color1 и color2!'})
                }
            
            result = mix_colors(color1, color2)
            save_mix(color1, color2, result)
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json'},
                'body': json.dumps({
                    'color1': color1,
                    'color2': color2,
                    'result': result
                })
            }
        
        elif event['httpMethod'] == 'GET':
            if event.get('queryStringParameters', {}).get('action') == 'get_mixes':
                mixes = get_previous_mixes()
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json'},
                    'body': json.dumps(mixes, default=str)
                }
            
            return {
                'statusCode': 200,
                'body': 'API для смешивания цветов. Используйте POST /mix.'
            }
    
    except json.JSONDecodeError:
        return {
            'statusCode': 400,
            'body': json.dumps({'error': 'Неверный JSON!'})
        }
    except Exception as e:
        return {
            'statusCode': 500,
            'body': json.dumps({'error': f'Ошибка сервера: {str(e)}'})
        }