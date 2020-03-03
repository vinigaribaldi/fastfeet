import * as Yup from 'yup';
import Delivery from '../models/Delivery';
import Deliveryman from '../models/Deliveryman';
import Recipient from '../models/Recipient';
import File from '../models/File';
import Queue from '../../lib/Queue';
import DeliveryConfirmationMail from '../jobs/DeliveryConfirmationMail';

class DeliveryController {
  async index(req, res) {
    const { page = 1 } = req.query;

    const deliveries = await Delivery.findAll({
      where: { canceled_at: null },
      order: ['product'],
      attributes: ['id', 'product', 'start_date', 'end_date', 'canceled_at'],
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
        {
          model: Deliveryman,
          as: 'deliveryman',
          attributes: ['name', 'email'],
          include: [
            {
              model: File,
              as: 'avatar',
              attributes: ['path', 'url'],
            },
          ],
        },
        {
          model: File,
          as: 'signature',
          attributes: ['path', 'url'],
        },
      ],
    });

    return res.json(deliveries);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      recipient_id: Yup.number().required(),
      deliveryman_id: Yup.number().required(),
      product: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails.' });
    }

    const { recipient_id, deliveryman_id } = req.body;

    /**
     * Check if recipient exists
     */
    const recipient = await Recipient.findByPk(recipient_id);

    if (!recipient) {
      return res.status(400).json({
        error: 'You can only create a delivery to an existing recipient.',
      });
    }

    /**
     * Check if deliveryman exists
     */
    const deliveryman = await Deliveryman.findByPk(deliveryman_id);

    if (!deliveryman) {
      return res.status(400).json({
        error: 'You can only create a delivery to an existing deliveryman.',
      });
    }

    const delivery = await Delivery.create(req.body);

    await Queue.add(DeliveryConfirmationMail.key, {
      delivery,
      recipient,
      deliveryman,
    });

    return res.json(delivery);
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      recipient_id: Yup.number().required(),
      deliveryman_id: Yup.number().required(),
      product: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails.' });
    }

    const { id } = req.params;
    const { recipient_id, deliveryman_id } = req.body;

    const delivery = await Delivery.findByPk(id);

    if (!delivery) {
      return res.status(400).json({ error: 'Delivery not found.' });
    }

    if (recipient_id && recipient_id !== delivery.recipient_id) {
      const recipientExists = await Recipient.findByPk(recipient_id);

      if (!recipientExists) {
        return res.status(400).json({
          error: 'You can only update a delivery to an existing recipient.',
        });
      }
    }

    if (deliveryman_id && deliveryman_id !== delivery.deliveryman_id) {
      const deliverymanExists = await Deliveryman.findByPk(deliveryman_id);

      if (!deliverymanExists) {
        return res.status(400).json({
          error: 'You can only update a delivery to an existing deliveryman.',
        });
      }
    }

    await delivery.update(req.body);

    return res.json(delivery);
  }

  async delete(req, res) {
    const delivery = await Delivery.findByPk(req.params.id);

    if (!delivery) {
      return res.status(400).json({ error: 'Delivery not found.' });
    }

    await delivery.destroy();

    return res.json();
  }
}

export default new DeliveryController();
