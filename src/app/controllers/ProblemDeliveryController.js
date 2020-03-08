import { Op, literal } from 'sequelize';
import Delivery from '../models/Delivery';
import DeliveryProblem from '../models/DeliveryProblem';
import Deliveryman from '../models/Deliveryman';
import Recipient from '../models/Recipient';
import Queue from '../../lib/Queue';
import DeliveryCancelationMail from '../jobs/DeliveryCancelationMail';

class ProblemDeliveryController {
  async index(req, res) {
    const { page = 1 } = req.query;

    const deliveries = await Delivery.findAll({
      where: {
        [Op.and]: literal(
          `EXISTS (SELECT 1
                     FROM "delivery_problems" AS "Problems"
                    WHERE "Problems"."delivery_id" = "Delivery"."id")`
        ),
      },
      order: ['id'],
      attributes: ['id', 'product', 'start_date', 'end_date', 'canceled_at'],
      limit: 20,
      offset: (page - 1) * 20,
    });

    return res.json(deliveries);
  }

  async delete(req, res) {
    const problem = await DeliveryProblem.findByPk(
      req.params.deliveryProblemId
    );

    if (!problem) {
      return res.status(400).json({ error: 'Delivery problem not found.' });
    }

    const delivery = await Delivery.findByPk(problem.delivery_id);

    if (!delivery) {
      return res.status(400).json({ error: 'Delivery not found.' });
    }

    if (delivery.canceled_at) {
      return res
        .status(400)
        .json({ error: 'Delivery has already been canceled.' });
    }

    if (delivery.end_date) {
      return res
        .status(400)
        .json({ error: 'Delivery has already been delivered.' });
    }

    const recipient = await Recipient.findByPk(delivery.recipient_id);
    const deliveryman = await Deliveryman.findByPk(delivery.deliveryman_id);

    await delivery.update({ canceled_at: new Date() });

    await Queue.add(DeliveryCancelationMail.key, {
      delivery,
      recipient,
      deliveryman,
    });

    return res.json(delivery);
  }
}

export default new ProblemDeliveryController();
