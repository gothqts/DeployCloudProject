async function mixColors(color1: string, color2: string) {
    const resp = await fetch(
        'https://functions.yandexcloud.net/d4e5bpr3h8tomqfu4e4a', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({color1: color1, color2: color2}),
        });
    return resp.json();
}

const selectColorsApi = {
    mixColors
};

export default selectColorsApi;