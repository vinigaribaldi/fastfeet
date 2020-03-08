import * as Yup from 'yup';
import { Op } from 'sequelize';
import Delivery from '../models/Delivery';
import Recipient from '../models/Recipient';
import Deliveryman from '../models/Deliveryman';
import File from '../models/File';

class CompleteDeliveryController {
  async index(req, res) {
    const { page = 1 } = req.query;

    const deliveries = await Delivery.findAll({
      where: {
        deliveryman_id: req.params.deliverymanId,
        canceled_at: null,
        end_date: {
          [Op.ne]: null,
        },
      },
      order: ['product'],
      attributes: ['id', 'product', 'start_date'],
      limit: 20,
      offset: (page - 1) * 20,
      include: [
        {
          model: Recipient,
          as: 'recipient',
          attributes: [
            'name',
            'street',
            'house_number',
            'complement',
            'state',
            'city',
            'zipcode',
          ],
        },
      ],
    });

    return res.json(deliveries);
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      deliveryman_id: Yup.number().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails.' });
    }

    const { deliveryman_id, signature_id } = req.body;

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
        start_date: {
          [Op.ne]: null,
        },
        end_date: null,
        canceled_at: null,
      },
    });

    if (!delivery) {
      return res.status(400).json({
        error:
          'Delivery does not exists, has not started or is not available for this deliveryman.',
      });
    }

    if (signature_id) {
      const signature = await File.findByPk(signature_id);

      if (!signature) {
        return res
          .status(400)
          .json({ error: 'Signature file does not exists.' });
      }

      delivery.signature_id = signature_id;
    }

    delivery.end_date = new Date();

    await delivery.save();

    return res.json(delivery);
  }
}

export default new CompleteDeliveryController();
