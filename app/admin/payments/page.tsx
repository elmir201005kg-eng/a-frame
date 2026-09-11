import prisma from '@/lib/prisma';

async function getPayments() {
  return await prisma.payment.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      user: {
        select: {
          firstName: true,
          lastName: true,
        },
      },
      booking: {
        select: {
          bookingNumber: true,
          cabin: {
            select: {
              title: true,
            },
          },
        },
      },
    },
  });
}

export default async function PaymentsPage() {
  const payments = await getPayments();

  return (
    <div className="admin-table-container">
      <div className="admin-table-header">
        <h2 className="admin-table-title">Платежи ({payments.length})</h2>
      </div>

      <table className="admin-table">
        <thead>
          <tr>
            <th>ID транзакции</th>
            <th>Пользователь</th>
            <th>Бронирование</th>
            <th>Сумма</th>
            <th>Способ оплаты</th>
            <th>Статус</th>
            <th>Дата оплаты</th>
          </tr>
        </thead>
        <tbody>
          {payments.map((payment) => (
            <tr key={payment.id}>
              <td>
                <code style={{ fontSize: '0.75rem' }}>
                  {payment.transactionId || payment.id.slice(0, 12)}
                </code>
              </td>
              <td>{`${payment.user.firstName} ${payment.user.lastName}`}</td>
              <td>
                <div>#{payment.booking.bookingNumber}</div>
                <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                  {payment.booking.cabin.title}
                </div>
              </td>
              <td style={{ fontWeight: 600 }}>
                {Number(payment.amount).toLocaleString()} {payment.currency}
              </td>
              <td>{payment.paymentMethod}</td>
              <td>
                <span
                  className={`admin-badge ${
                    payment.status === 'PAID'
                      ? 'admin-badge-success'
                      : payment.status === 'PENDING'
                      ? 'admin-badge-warning'
                      : payment.status === 'FAILED'
                      ? 'admin-badge-danger'
                      : 'admin-badge-info'
                  }`}
                >
                  {payment.status === 'PAID'
                    ? 'Оплачено'
                    : payment.status === 'PENDING'
                    ? 'Ожидает'
                    : payment.status === 'FAILED'
                    ? 'Ошибка'
                    : 'Возврат'}
                </span>
              </td>
              <td>
                {payment.paidAt
                  ? new Date(payment.paidAt).toLocaleString('ru-RU')
                  : '—'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
