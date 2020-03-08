import Delivery from '../models/Delivery';
import Recipient from '../models/Recipient';

class AvailableDeliveryController {
  async index(req, res) {
    const { page = 1 } = req.query;

    const deliveries = await Delivery.findAll({
      where: {
        deliveryman_id: req.params.deliverymanId,
        canceled_at: null,
        end_date: null,
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
}

export default new AvailableDeliveryController();
