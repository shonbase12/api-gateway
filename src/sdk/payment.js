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

module.exports = { createPayment };