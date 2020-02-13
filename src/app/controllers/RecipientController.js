import * as Yup from 'yup';
import Recipient from '../models/Recipient';

class RecipientController {
  async index(req, res) {
    const recipients = await Recipient.findAll();

    return res.json(recipients);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      street: Yup.string().required(),
      house_number: Yup.string().required(),
      complement: Yup.string(),
      state: Yup.string().required(),
      city: Yup.string().required(),
      zipcode: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails.' });
    }

    const recipientExists = await Recipient.findOne({
      where: { name: req.body.name },
    });

    if (recipientExists) {
      return res.status(400).json({ error: 'Recipient already exists.' });
    }

    const {
      id,
      name,
      street,
      house_number,
      complement,
      state,
      city,
      zipcode,
    } = await Recipient.create(req.body);

    return res.json({
      id,
      name,
      street,
      house_number,
      complement,
      state,
      city,
      zipcode,
    });
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      street: Yup.string().required(),
      house_number: Yup.string().required(),
      complement: Yup.string(),
      state: Yup.string().required(),
      city: Yup.string().required(),
      zipcode: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails.' });
    }

    const { name } = req.body;

    const recipient = await Recipient.findByPk(req.params.id);

    if (!recipient) {
      return res.status(400).json({ error: 'Recipient not found.' });
    }

    if (name && name !== recipient.name) {
      const recipientExists = await Recipient.findOne({ where: { name } });

      if (recipientExists) {
        return res.status(400).json({ error: 'Recipient already exists.' });
      }
    }

    const {
      id,
      street,
      house_number,
      complement,
      state,
      city,
      zipcode,
    } = await recipient.update(req.body);

    return res.json({
      id,
      name,
      street,
      house_number,
      complement,
      state,
      city,
      zipcode,
    });
  }
}

export default new RecipientController();
