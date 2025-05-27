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

async function deleteMix(id: number) {
    const resp = await fetch(
        'https://functions.yandexcloud.net/d4e5bpr3h8tomqfu4e4a', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({id})
        }
    )
    return resp.json();
}
async function updateMix(id: number, color1: string, color2: string) {
    const resp = await fetch(
        'https://functions.yandexcloud.net/d4e5bpr3h8tomqfu4e4a', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({id, color1, color2})
        }
    );
    return resp.json();
}

const resultApi = {
    fetchHistory,
    deleteMix,
    updateMix,
};

export default resultApi;