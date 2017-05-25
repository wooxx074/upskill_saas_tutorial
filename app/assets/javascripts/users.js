/* global $, Stripe*/
// Document ready 
$(document).on('turbolinks:load', function(){
  var theForm = $('#pro_form');
  var submitBtn = $('#form-signup-btn');
  // Set Stripe public key
  Stripe.setPublishableKey($('meta[name="stripe-key"]').attr('content') );
  
  // When user clicks form submit button, prevent default submission behavior
  submitBtn.click(function(event){
    event.preventDefault();
    submitBtn.val("Processing").prop('disabled', true);
    
    // Collect credit card fields, 
    var ccNum = $('#card_number').val(),
        cvcNum = $('#card_code').val(),
        expMonth= $('#card_month').val(),
        expYear = $('#card_year').val();
        
    // Use Stripe JS library to validated card info
    var error = false;
    
    // Validate card number.
    if(!Stripe.card.validateCardNumber(ccNum)) {
      error = true;
      alert('The credit card number appears to be invalid');
    }
    // Validate cvc number
    if(!Stripe.card.validateCVC(cvcNum)) {
      error = true;
      alert('The CVC number appears to be invalid');
    }
    // Validated expiration date
    if(!Stripe.card.validateExpiry(expMonth, expYear)) {
      error = true;
      alert('The expiration date appears to be invalid');
    }
    
    
    if (error) {
      // If there are card errors, don't send to Stripe
      submitBtn.prop('disabled', false).val("Sign Up");
    } else {
      // Send card info to stripe
      Stripe.createToken({
        number: ccNum,
        cvc: cvcNum,
        exp_month: expMonth,
        exp_year: expYear
        
      }, stripeResponseHandler);
    });
  };
  // Stripe will return a card token
  
  function stripeResponseHandler(status, response) {
    var token = response.id
  
    // Inject card token as hidden field into form
    theForm.append( $('<input type="hidden" name="user[stripe_card_token]">').val(token) );
  
  // Submit form into Rails app
  theForm.get(0).submit();
    
  }
  
  return false
});