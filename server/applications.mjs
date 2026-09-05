const INSERT_APPLICATION = `
  INSERT INTO applications
    (first_name, last_name, phone, event_date, city, venue, messenger, event_type, order_type, wishes, cart_items)
  VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11::jsonb)
  RETURNING id
`;

export async function createApplication(pool, application) {
  const values = [
    application.first_name,
    application.last_name,
    application.phone,
    application.event_date,
    application.city,
    application.venue,
    application.messenger,
    application.event_type,
    application.order_type,
    application.wishes || null,
    JSON.stringify(application.cart_items),
  ];
  const result = await pool.query(INSERT_APPLICATION, values);
  const id = result.rows?.[0]?.id;
  if (id === undefined || id === null) throw new Error("PostgreSQL не вернул id заявки");
  return id;
}

export { INSERT_APPLICATION };
