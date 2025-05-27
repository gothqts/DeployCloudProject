async function fetchHistory() {
    const resp = await fetch(
        'https://functions.yandexcloud.net/d4e5bpr3h8tomqfu4e4a?action=get_mixes', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
        });
    return resp.json();
}

const resultApi = {
    fetchHistory,
};

export default resultApi;