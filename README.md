<h1 align="center">
  <img alt="Fastfeet" title="Fastfeet" src=".github/logo.png" width="300px" />
</h1>

<h3 align="center">
  Challenge 2: FastFeet, the beginning
</h3>

<h3 align="center">
  :warning: Step 1/4 of the Final Challenge :warning:
</h3>

<p>This challenge is part of the Final Challenge, which is a complete application (Back-end, Front-end and Mobile) that is evaluated for issuing the GoStack Bootcamp Certificate, so it is essential that it is done with great effort!</p>

<blockquote align="center">“Don't wait to plant, just be patient to reap”!</blockquote>

<p align="center">
  <img alt="GitHub language count" src="https://img.shields.io/github/languages/count/rocketseat/bootcamp-gostack-desafio-02?color=%2304D361">

  <a href="https://rocketseat.com.br">
    <img alt="Made by Rocketseat" src="https://img.shields.io/badge/made%20by-Rocketseat-%2304D361">
  </a>

  <img alt="License" src="https://img.shields.io/badge/license-MIT-%2304D361">

  <a href="https://github.com/Rocketseat/bootcamp-gostack-desafio-02/stargazers">
    <img alt="Stargazers" src="https://img.shields.io/github/stars/rocketseat/bootcamp-gostack-desafio-02?style=social">
  </a>
</p>

## :rocket: About the challenge

The application that we will start development from now on is an app for a fictitious carrier, the FastFeet.

In this first challenge we are going to create some basic features that we have learned throughout the classes so far. This project will be developed gradually until the end of your journey where you will have a complete application involving back-end, front-end e mobile, that will be used for **Bootcamp Certificate**.

### **About the tools**

You must create the application from scratch using the [Express](https://expressjs.com/), in addition to needing to configure the following tools:

- Sucrase + Nodemon;
- ESLint + Prettier + EditorConfig;
- Sequelize (PostgreSQL or MySQL);

### **Functionalities**

Below are described the features that you must add to your application.

### **1. Authentication**

Allow a user to authenticate to your application using email and a password.

Create an administrator user using the [sequelize seeds](https://sequelize.org/master/manual/migrations.html#creating-first-seed), this functionality serves to create records in the database in an automated way.

To create a seed use the command:

    yarn sequelize seed:generate --name admin-user

In the file generated in the folder `src/database/seeds` add the code for creating an administrator user:

    const bcrypt = require("bcryptjs");

    module.exports = {
      up: QueryInterface => {
        return QueryInterface.bulkInsert(
          "users",
          [
            {
              name: "Distribuidora FastFeet",
              email: "admin@fastfeet.com",
              password_hash: bcrypt.hashSync("123456", 8),
              created_at: new Date(),
              updated_at: new Date()
            }
          ],
          {}
        );
      },

      down: () => {}
    };

Then execute:

    yarn sequelize db:seed:all

Now you have a user in your database, use that user for all your logins.

- Authentication must be done using JWT.
- Perform input data validation;

### 2. Recipient management

You now need to allow recipients to be kept (stored / updated) in the application, and these must have the recipient **name** and address fields: **street**, **house_number**, **complement**, **state**, **city** and **zipcode**.

Use a new table in the database called `recipients` to store recipient information.

Recipient store can only be done by authenticated administrators in the application.

The recipient cannot authenticate himself in the system, that is, he does not have a password.

<br><br>

<h1 align="center">
  <img alt="Fastfeet" title="Fastfeet" src=".github/logo.png" width="300px" />
</h1>

<h3 align="center">
  Challenge 3: FastFeet, continuing the application
</h3>

<h3 align="center">
  :warning: Step 2/4 of the Final Challenge :warning:
</h3>

<p>This challenge is part of the Final Challenge, which is a complete application (Back-end, Front-end and Mobile) that is evaluated for issuing the GoStack Bootcamp Certificate, so it is essential that it is done with great effort!</p>

<blockquote align="center">“Do your best, but always on time”!</blockquote>

<p align="center">
  <img alt="GitHub language count" src="https://img.shields.io/github/languages/count/rocketseat/bootcamp-gostack-desafio-02?color=%2304D361">

  <a href="https://rocketseat.com.br">
    <img alt="Made by Rocketseat" src="https://img.shields.io/badge/made%20by-Rocketseat-%2304D361">
  </a>

  <img alt="License" src="https://img.shields.io/badge/license-MIT-%2304D361">

  <a href="https://github.com/Rocketseat/bootcamp-gostack-desafio-02/stargazers">
    <img alt="Stargazers" src="https://img.shields.io/github/stars/rocketseat/bootcamp-gostack-desafio-02?style=social">
  </a>
</p>

## :rocket: About the challenge

During this challenge, we will improve the FastFeet application that we started in the previous challenge by implementing features that we have learned during classes so far.

### **Administrator features**

Below are the features that you must add to your application for administrators.

### **1. Deliverymen management**

Allow the administrator to register deliverymen for the platform, the deliveryman must have the following fields:

- id;
- name;
- avatar_id (image);
- email;
- created_at;
- updated_at;

Create routes for index/store/update/delete deliverymen (This functionality is for authenticated administrators in the application);

### **2. Delivery management**

Although the deliveryman is registered, he is not independent within the platform, and you must register orders for deliveryman.

In this functionality we will store the deliverys per deliveryman, the delivery has the fields:

- id;
- recipient_id;
- deliveryman_id;
- signature_id(image);
- product;
- canceled_at;
- start_date;
- end_date;
- created_at;
- updated_at;

The **start_date** must be registered as soon as the product is withdrawn by the deliveryman, and withdrawals can only be made between 08:00 and 18:00.

The **end_date** must be registered when the deliveryman completes the delivery.

The fields **recipient_id** and **deliveryman_id** must be registered at the time the delivery is registered.

When the delivery is **registered** for a deliveryman, the deliveryman receives an email with details of the order, with the name of the product and a message informing him that the product is already available for withdraw.

Create routes for index/store/update/delete deliveries (This functionality is for authenticated administrators in the application);

### **Deliveryman features**

Below are described the features that you must add in your application for deliveryman.

### **1. View deliveries**

In order for the deliveryman to view his deliveries, he must inform only his ID (deliveryman_id). This functionality should return the deliveries assigned to him, that **are not delivered or canceled**;

Also allow him to list only the deliveries that have already been **completed** by him, base in his ID (deliveryman_id);

Request example: `GET https://fastfeet.com/deliveryman/1/deliveries`

### 2. Change delivery status

You must allow the deliveryman to have routes to include a pick-up date (start_date) and delivery date (end_date) for orders. The delivery person can only make **5 withdrawals per day**.

PS: For the functionality of finalizing the delivery, you must allow the sending of an image that will fill in the signature_id field of the delivery table.

### 3. Register delivery problems

The deliveryman will not always be able to complete deliveries successfully, sometimes the recipient may be absent, or the deliveryman himself may have a problem with his vehicle when delivering.

The table `delivery_problems` must have the fields below:

- delivery_id;
- description;
- created_at;
- updated_at;

Create a route for the carrier to list all deliveries with a problem;

Create a route to list all problems for an delivery based on the delivery ID.

Request example: `GET https://fastfeet.com/delivery/2/problems`

Create a route for the deliveryman to register delivery problems just by informing the delivery_id (delivery ID in the database);

Request example: `POST https://fastfeet.com/delivery/3/problems`

Create a route for the carrier to cancel a delivery based on the problem ID. This cancellation can happen due to the seriousness of the delivery problem, for example, in case of loss of the order.

Request example: `DELETE https://fastfeet.com/problem/1/cancel-delivery`

When an delivery is canceled, the deliveryman must receive an email informing him of the cancellation.

## 📅 Delivery

This challenge **does not need to be delivered** and will not get corrected. In addition, the source code **is not available** for being part of **the Final Challenge**, that will be corrected for the **bootcamp certification**. After completing the challenge, adding this code to your Github is a good way to demonstrate your knowledge for future opportunities.

## :memo: License

This project is under the MIT license. For more info: [LICENSE](LICENSE.md).

---

Developed by Vinícius Garibaldi Alves (https://www.linkedin.com/in/vinícius-garibaldi-alves-74418b153/)
