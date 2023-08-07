import React, { useContext, useState } from "react";
import Info from "../Info";
import { RootContext } from "../../App";
function Cart({ onClose, onRemove, items, opened }) {

  const [placeOnOrder, setPlaceOnOrder] = useState(false);
  const { setCartItems } = useContext(RootContext)
  const totalPrice = items.reduce((accum, item) => accum + item.price, 0);

  const onClickOrder = () => {
    setPlaceOnOrder(true)
    setCartItems([])
  }

  return (
    <div className={opened ? 'overlay' : 'overlay overlay-hidden'}>
      <div className={opened ? 'cart-sidepage' : 'cart-sidepage cart-sidepage__hidden'}>
        <div className="cart-sidepage__header">
          <h1>Корзина</h1>
          <button className="cart-sidepage__close" onClick={onClose}>
            <svg
              width="32"
              height="32"
              viewBox="0 0 32 32"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect
                x="0.5"
                y="0.5"
                width="31"
                height="31"
                rx="7.5"
                fill="white"
                stroke="#DBDBDB"
              />
              <path
                d="M20.0799 18.6155L17.6311 16.1667L20.0798 13.718C21.0241 12.7738 19.5596 11.3093 18.6154 12.2536L16.1667 14.7023L13.7179 12.2535C12.7738 11.3095 11.3095 12.7738 12.2535 13.7179L14.7023 16.1667L12.2536 18.6154C11.3093 19.5596 12.7738 21.0241 13.718 20.0798L16.1667 17.6311L18.6155 20.0799C19.5597 21.0241 21.0241 19.5597 20.0799 18.6155Z"
                fill="#B5B5B5"
              />
            </svg>
          </button>
        </div>
        {items.length > 0 ? (
          <>
            <div className="cart-sidepage__items">
              {items.map((card, index) => (
                <div key={index} className="cart-sidepage__wrapper">
                  <div
                    style={{ backgroundImage: `url(${card.imgURL})` }}
                    className="cart-sidepage__card"
                  >
                    <div className="cart-sidepage__inner">
                      <div className="cart-sidepage__productname">
                        <p>{card.title}</p>
                        <strong>{card.price} ₽</strong>
                      </div>

                      <button onClick={() => onRemove(card.id)}>
                        <svg
                          width="32"
                          height="32"
                          viewBox="0 0 32 32"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <rect
                            x="0.5"
                            y="0.5"
                            width="31"
                            height="31"
                            rx="7.5"
                            fill="white"
                            stroke="#DEDEDE"
                          />
                          <path
                            d="M20.0799 18.6155L17.6311 16.1667L20.0798 13.718C21.0241 12.7738 19.5596 11.3093 18.6154 12.2536L16.1667 14.7023L13.7179 12.2535C12.7738 11.3095 11.3095 12.7738 12.2535 13.7179L14.7023 16.1667L12.2536 18.6154C11.3093 19.5596 12.7738 21.0241 13.718 20.0798L16.1667 17.6311L18.6155 20.0799C19.5597 21.0241 21.0241 19.5597 20.0799 18.6155Z"
                            fill="#DEDEDE"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="cart-sidepage__bottom">
              <div>
                <span>Итого:</span>
                <div className="decor-dots"></div>
                <strong>{totalPrice} ₽</strong>
              </div>

              <div>
                <span>Налог 5%:</span>
                <div className="decor-dots"></div>
                <strong>{(totalPrice * (5 / 100)).toFixed(0)} ₽</strong>
              </div>

              <button onClick={onClickOrder} className="cart-sidepage__btn">
                Оформить заказ
              </button>
            </div>
          </>
        ) : (
          <Info
            title={placeOnOrder ? "Заказ оформлен" : "Вы не добавили ничего в корзину"}
            description={ placeOnOrder ? `Ваш заказ номер ${"какой-нибудь номер я хз"} оформлен и будет передан в курьерскую службу` :
              "Добавьте хотя бы одну пару кроссовок, чтобы сделать заказ."
            }
            image={placeOnOrder ? "../../public/assets/complete-order.png" : "../../public/assets/box.jpg"}
          />
        )}
      </div>
    </div>
  );
}

export default Cart;
