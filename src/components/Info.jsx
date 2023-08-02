import React, { useContext } from "react";
import { RootContext } from "../App";

function Info({ title, image, description }) {

  const { setCartOpened } = useContext(RootContext);

  return (
    <div className="empty">
      <img src={image} alt="image" />
      <h2>{title}</h2>
      <p>{description}</p>
      <button
        onClick={() => setCartOpened(false)}
        className="cart-sidepage__btn btn-close"
      >
        Назад
      </button>
    </div>
  );
}

export default Info;
