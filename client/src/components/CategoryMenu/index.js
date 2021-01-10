import React, { useEffect } from 'react';
import { useQuery } from '@apollo/react-hooks';
import { QUERY_CATEGORIES } from "../../utils/queries";
import { useStoreContext } from "../../utils/GlobalState";
import { UPDATE_CATEGORIES, UPDATE_CURRENT_CATEGORY } from '../../utils/actions';
import { idbPromise } from '../../utils/helpers';

import { useDispatch, useSelector } from "react-redux";
import { updateCurrentCategory, updateCategories } from "../../utils/store/actions";


function CategoryMenu() {
  const { loading, data: categoryData } = useQuery(QUERY_CATEGORIES);
  // const categories = categoryData?.categories || [];
//   const [state, dispatch] = useStoreContext();

// const { categories } = state;

const dispatch = useDispatch();
const categories = useSelector(state => state.reducer.categories)
const cart = useSelector(state => state.reducer.cart)




useEffect(() => {
  if (categoryData) {
    // dispatch({
    //   type: UPDATE_CATEGORIES,
    //   categories: categoryData.categories
    // });
    dispatch(updateCategories(categoryData.categories))
    categoryData.categories.forEach(category => {
      idbPromise('categories', 'put', category);
    });
  } else if (!loading) {
    idbPromise('categories', 'get').then(categories => {
      // dispatch({
      //   type: UPDATE_CATEGORIES,
      //   categories: categories
      // });
      dispatch(updateCategories(categories))
    });
  }
}, [categoryData, loading, dispatch]);

const handleClick = id => {
  // dispatch({
  //   type: UPDATE_CURRENT_CATEGORY,
  //   currentCategory: id
  // });
  dispatch(updateCurrentCategory(id))
};

return (
  <div>
    <h2>Choose a Category:</h2>
    {categories.map(item => (
      <button
        key={item._id}
        onClick={() => {
          handleClick(item._id);
        }}
      >
        {item.name}
      </button>
    ))}
  </div>
);
}

export default CategoryMenu;
