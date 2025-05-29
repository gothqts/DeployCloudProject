Настройте переменные окружения:

Ключ		Значение
DB_HOST	rc1a-xxxxxx.mdb.yandexcloud.net
DB_USER	"имя"
DB_PASSWORD	"пароль"
DB_NAME	"название бд MySQL"



Примеры запросов Postman
1. Смешать цвета
POST https://"api-gateway"/mix
Content-Type: application/json

{
    "color1": "red",
    "color2": "blue"
}

Ответ:
{
    "color1": "red",
    "color2": "blue",
    "result": "purple"
}

2. Получить историю смешиваний
GET https://"api-gateway"/mixes?action=get_mixes
Ответ:
[
    {
        "color1": "red",
        "color2": "blue",
        "result": "purple",
        "timestamp": "2023-10-01 12:00:00"
    }
]

3. Изменить mix
PUT https://"api-gateway"/mixes
{
    "id": 1,
    "color1": "blue",
    "color2": "red"
}
Ответ:
[
    {
        {
            "id": 1,
            "color1": "blue",
            "color2": "red",
            "result": "purple",
        }
    }
]

4. Удалить mix
DELETE https://"api-gateway"/mixes

{
    "id": 1,
}

Ответ:
[
  {
      "id": 1,
  }
]