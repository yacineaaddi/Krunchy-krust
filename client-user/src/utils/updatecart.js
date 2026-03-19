export function handleAdditional({ e, currItem, item, setCart }) {
  const action = e.currentTarget.dataset.action;

  setCart((prev) => {
    const updated = prev.map((cartItem) => {
      if (cartItem._id !== item._id) return cartItem;

      const existing = cartItem.additional?.find(
        (el) => el._id === currItem._id,
      );

      if (!existing && action === "increase") {
        return {
          ...cartItem,
          additional: [...(cartItem.additional || []), { ...currItem, Qty: 1 }],
        };
      }

      const updatedAdditional = cartItem.additional
        .map((el) => {
          if (el._id !== currItem._id) return el;

          const newQty = action === "increase" ? el.Qty + 1 : el.Qty - 1;

          return { ...el, Qty: newQty };
        })
        .filter((el) => el.Qty > 0);

      return {
        ...cartItem,
        additional: updatedAdditional,
      };
    });

    localStorage.setItem("cart", JSON.stringify(updated));
    return updated;
  });
}

export function updateQty({ e, setCart, item }) {
  const action = e.currentTarget.dataset.action;
  setCart((prev) => {
    const updated = prev.map((currEl) =>
      currEl._id === item._id
        ? {
            ...currEl,
            Qty:
              action === "increase"
                ? currEl.Qty + 1
                : Math.max(1, currEl.Qty - 1),
          }
        : currEl,
    );
    localStorage.setItem("cart", JSON.stringify(updated));
    return updated;
  });
}
