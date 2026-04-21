async function createPayment(paymentDetails) {
    const response = await fetch('/v1/payments', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(paymentDetails),
    });
    return response.json();
}

async function getPayment(paymentId) {
    const response = await fetch(`/v1/payments/${paymentId}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });
    return response.json();
}

async function refundPayment(paymentId) {
    const response = await fetch(`/v1/payments/${paymentId}/refund`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
    });
    return response.json();
}

module.exports = { createPayment, getPayment, refundPayment };