export function calculateTotalPrice({ cart }) {
  return cart.reduce((acc, cur) => {
    const AdditionalPrice = cur.additional.reduce((acc, cur) => {
      return acc + cur.price * cur.Qty;
    }, 0);

    const itemPrice = cur.price * cur.Qty;
    return acc + itemPrice + AdditionalPrice;
  }, 0);
}

export function calculateOrderPrice({ item }) {
  return item.price * item.Qty;
}

export function calculateAdditionalPrice({ item }) {
  return item.additional.reduce((accumulator, currentValue) => {
    let orderPrice = currentValue.price * currentValue.Qty + accumulator;

    return orderPrice;
  }, 0);
}
