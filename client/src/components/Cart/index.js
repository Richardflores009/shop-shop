import React, { useEffect } from "react";
import CartItem from '../CartItem';
import Auth from '../../utils/auth';
import './style.css';
import { QUERY_CHECKOUT } from '../../utils/queries';
import { loadStripe } from '@stripe/stripe-js';
import { useLazyQuery } from '@apollo/react-hooks';


import { useStoreContext } from '../../utils/GlobalState';
import { TOGGLE_CART, ADD_MULTIPLE_TO_CART } from "../../utils/actions";

import { useDispatch, useSelector } from "react-redux";
import { addMultipleToCart, toggleCart } from "../../utils/store/actions";
import { idbPromise } from "../../utils/helpers";
const stripePromise = loadStripe('pk_test_TYooMQauvdEDq54NiTphI7jx');

const Cart = () => {
    // const [state, dispatch] = useStoreContext();
    const dispatch = useDispatch()
    const cart = useSelector(state=> state.reducer.cart)
    const cartOpen = useSelector(state=> state.reducer.cartOpen)
 
    
    
    
    
    const [getCheckout, { data }] = useLazyQuery(QUERY_CHECKOUT);
    
    useEffect(() => {
      async function getCart() {
        const carts = await idbPromise('cart', 'get');
        // dispatch({ type: ADD_MULTIPLE_TO_CART, products: [...cart] });
        dispatch(addMultipleToCart(carts));
      };
      
      if (!cart.length) {
        getCart();
      }
    }, [cart.length, dispatch]);
    
    useEffect(() => {
      if (data) {
        stripePromise.then((res) => {
          res.redirectToCheckout({ sessionId: data.checkout.session });
        });
      }
    }, [data]);

function toggleCarts(state) {
  dispatch(toggleCart());
  
}



function calculateTotal() {
    let sum = 0;
    cart.forEach(item => {
      sum += item.price * item.purchaseQuantity;
    });
    return sum.toFixed(2)
}

function submitCheckout() {
  const productIds = [];

  getCheckout({
    variables: { products: productIds }
  });

  cart.forEach((item) => {
    for (let i = 0; i < item.purchaseQuantity; i++) {
      productIds.push(item._id);
    }
  });
}

if (!cartOpen) {
    return (
      <div className="cart-closed" onClick={ () =>  dispatch(toggleCart())}>
        <span
          role="img"
          aria-label="trash">🛒</span>
      </div>
    );
  }

  return (
    <div className="cart">
  <div className="close" onClick={ () =>  dispatch(toggleCart())}>[close]</div>
  <h2>Shopping Cart</h2>
  {cart.length ? (
    <div>
      {cart.map(item => (
        <CartItem key={item._id} item={item} />
      ))}
      <div className="flex-row space-between">
        <strong>Total: ${calculateTotal()}</strong>
        {
          Auth.loggedIn() ?
          <button onClick={submitCheckout}>
          Checkout
        </button>
        
            :
            <span>(log in to check out)</span>
        }
      </div>
    </div>
  ) : (
    <h3>
      <span role="img" aria-label="shocked">
        😱
      </span>
      You haven't added anything to your cart yet!
    </h3>
  )}
</div>
  );
};

export default Cart;