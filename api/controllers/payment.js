import { db } from "../connect.js";
import { checkoutSchema } from "../validations/PaymentValidations.js";

export const processCheckout = async (req, res) => {
  const user_id = req.user?.id;

  if (!user_id) {
    return res
      .status(401)
      .json({ message: "Bu işlem için giriş yapmalısınız." });
  }
  const validationResult = checkoutSchema.safeParse(req.body);

  if (!validationResult.success) {
    return res.status(400).json({
      message: validationResult.error.issues[0].message,
    });
  }
  const {
    car_id,
    start_date,
    end_date,
    pickup_location_id,
    return_location_id,
    packet_id,
    extras,
    totalPrice,
    cardDetails,
  } = validationResult.data;

  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();

    const checkAvailabilityQuery = `
      SELECT id 
      FROM rentals 
      WHERE car_id = ? 
        AND status IN ('confirmed', 'active') 
        AND start_date < ? 
        AND end_date > ?
      FOR UPDATE
    `;

    const [existingRentals] = await connection.query(checkAvailabilityQuery, [
      car_id,
      end_date,
      start_date,
    ]);

    if (existingRentals.length > 0) {
      await connection.rollback();
      return res.status(409).json({
        message:
          "Üzgünüz, bu araç seçtiğiniz tarihler arasında başka biri tarafından rezerve edilmiş.",
      });
    }

    const rentalQuery = `
        INSERT INTO rentals (car_id, start_date, end_date, pickup_location_id, return_location_id, packet_id, user_id)
        VALUES (?,?,?,?,?,?,?)
        `;

    const [rentalRes] = await connection.query(rentalQuery, [
      car_id,
      start_date,
      end_date,
      pickup_location_id,
      return_location_id,
      packet_id,
      user_id,
    ]);

    const newRentalId = rentalRes.insertId;

    if (extras && extras.length > 0) {
      const extraQuery = `INSERT INTO rentals_extra (rental_id, extra_id, price, user_id) VALUES (?, ?, ?, ?)`;
      for (const extra of extras) {
        await connection.query(extraQuery, [
          newRentalId,
          extra.id,
          extra.price,
          user_id,
        ]);
      }
    }

    const cardLastFour = cardDetails.cardNumber.slice(-4);
    const paymentQuery = `
            INSERT INTO payments (user_id, rental_id, totalprice, card_type, card_last_four, status)
            VALUES (?, ?, ?, ?, ?, 'success')
        `;
    await connection.query(paymentQuery, [
      user_id,
      newRentalId,
      totalPrice,
      cardDetails.cardType || "Credit",
      cardLastFour,
    ]);

    await connection.commit();

    return res.status(200).json({
      message: "Ödeme alındı ve kiralama başarıyla oluşturuldu",
      rental_id: newRentalId,
    });
  } catch (error) {
    await connection.rollback();
    console.log("Checkout işlem hatası: ", error);
    return res
      .status(500)
      .json({ message: "İşlem sırasında bir hata oluştu.", error });
  } finally {
    connection.release();
  }
};
