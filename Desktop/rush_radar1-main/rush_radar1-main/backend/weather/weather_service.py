import requests

API_KEY = "098c544a778f12d8ccbfdf00a210932"

def get_weather(city):

    try:
        url = f"https://api.openweathermap.org/data/2.5/weather?q={city},IN&appid={API_KEY}"

        response = requests.get(url)
        data = response.json()

        weather = data["weather"][0]["main"]

        if weather in ["Rain", "Thunderstorm"]:
            return "RAIN"

        elif weather in ["Clouds"]:
            return "CLOUDY"

        else:
            return "CLEAR"

    except:
        return "CLEAR"