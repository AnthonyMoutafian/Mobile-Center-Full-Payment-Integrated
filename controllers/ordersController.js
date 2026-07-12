const { ReadDBService } = require("../services/readDBService");

class OrdersController extends ReadDBService {

  async getOrders(req,res){

    try {

      const cart = await req.app.locals.services.cartItems.getCart();

      const data = await req.app.locals.services.users.getDB("users");

      const users = data[0].users;
      const currentUser = data[0].currentUser;


      if(!currentUser || Object.keys(currentUser).length === 0){
        return res.redirect("/api/login");
      }


      const user = users.find(
        user => user.id === currentUser.id
      );


      const paidOrders = user.orders.filter(
        order => order.paid === true
      );


      res.render("orders",{

        cartLength: cart.length,

        currentUser,

        orders: paidOrders

      });


    }catch(err){

      console.log(err);

      res.status(500).send(err.message);

    }

  }

}


module.exports.OrdersController = OrdersController;