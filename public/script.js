document.getElementById('loan-form').addEventListener('submit', async function (e) {
    e.preventDefault();

    const principal = parseFloat(document.getElementById('principal').value);
    const annualRate = parseFloat(document.getElementById('annualRate').value);
    const months = parseInt(document.getElementById('months').value);

    const response = await fetch('/calculate', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ principal, annualRate, months }),
    });

    const data = await response.json();

    displayResults(data);
});

function displayResults(data) {
    const { table, totalRepayment, totalInterest } = data;

    const summaryDiv = document.getElementById('summary');
    summaryDiv.innerHTML = `
        <p><strong>Toplam Geri Ödeme:</strong> ${totalRepayment.toFixed(2)}</p>
        <p><strong>Toplam Faiz:</strong> ${totalInterest.toFixed(2)}</p>
    `;

    const tableBody = document.querySelector('#amortization-table tbody');
    tableBody.innerHTML = '';

    table.forEach(row => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${row.month}</td>
            <td>${row.payment}</td>
            <td>${row.principal}</td>
            <td>${row.interest}</td>
            <td>${row.balance}</td>
        `;
        tableBody.appendChild(tr);
    });

    document.getElementById('results').classList.remove('hidden');
}
