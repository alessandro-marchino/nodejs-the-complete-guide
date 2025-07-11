!function() {
  'use strict';
  document.getElementById('order-btn').addEventListener('click', () => {
    stripe.redirectToCheckout({
      sessionId
    });
  });
}()
