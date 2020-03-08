import * as Yup from 'yup';
import DeliveryProblem from '../models/DeliveryProblem';
import Delivery from '../models/Delivery';

class DeliveryProblemController {
  async index(req, res) {
    const { page = 1 } = req.query;

    const problems = await DeliveryProblem.findAll({
      where: {
        delivery_id: req.params.deliveryId,
      },
      order: ['id'],
      attributes: ['id', 'description'],
      limit: 20,
      offset: (page - 1) * 20,
    });

    return res.json(problems);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      description: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails.' });
    }

    const { deliveryId } = req.params;

    /**
     * Check if delivery exists
     */
    const delivery = await Delivery.findByPk(deliveryId);

    if (!delivery) {
      return res.status(400).json({
        error: 'You can only describe a problem to an existing delivery.',
      });
    }

    const problem = await DeliveryProblem.create({
      delivery_id: delivery.id,
      description: req.body.description,
    });

    return res.json(problem);
  }
}

export default new DeliveryProblemController();
