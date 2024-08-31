import { css } from "lit";

export const Styles = css`
:host {

  form {
    display: flex;
    align-items: stretch;
    padding: 20px 50px;
    border: 1px solid #ccc;
    border-radius: 15px;
    width: 400px;
    background-color: #ffffff;
    flex-direction: column;
    flex-wrap: nowrap;
    justify-content: center;
    gap: 10px;
  }

  form.rotate {
    transform: rotateY(180deg);
    box-shadow: -5px 5px 15px rgba(0,0,0, .3);
    transform-style: preserve-3d;
    transition: all .8s linear;
  }

  h2 {
    font-size: 24px;
    font-weight: 600;
    margin: 0;
    padding: 5px 0
  }

  button {
    padding: 10px 20px;
    margin: 8px 0;
    border: none;
    border-radius: 15px;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
  }

  button:disabled{
    background-color: #ccc;
    color: #fff;
    cursor: not-allowed;
  }

  .clients {
    display: flex;
    align-items: stretch;
    padding: 20px 50px;
    border: 1px solid #ccc;
    border-radius: 15px;
    width: 400px;
    background-color: #ffffff;
    flex-direction: column;
    flex-wrap: nowrap;
    justify-content: center;
  }

  .clients-list {
    list-style: none;
    li {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      padding: 10px;
      flex-wrap: nowrap;
      align-items: center;
      width: 100%;

      .remove {
        background-color: #f12222;
        color: white;
      }
    }
  }

  .card {
    display: flex;
    flex-direction: column;
    flex-wrap: nowrap;
    align-items: center;
    margin: 50px 0;
  }

  .card.rotate {
    transform: rotateY(180deg);
    box-shadow: -5px 5px 15px rgba(0,0,0, .3);
    transform-style: preserve-3d;
    transition: all .8s linear;
  }
  
  .card-client{
    display: flex;
    flex-direction: column;
  }

  .card form .duo {
    display: flex;
    flex-direction: row;
    align-content: center;
    align-items: center;
    flex-wrap: nowrap;
    justify-content: space-between;
  }

  .actions {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
  }

  .send {
    background-color: #4CAF50;
    color: white;
  }

  .change {
    background-color: #0797f7;
    color: white;
  }
}
`;