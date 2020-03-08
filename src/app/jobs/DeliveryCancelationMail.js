import Mail from '../../lib/Mail';

class DeliveryCancelationMail {
  get key() {
    return 'DeliveryCancelationMail';
  }

  async handle({ data }) {
    const { recipient, deliveryman, delivery } = data;

    await Mail.sendMail({
      to: `${deliveryman.name} <${deliveryman.email}>`,
      subject: 'Delivery Cancelation',
      template: 'deliveryCancelation',
      context: {
        deliveryman: deliveryman.name,
        product: delivery.product,
        recipient: recipient.name,
        street: recipient.street,
        house_number: recipient.house_number,
        complement: recipient.complement,
        state: recipient.state,
        city: recipient.city,
        zipcode: recipient.zipcode,
      },
    });
  }
}
export default new DeliveryCancelationMail();
