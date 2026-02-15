document.getElementById('loan-form').addEventListener('submit', async function (e) {
    e.preventDefault();

    // Clear previous results and hide the section
    const resultsDiv = document.getElementById('results');
    resultsDiv.classList.remove('visible');
    
    const principal = parseFloat(document.getElementById('principal').value);
    const annualRate = parseFloat(document.getElementById('annualRate').value);
    const months = parseInt(document.getElementById('months').value);

    // Basic validation
    if (isNaN(principal) || isNaN(annualRate) || isNaN(months) || principal <= 0 || annualRate <= 0 || months <= 0) {
        alert("Lütfen tüm alanları doğru bir şekilde doldurun.");
        return;
    }


    try {
        const response = await fetch('/calculate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ principal, annualRate, months }),
        });

        if (!response.ok) {
            throw new Error('Hesaplama sırasında bir hata oluştu.');
        }

        const data = await response.json();
        displayResults(data, principal);

    } catch (error) {
        console.error('Error:', error);
        alert(error.message);
    }
});

function displayResults(data, principal) {
    const { table, totalRepayment, totalInterest } = data;
    const monthlyPayment = (table.length > 0) ? parseFloat(table[0].payment) : 0;

    const summaryDiv = document.getElementById('summary');
    summaryDiv.innerHTML = `
        <div>
            <p>Aylık Taksit</p>
            <strong>${formatCurrency(monthlyPayment)}</strong>
        </div>
        <div>
            <p>Toplam Geri Ödeme</p>
            <strong>${formatCurrency(totalRepayment)}</strong>
        </div>
        <div>
            <p>Toplam Faiz</p>
            <strong>${formatCurrency(totalInterest)}</strong>
        </div>
    `;

    const tableBody = document.querySelector('#amortization-table tbody');
    tableBody.innerHTML = '';

    table.forEach(row => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${row.month}</td>
            <td>${formatCurrency(row.payment)}</td>
            <td>${formatCurrency(row.principal)}</td>
            <td>${formatCurrency(row.interest)}</td>
            <td>${formatCurrency(row.balance)}</td>
        `;
        tableBody.appendChild(tr);
    });

    const resultsDiv = document.getElementById('results');
    resultsDiv.classList.remove('hidden');
    // Add a slight delay to allow the browser to render the element before adding the transition class
    setTimeout(() => {
        resultsDiv.classList.add('visible');
    }, 50);
}

function formatCurrency(value) {
    return new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(value);
}
