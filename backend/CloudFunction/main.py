import os
import json
import pymysql
from datetime import datetime

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
            sql = "SELECT id, color1, color2, result, timestamp FROM color_mixes ORDER BY timestamp DESC LIMIT 10"
            cursor.execute(sql)
            return cursor.fetchall()
    finally:
        connection.close()

def update_mix(mix_id, color1, color2, result):
    connection = get_db_connection()
    try:
        with connection.cursor() as cursor:
            sql = "UPDATE color_mixes SET color1 = %s, color2 = %s, result = %s WHERE id = %s"
            cursor.execute(sql, (color1, color2, result, mix_id))
        connection.commit()
        return cursor.rowcount > 0
    finally:
        connection.close()

def delete_mix(mix_id):
    connection = get_db_connection()
    try:
        with connection.cursor() as cursor:
            sql = "DELETE FROM color_mixes WHERE id = %s"
            cursor.execute(sql, (mix_id,))
        connection.commit()
        return cursor.rowcount > 0
    finally:
        connection.close()

def build_response(status_code, body, headers=None):
    """Создает стандартизированный ответ с CORS заголовками"""
    default_headers = {
        'Access-Control-Allow-Origin': 'http://84.252.133.27:8080',
        'Access-Control-Allow-Methods': 'POST, GET, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Content-Type': 'application/json'
    }

    if headers:
        default_headers.update(headers)

    return {
        'statusCode': status_code,
        'headers': default_headers,
        'body': json.dumps(body) if isinstance(body, dict) else body
    }

def handler(event, context):
    # Обработка OPTIONS запроса для CORS preflight
    if event.get('httpMethod') == 'OPTIONS':
        return build_response(200, '')

    try:
        # Обработка POST запроса
        if event.get('httpMethod') == 'POST':
            if not event.get('body'):
                return build_response(400, {'error': 'Тело запроса отсутствует'})

            try:
                data = json.loads(event['body'])
            except json.JSONDecodeError:
                return build_response(400, {'error': 'Неверный формат JSON'})

            color1 = data.get('color1')
            color2 = data.get('color2')

            if not color1 or not color2:
                return build_response(400, {'error': 'Необходимо указать оба цвета'})

            result = mix_colors(color1, color2)
            save_mix(color1, color2, result)

            return build_response(200, {
                'color1': color1,
                'color2': color2,
                'result': result
            })

        # Обработка GET запроса
        elif event.get('httpMethod') == 'GET':
            if event.get('queryStringParameters', {}).get('action') == 'get_mixes':
                mixes = get_previous_mixes()
                return build_response(200, mixes, headers={'Content-Type': 'application/json'})

            return build_response(200, {
                'message': 'API для смешивания цветов',
                'usage': 'Отправьте POST запрос с {color1, color2} для смешивания'
            })

        # Обработка PUT запроса (обновление)
        elif event.get('httpMethod') == 'PUT':
            if not event.get('body'):
                return build_response(400, {'error': 'Тело запроса отсутствует'})

            try:
                data = json.loads(event['body'])
            except json.JSONDecodeError:
                return build_response(400, {'error': 'Неверный формат JSON'})

            mix_id = data.get('id')
            color1 = data.get('color1')
            color2 = data.get('color2')

            if not mix_id:
                return build_response(400, {'error': 'Необходимо указать ID записи'})
            if not color1 or not color2:
                return build_response(400, {'error': 'Необходимо указать оба цвета'})

            result = mix_colors(color1, color2)
            updated = update_mix(mix_id, color1, color2, result)

            if not updated:
                return build_response(404, {'error': 'Запись не найдена'})

            return build_response(200, {
                'id': mix_id,
                'color1': color1,
                'color2': color2,
                'result': result,
                'message': 'Запись успешно обновлена'
            })

        # Обработка DELETE запроса
        elif event.get('httpMethod') == 'DELETE':
            if not event.get('body'):
                return build_response(400, {'error': 'Тело запроса отсутствует'})

            try:
                data = json.loads(event['body'])
            except json.JSONDecodeError:
                return build_response(400, {'error': 'Неверный формат JSON'})

            mix_id = data.get('id')

            if not mix_id:
                return build_response(400, {'error': 'Необходимо указать ID записи'})

            deleted = delete_mix(mix_id)

            if not deleted:
                return build_response(404, {'error': 'Запись не найдена'})

            return build_response(200, {
                'id': mix_id,
                'message': 'Запись успешно удалена'
            })

        # Неподдерживаемый метод
        else:
            return build_response(405, {'error': 'Метод не поддерживается'})

    except Exception as e:
        return build_response(500, {'error': f'Внутренняя ошибка сервера: {str(e)}'})