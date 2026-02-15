import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 3000;

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

// Anüite formülü ile aylık taksit hesaplayan fonksiyon
function calculateMonthlyPayment(principal, annualRate, months) {
  const monthlyRate = annualRate / 12 / 100;
  if (monthlyRate === 0) {
    return principal / months;
  }
  const monthlyPayment =
    principal *
    (monthlyRate * Math.pow(1 + monthlyRate, months)) /
    (Math.pow(1 + monthlyRate, months) - 1);
  return monthlyPayment;
}

// Amortization tablosu üreten fonksiyon
function generateAmortizationTable(principal, annualRate, months, monthlyPayment) {
  let balance = principal;
  const table = [];
  const monthlyRate = annualRate / 12 / 100;

  for (let i = 1; i <= months; i++) {
    const interest = balance * monthlyRate;
    const principalPaid = monthlyPayment - interest;
    balance -= principalPaid;

    table.push({
      month: i,
      payment: monthlyPayment.toFixed(2),
      principal: principalPaid.toFixed(2),
      interest: interest.toFixed(2),
      balance: balance.toFixed(2),
    });
  }

  return table;
}

app.post('/calculate', (req, res) => {
  const { principal, annualRate, months } = req.body;

  if (!principal || !annualRate || !months) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const monthlyPayment = calculateMonthlyPayment(principal, annualRate, months);
  const totalRepayment = monthlyPayment * months;
  const totalInterest = totalRepayment - principal;

  const table = generateAmortizationTable(
    principal,
    annualRate,
    months,
    monthlyPayment
  );

  res.json({
    table,
    totalRepayment,
    totalInterest,
  });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
