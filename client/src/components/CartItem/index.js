import React from "react";
import { useStoreContext } from '../../utils/GlobalState';
import { REMOVE_FROM_CART, UPDATE_CART_QUANTITY } from '../../utils/actions';
import { idbPromise } from "../../utils/helpers";
import { useDispatch, useSelector } from "react-redux";
import { removeFromCarts, updateCartQuantity } from "../../utils/store/actions";

const CartItem = ({ item }) => {
  // const [, dispatch] = useStoreContext();
  const dispatch = useDispatch();
  const cart = useSelector(state => state.reducer.cart)
  
    const removeFromCart = item => {
      console.log(item)
      // dispatch({
      //   type: REMOVE_FROM_CART,
      //   _id: item._id
      // });
      dispatch(removeFromCarts(item));
      idbPromise('cart', 'delete', { ...item });
    };

const onChange = (e) => {
    const value = e.target.value;
  
    if (value <= 0) {
      console.log(value)
      // dispatch({
        //   type: REMOVE_FROM_CART,
        //   _id: item._id
        // });
        dispatch(removeFromCarts(item));
        
        idbPromise('cart', 'delete', { ...item });
      } else {
      
      // dispatch({
      //   type: UPDATE_CART_QUANTITY,
      //   _id: item._id,
      //   purchaseQuantity: parseInt(value)
      // });
      dispatch(updateCartQuantity(item._id,value));
      console.log(item._id,value)
    
      idbPromise('cart', 'put', { ...item, purchaseQuantity: parseInt(value) });
    }
  };
  return (
    <div className="flex-row">
      <div>
        <img
          src={`/images/${item.image}`}
          alt=""
        />
      </div>
      <div>
        <div>{item.name}, ${item.price}</div>
        <div>
          <span>{`Qty:`}</span>
          <input
            type="number"
            placeholder="1"
            value={item.purchaseQuantity}
            onChange={onChange}
            />
          <span
            role="img"
            aria-label="trash"
            onClick={() => removeFromCart(item)}
            >
            🗑️
            </span>

        </div>
      </div>
    </div>
  );
}

export default CartItem;