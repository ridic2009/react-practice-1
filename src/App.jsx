import Cart from "./components/Cart";
import Home from "./pages/Home";
import Header from "./components/Header";
import { Route, Routes } from "react-router-dom";
import { createContext, useEffect, useState } from "react";
import Favorites from "./pages/Favorites";

export const RootContext = createContext({});

function App() {
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      // Запрос товаров для рендера в главной части
      const response = await fetch(
        "https://6499727d79fbe9bcf83f4533.mockapi.io/items"
      );

      const data = await response.json();

      // Запрос товаров для корзины
      const responseForCart = await fetch(
        "https://6499727d79fbe9bcf83f4533.mockapi.io/cart"
      );
      const dataForCart = await responseForCart.json();

      const responseForFavorites = await fetch(
        "https://64bb72ab5e0670a501d7089b.mockapi.io/Favorites"
      );

      const dataForFavorites = await responseForFavorites.json();

      setItems(data);
      setCartItems(dataForCart);
      setFavoriteItems(dataForFavorites);
      setIsLoading(false);
    };

    fetchData();
  }, []);

  // Добавление товаров из корзины в Backend для последующего запроса при загрузке страницы
  const fetchDataToBackend = async obj => {
    const response = await fetch(
      "https://6499727d79fbe9bcf83f4533.mockapi.io/cart",
      {
        method: "post",
        headers: {
          "Content-Type": "application/json;charset=utf-8"
        },
        body: JSON.stringify(obj)
      }
    );

    const data = await response.json();

    return data;
  };

  const fetchFavoritesToBackend = async obj => {
    const response = await fetch(
      "https://64bb72ab5e0670a501d7089b.mockapi.io/Favorites",
      {
        method: "post",
        headers: {
          "Content-Type": "application/json;charset=utf-8"
        },
        body: JSON.stringify(obj)
      }
    );

    const data = await response.json();
    return data;
  };

  // Стэйты

  const [favoriteItems, setFavoriteItems] = useState([]);
  const [items, setItems] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [cartOpened, setCartOpened] = useState(false);
  const [isLoading, setIsLoading] = useState(false);


  // Функция добавления определённого товара в корзину
  const onAddToCart = card => {
    const isCardAdded = cartItems.some(item => item.id === card.id);

    if (!isCardAdded) {
      fetchDataToBackend(card);
      setCartItems(prev => [...prev, card]);
    }
  };

  // Функция удаления определённого товара из корзины
  const onRemoveFromCart = id => {
    fetch(`https://6499727d79fbe9bcf83f4533.mockapi.io/cart/${id}`, {
      method: "delete",
      headers: {
        "Content-Type": "application/json;charset=utf-8"
      }
    });

    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  // Функция добавления товара в избранное
  const onAddToFavorite = async card => {
    try {
      if (favoriteItems.find(item => item.id === card.id)) {
        fetch(
          `https://64bb72ab5e0670a501d7089b.mockapi.io/Favorites/${card.id}`,
          {
            method: "delete",
            headers: {
              "Content-Type": "application/json;charset=utf-8"
            }
          }
        );

        setFavoriteItems(prev => prev.filter(item => item.id !== card.id));
      } else {
        const resp = await fetchFavoritesToBackend(card);
        setFavoriteItems(prev => [...prev, resp]);
      }
    } catch (error) {
      console.error("Что-то пошло не так", error);
    }
  };

  // Функция поиска по товарам
  const onChangeSearchValue = event => {
    setSearchValue(event.target.value);
  };

  return (
    <RootContext.Provider
      value={{ favoriteItems, items, cartItems, setCartOpened, setCartItems }}
    >
      <div className="page">
        {cartOpened && (
          <Cart
            items={cartItems}
            onClose={() => setCartOpened(false)}
            onRemove={onRemoveFromCart}
          />
        )}

        <Header handleCartOpen={() => setCartOpened(true)} items={cartItems} />

        <Routes>
          <Route
            path="/"
            element={
              <Home
                items={items}
                searchValue={searchValue}
                setSearchValue={setSearchValue}
                onChangeSearchValue={onChangeSearchValue}
                onAddToCart={onAddToCart}
                onAddToFavorite={onAddToFavorite}
                isLoading={isLoading}
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
          ></Route>
        </Routes>
      </div>
    </RootContext.Provider>
  );
}

export default App;
