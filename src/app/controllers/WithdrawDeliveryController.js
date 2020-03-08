import * as Yup from 'yup';
import {
  startOfDay,
  endOfDay,
  setHours,
  setMinutes,
  setSeconds,
  isAfter,
  isBefore,
} from 'date-fns';
import { Op } from 'sequelize';
import Delivery from '../models/Delivery';
import Deliveryman from '../models/Deliveryman';

class WithdrawDeliveryController {
  async update(req, res) {
    const schema = Yup.object().shape({
      deliveryman_id: Yup.number().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails.' });
    }

    const { deliveryman_id } = req.body;

    const deliveryman = await Deliveryman.findByPk(deliveryman_id);

    if (!deliveryman) {
      return res.status(400).json({
        error: 'Deliveryman does not exists.',
      });
    }

    const { deliveryId } = req.params;

    const delivery = await Delivery.findOne({
      where: {
        id: deliveryId,
        deliveryman_id: deliveryman.id,
        start_date: null,
        canceled_at: null,
      },
    });

    if (!delivery) {
      return res.status(400).json({
        error:
          'Delivery does not exists or is not available for this deliveryman.',
      });
    }

    const date = new Date();
    const hourStart = setSeconds(setMinutes(setHours(date, 8), 0), 0);
    const hourEnd = setSeconds(setMinutes(setHours(date, 18), 0), 0);

    if (isBefore(date, hourStart) || isAfter(date, hourEnd)) {
      return res.status(400).json({
        error: 'You can only withdraw a delivery between 08:00 and 18:00.',
      });
    }

    const deliveriesCounter = await Delivery.count({
      where: {
        deliveryman_id: deliveryman.id,
        start_date: {
          [Op.between]: [startOfDay(date), endOfDay(date)],
        },
      },
    });

    if (deliveriesCounter >= 5) {
      return res.status(400).json({
        error: 'You can only withdraw 5 deliveries per day.',
      });
    }

    await delivery.update({ start_date: date });

    return res.json(delivery);
  }
}

export default new WithdrawDeliveryController();
