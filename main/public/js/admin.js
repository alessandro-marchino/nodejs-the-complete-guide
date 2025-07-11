const deleteProduct = (btn) => {
  const productId = btn.parentNode.querySelector('[name=productId]').value;
  const csrf = btn.parentNode.querySelector('[name=_csrf]').value;

  fetch(`/admin/products/${productId}`, {
    method: 'DELETE',
    headers: {
      'csrf-token': csrf
    }
  })
  .then(res => res.json())
  .then(data => {
    console.log(data);
    btn.closest('article').remove();
  })
  .catch(err => console.log(err));
};
