var paypal = require('paypal-rest-sdk');

paypal.configure({
    'mode': 'sandbox', //sandbox or live
    'client_id': 'ASKKEX_sZxG_oNS_7O5RtYg53VuuKP66lUpzq6HXAcvRBU9ThgbXlN8eHfl0MJ56jEygYP5lXhzDpkFv',
    'client_secret': 'EMOLK7XxEvM3mmQ7pnKpydaI8J2PFl_qcC2O975OtBz3WH1Bz4wdTi0O5G015eOfokCY5Gz3T3Mi68Q6'
  });

  var create_payment_json = {
    "intent": "sale",
    "payer": {
        "payment_method": "paypal"
    },
    "redirect_urls": {
        "return_url": "http://localhost:3000/success",
        "cancel_url": "http://localhost:3000/cancel"
    },
    "transactions": [{
        "item_list": {
            "items": [{
                "name": "item",
                "sku": "item",
                "price": "100.00",
                "currency": "USD",
                "quantity": 1
            }]
        },
        "amount": {
            "currency": "USD",
            "total": "100.00"
        },
        "description": "This is the payment description."
    }]
};




function paypalPay(req,res){
    paypal.payment.create(create_payment_json, function (error, payment) {
        if (error) {
            res.status(400).send(error)
        } else {
           for(let i = 0 ; i<payment.links.length; i++){
               if(payment.links[i].rel === 'approval_url'){
                 res.redirect(payment.links[i].href)
               }
           }
            //res.status(200).send(payment)
        }
    });
}

module.exports = {
    paypalPay
}