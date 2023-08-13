import Cart from "./components/Cart";
import Home from "./pages/Home";
import Header from "./components/Header";
import Favorites from "./pages/Favorites";

import { Route, Routes } from "react-router-dom";
import { createContext, useEffect, useState } from "react";
import axios from "axios";

export const RootContext = createContext({});

function App() {
  useEffect(() => {
    try {
      const fetchData = async () => {
        setIsLoading(true);

        const response = await fetch(
          "https://6499727d79fbe9bcf83f4533.mockapi.io/items"
        );
        const data = await response.json();

        const responseForCart = await fetch(
          "https://6499727d79fbe9bcf83f4533.mockapi.io/cart"
        );
        const dataForCart = await responseForCart.json();

        const responseForFavorites = await fetch(
          "https://64cdf8620c01d81da3ee6656.mockapi.io/favorites"
        );
        const dataForFavorites = await responseForFavorites.json();

        setItems(data);
        setCartItems(dataForCart);
        setFavoriteItems(dataForFavorites);

        setIsLoading(false);
      };

      fetchData();
    } catch (error) {
      alert("Ошибка при запросе данных с backend", error);
    }
  }, []);

  // Стэйты
  const [favoriteItems, setFavoriteItems] = useState([]);
  const [items, setItems] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [cartOpened, setCartOpened] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [placeOnOrder, setPlaceOnOrder] = useState(false);

  // Функция добавления определённого товара в корзину
  const onAddToCart = async card => {
    try {
      const findItem = cartItems.find(
        item => Number(item.parentId) === Number(card.id)
      );
      if (findItem) {
        setCartItems(prev =>
          prev.filter(item => Number(item.parentId) !== Number(card.id))
        );
        axios.delete(
          `https://6499727d79fbe9bcf83f4533.mockapi.io/cart/${findItem.id}`
        );
      } else {
        setCartItems(prev => [...prev, card]);
        const { data } = await axios.post(
          "https://6499727d79fbe9bcf83f4533.mockapi.io/cart",
          card
        );
        setCartItems(prev => prev.map(item => {

          if (item.parentId === data.parentId) {
            return {
              ...item, 
              id: data.id
            }
          }

          return item
        }));
      }
    } catch (error) {
      alert("Ошибка при добавлении в корзину", error);
      console.log(error);
    }
  };

  // Функция удаления определённого товара из корзины
  const onRemoveFromCart = id => {
    try {
      setCartItems(prev => prev.filter(item => item.id !== id));
      axios.delete(`https://6499727d79fbe9bcf83f4533.mockapi.io/cart/${id}`);


    } catch (error) {
      alert("Ошибка при удалении из корзины", error);
      console.error(error);
    }
  };

  // Функция добавления товара в избранное
  const onAddToFavorite = async card => {
    try {
      if (favoriteItems.find(item => item.id === card.id)) {
        axios.delete(
          `https://64cdf8620c01d81da3ee6656.mockapi.io/favorites/${card.id}`
        );
        setFavoriteItems(prev => prev.filter(item => item.id !== card.id));

      } else {

        const { data } = await axios.post(
          "https://64cdf8620c01d81da3ee6656.mockapi.io/favorites", card
        );

        setFavoriteItems(prev => [...prev, data]);
      }
    } catch (error) {
      alert("Ошибка при добавлении в избранное", error);
    }
  };

  // Функция поиска по товарам
  const onChangeSearchValue = event => {
    setSearchValue(event.target.value);
  };

  const isItemAdded = id => {
    return cartItems.some(obj => Number(obj.parentId) === Number(id));
  };

  return (
    <RootContext.Provider
      value={{
        favoriteItems,
        items,
        cartItems,
        placeOnOrder,
        setCartOpened,
        setCartItems,
        setPlaceOnOrder,
        isItemAdded
      }}
    >
      <div className="page">
        <Cart
          items={cartItems}
          onClose={() => setCartOpened(false)}
          onRemove={onRemoveFromCart}
          opened={cartOpened}
        />

        <Header handleCartOpen={() => {
          setCartOpened(true)
          setPlaceOnOrder(false)
        }} items={cartItems} />

        <Routes>
          <Route
            exact
            path="/"
            element={
              <Home
                items={items}
                searchValue={searchValue}
                isLoading={isLoading}
                setSearchValue={setSearchValue}
                onChangeSearchValue={onChangeSearchValue}
                onAddToCart={onAddToCart}
                onAddToFavorite={onAddToFavorite}

              />
            }

          ></Route>
          <Route
            path="/favorites"
            element={
              <Favorites
                searchValue={searchValue}
                onChangeSearchValue={onChangeSearchValue}
                onAddToFavorite={onAddToFavorite}
              />
            }
            exact
          ></Route>
        </Routes>
      </div>
    </RootContext.Provider>
  );
}

export default App;
